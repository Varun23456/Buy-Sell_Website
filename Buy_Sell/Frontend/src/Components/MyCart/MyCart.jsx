import React, { useContext, useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import axios from "axios";
import CartContext from "../../Context/CartContext";
import { useNavigate } from "react-router-dom";

function MyCart() {
    const navigate = useNavigate();
    const { Mycart, setMycart } = useContext(CartContext);
    const [Total, setTotal] = useState(0);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/validate", {
                    withCredentials: true,
                });
                if (response.status === 201) {
                    navigate("/MyCart");
                } else {
                    navigate("/");
                }
            } catch (error) {
                navigate("/");
            }
        };

        checkAuth();
    }, [navigate]);

    function set(items) {
        setMycart(items)
    }


    useEffect(() => {
        console.log("front-end")
        const getmycartitems = async () => {
            try {
                const response = await axios.post("http://localhost:4000/api/getMycartItems", { message: "getitems" }, {
                    withCredentials: true,
                });
                if (response.status === 201) {
                    set(response.data.items)
                } else {
                    alert("Error while loading your CartItems.")
                }
            } catch (error) {
                //    throw error;
                alert("Error while loading your CartItems.")
            }
        };

        getmycartitems();
    }, []);

    useEffect(() => {
        function set2() {
            const len = Mycart.length
            let temp = 0;
            for (let i = 0; i < len; i++) {
                temp += Mycart[i].Price
            }
            setTotal(temp)
        }
        set2()
    }, [Mycart])

    return (
        <>
            <NavBar />
            <h1 className="text-3xl mt-10 font-semibold">Cart Items</h1>
            {
                Mycart.length > 0 ?
                    (Mycart.map((myitem, index) => {
                        return <div
                            className="flex  justify-between items-center p-4 border border-gray-300 rounded-lg shadow-md mt-10 bg-white"
                            key={index}
                        >
                            <div className="text-lg font-semibold text-gray-700">
                                Name: <span className="text-blue-600 mx-2">{myitem.Name}</span> 
                                <div className="text-lg font-semibold text-gray-700 mt-2">
                                    Price(Rs): <span className="text-green-600 mx-2">{myitem.Price}/-</span>
                                </div>
                            </div>
         
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                onClick={() => {
                                    setMycart(Mycart.filter((item) => {
                                        if (item._id != myitem._id) {
                                            return item
                                        }
                                    }))
                                    const removefromcart = async () => {
                                        try {
                                            const response = await axios.post("http://localhost:4000/api/removefromcart", { myitem }, {
                                                withCredentials: true,
                                            });

                                            if (response.status === 201) {
                                                alert("Removed from cart.")
                                            } else {
                                                alert("Failed to remove item from Cart.")
                                            }
                                        } catch (error) {
                                            throw error;
                                        }
                                    };

                                    removefromcart();
                                }}
                            >
                                Remove
                            </button>
                        </div>

                    }))
                    :
                    (<div className="text-3xl items-center justify-center mt-20">
                        No Items in the Cart.
                    </div>)
            }

            {
                Mycart.length > 0 ? (
                    <>
                        <div className="text-2xl text-center mt-10">
                            Total(Rs): <b className=" text-green-600">{Total}/-</b>
                        </div>
                        <button
                            onClick={async function () {
                                const placeorder = async () => {
                                    try {
                                        const response = await axios.post("http://localhost:4000/api/placeorder", { Mycart }, {
                                            withCredentials: true,
                                        });
                                        if (response.status === 201) {
                                            alert(`Your Order has been Placed.\n${response.data.OTP} (OTP for Transaction.)`)
                                            setMycart([]);
                                            const clearcartitems = async () => {
                                                try {
                                                    const response = await axios.post("http://localhost:4000/api/clearcartItems", { message: "getitems" }, {
                                                        withCredentials: true,
                                                    });
                                                    if (response.status === 201) {
                                                        alert(`CartItems Cleared.`)
                                                    } else {
                                                        alert("Error while clearing CartItems.")
                                                    }
                                                } catch (error) {
                                                    //    throw error;
                                                    alert("Error while clearing CartItems.")
                                                }
                                            };

                                            clearcartitems();
                                        } else {
                                            alert("An Error Occured while Placing Your Order.")
                                        }
                                    } catch (error) {
                                        alert("An Error Occured while Placing Your Order.")
                                    }
                                };

                                placeorder();
                            }}
                            className="text-xl text-white font-semibold bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 rounded-lg px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none mt-20 justify-center"
                        >
                            Final Order
                        </button>
                    </>
                ) :
                    (
                        <div></div>
                    )
            }


        </>
    );
}

export default MyCart;
