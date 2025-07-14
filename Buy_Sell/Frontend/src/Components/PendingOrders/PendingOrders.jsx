import React, { useEffect, useState} from "react";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function PendingOrders() {
    const navigate = useNavigate()
    const [pendingorders, setPendingorders] = useState([])
    const [item_seller, setItem_Seller] = useState([])
    
    function set1(pendingorders) {
        setPendingorders(pendingorders)
    }

    function set2(item_seller) {
        setItem_Seller(item_seller)
    }



    useEffect(() => {
        const getpendingorders = async () => {
            try {
                const response = await axios.post("http://localhost:4000/api/getpendingorders", { message: 'getpendingorders' }, {
                    withCredentials: true,
                });

                if (response.status === 201) {
                    set1(response.data.pendingorders)
                    set2(response.data.item_seller)
                } else {
                    navigate("/");
                }
            } catch (error) {
                navigate("/");
            }
        };

        getpendingorders();
    }, [])



    return (
        <>
            {/* <NavBar /> */}
            <h1 className="text-3xl mt-10"> <b>Pending Orders Page</b></h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6 mt-10">
                {pendingorders.map((order, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                        <Link to="#" className="flex items-center justify-center mb-4">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/en/e/e1/International_Institute_of_Information_Technology%2C_Hyderabad_logo.png"
                                className="h-24"
                                alt="Logo"
                            />
                        </Link>
                        <div className="text-lg grid grid-cols-2 gap-2 w-full">
                            <div className="font-bold mt-3">TransactionId:</div>
                            <div className="relative group mt-3">
                                <div className="truncate overflow-hidden whitespace-nowrap">
                                    {order._id}
                                </div>
                                <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-black text-white text-base rounded p-1 z-10 w-max max-w-xs">
                                    {order._id}
                                </div>
                            </div>

                            <div className="font-bold mt-3">ItemName:</div>
                            <div className="mt-3">{item_seller[index].item.Name}</div>

                            <div className="font-bold mt-3">ItemPrice (Rs):</div>
                            <div className="mt-3">{item_seller[index].item.Price}/-</div>

                            <div className="font-bold mt-3">Status:</div>
                            {order.Status == "Pending" ? (<div className="text-yellow-600 font-bold mt-3">Pending</div>) : (<div className="text-red-700 font-bold mt-3">Cancelled</div>)}

                            <div className="font-bold mt-3">Seller:</div>
                            <div className="mt-3">{item_seller[index].seller.FirstName} {item_seller[index].seller.LastName}</div>

                            <div className="font-bold mt-3">Contact No:</div>
                            <div className="mt-3">{item_seller[index].seller.ContactNumber}</div>

                            <div className="font-bold mt-3">Contact Email:</div>
                            <div className="relative group mt-3">
                                <div className="truncate overflow-hidden whitespace-nowrap">
                                    {item_seller[index].seller.Email}
                                </div>
                                <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-black text-white text-base rounded p-1 z-10 w-max max-w-xs">
                                    {item_seller[index].seller.Email}
                                </div>
                            </div>

                        </div>
                        {order.Status == "Pending" ? (
                            <button
                                onClick={() => {
                                    const regenerateOTP = async () => {
                                        try {
                                            const orderId = order._id
                                            const response = await axios.post("http://localhost:4000/api/regenerateOTP", { orderId }, {
                                                withCredentials: true,
                                            });

                                            if (response.status === 201) {
                                                alert(`OTP Regenerated: ${response.data.OTP}`)
                                            } else {
                                                alert("Failed to regenerate OTP.")
                                            }
                                        } catch (error) {
                                            alert("Failed to regenerate OTP.")
                                        }
                                    };

                                    regenerateOTP();
                                }}
                                className=" bg-blue-500 text-white text-base font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 mt-5 "
                            >
                                Regenerate OTP
                            </button>) : (<div>
                                <button
                                    className="mt-10 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    onClick={() => {
                                        const removefrompendingorder = async () => {
                                            try {
                                                const orderId = order._id
                                                const response = await axios.post("http://localhost:4000/api/removefromorders", { orderId }, {
                                                    withCredentials: true,
                                                });

                                                if (response.status === 201) {
                                                    alert("Removed from DataBase.Please Refresh the Page.")
                                                } else {
                                                    alert("Removed from Pending Orders Page.")
                                                }
                                            } catch (error) {
                                                throw error;
                                            }
                                        };

                                        removefrompendingorder();
                                    }}
                                >
                                    Remove
                                </button>
                            </div>)
                        }
                    </div>
                ))}
            </div>
            {
                pendingorders.length > 0 ? (<div></div>) : (<div className="text-3xl items-center justify-center ">
                    No Pending Orders.
                </div>)
            }
        </>
    )
}

export default PendingOrders;