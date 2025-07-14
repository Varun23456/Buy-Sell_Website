import React from "react";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function SoldItems() {
    const navigate = useNavigate()
    const [solditems, setSolditems] = useState([])
    const [item_buyer, setItem_buyer] = useState([])

    function set1(solditems) {
        setSolditems(solditems)
    }

    function set2(item_buyer) {
        setItem_buyer(item_buyer)
    }


    useEffect(() => {
        const getsolditems = async () => {
            try {
                const response = await axios.post("http://localhost:4000/api/getsolditems", { message: 'getsolditems' }, {
                    withCredentials: true,
                });

                if (response.status === 201) {
                    set1(response.data.solditems)
                    set2(response.data.item_buyer)
                } else {
                    navigate("/");
                }
            } catch (error) {
                navigate("/");
            }
        };

        getsolditems();
    }, [])

    return (
        <>
            {/* <NavBar /> */}
            <h1 className="text-3xl mt-10"><b>Sold Items Page</b></h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-6 mt-10">
                {solditems.length > 0 ?
                    (solditems.map((order, index) => {
                        return <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                            <Link to="#" className="flex items-center justify-center mb-4">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/en/e/e1/International_Institute_of_Information_Technology%2C_Hyderabad_logo.png"
                                    className="h-24"
                                    alt="Logo"
                                />
                            </Link>
                            <div className="text-lg grid grid-cols-2 gap-2 w-full ">
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
                                <div className="mt-3">{item_buyer[index].item.Name}</div>

                                <div className="font-bold mt-3">ItemPrice (Rs):</div>
                                <div className="mt-3">{item_buyer[index].item.Price}/-</div>

                                <div className="font-bold mt-3">Status:</div>
                                <div className="text-green-700 font-bold mt-3">Sold</div>

                                <div className="font-bold mt-3">Buyer:</div>
                                <div className="mt-3">{item_buyer[index].buyer.FirstName} {item_buyer[index].buyer.LastName}</div>

                                <div className="font-bold mt-3">Contact No:</div>
                                <div className="mt-3">{item_buyer[index].buyer.ContactNumber}</div>

                                <div className="font-bold mt-3">Contact Email:</div>
                                <div className="relative group mt-3">
                                    <div className="truncate overflow-hidden whitespace-nowrap">
                                        {item_buyer[index].buyer.Email}
                                    </div>
                                    <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-black text-white text-base rounded p-1 z-10 w-max max-w-xs">
                                        {item_buyer[index].buyer.Email}
                                    </div>
                                </div>

                            </div>
                        </div>
                    })) :
                    (
                        <div></div>
                    )
                }
            </div>
            {
                solditems.length > 0 ? (<div></div>) : (<div className="text-3xl items-center justify-center ">
                    No Items Sold Until Now..
                </div>)
            }
        </>
    )
}

export default SoldItems;