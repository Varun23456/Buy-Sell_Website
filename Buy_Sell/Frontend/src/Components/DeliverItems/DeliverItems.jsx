import React from "react";
import NavBar from "../NavBar/NavBar";
import { useState, useEffect } from "react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";

function deliverorders() {
    const navigate = useNavigate()
    const [deliverorders, setDeliverorders] = useState([])
    const [item_buyer, setItem_buyer] = useState([])
    const [otps, setOtps] = useState([])
    const [update, setUpdate] = useState(false)

    function set1(deliverorders) {
        setDeliverorders(deliverorders)
    }

    function set2(item_buyer) {
        setItem_buyer(item_buyer)
    }

    function set3() {
        setUpdate((prev) => {
            return !prev
        })
    }

    function set4(index) {
        const newOtps = [...otps];
        newOtps[index] = "";
        setOtps(newOtps);
    }

    useEffect(() => {
        const getdeliverorders = async () => {
            try {
                const response = await axios.post("http://localhost:4000/api/getdeliverorders", { message: 'getdeliverorders' }, {
                    withCredentials: true,
                });

                if (response.status === 201) {
                    set1(response.data.deliverorders)
                    set2(response.data.item_buyer)
                } else {
                    navigate("/");
                }
            } catch (error) {
                navigate("/");
            }
        };

        getdeliverorders();
    }, [update])

    return (
        <>
            <NavBar />
            <h1 className="text-3xl mt-10"><b>Deliver Items Page</b></h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-6 mt-10">
                {deliverorders.length > 0 ?
                    (deliverorders.map((order, index) => {

                        return <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
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
                                <div className="mt-3">{item_buyer[index].item.Name}</div>

                                <div className="font-bold mt-3">ItemPrice (Rs):</div>
                                <div className="mt-3">{item_buyer[index].item.Price}/-</div>

                                <div className="font-bold mt-3">Buyer:</div>
                                <div className="mt-3">{item_buyer[index].buyer.FirstName} {item_buyer[index].buyer.LastName}</div>

                                <div className="font-bold mt-3">Contact Number:</div>
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

                                <div className="mb-6 flex mt-4">
                                    <div className="font-bold mx-4 my-2">OTP:</div>
                                    <input
                                        id="OTP"
                                        type="text"
                                        placeholder="Enter OTP to Close Transaction"
                                        value={otps[index]}
                                        onChange={(e) => {
                                            const newOtps = [...otps];
                                            newOtps[index] = e.target.value;
                                            setOtps(newOtps);
                                        }}
                                        className="text-base px-4 py-2 border border-gray-300 rounded-md focus:outline-none hover:ring-2 hover:ring-blue-400"
                                    />
                                </div>

                            </div>
                            <div className="flex">
                                <button
                                    className="mx-4 mb-3 mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                                    onClick={() => {
                                        let TransactionId = order._id
                                        const endtransaction = async () => {
                                            try {
                                                const otp = otps[index]
                                                const response = await axios.post("http://localhost:4000/api/endtransaction", { TransactionId, otp }, {
                                                    withCredentials: true,
                                                });

                                                if (response.status === 201) {
                                                    alert("Transaction completed Succesfully.")
                                                    set3()
                                                    set4(index)
                                                } else {
                                                    alert(`An Error Ocurred: ${response.data.error}`)
                                                }
                                            } catch (error) {
                                                alert(`An Error Ocurred: ${error}`)
                                            }
                                        };

                                        endtransaction();
                                    }}
                                >
                                    End Transaction
                                </button>
                                <button
                                    className=" mb-3 mt-2 bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
                                    onClick={() => {
                                        let TransactionId = order._id
                                        const cancelorder = async () => {
                                            try {
                                                const response = await axios.post("http://localhost:4000/api/cancelorder", { TransactionId }, {
                                                    withCredentials: true,
                                                });

                                                if (response.status === 201) {
                                                    alert("Order Cancelled.")
                                                    set3()
                                                    set4(index)
                                                } else {
                                                    alert(`An Error Ocurred: ${response.data.error}`)
                                                }
                                            } catch (error) {
                                                alert(`An Error Ocurred: ${error}`)
                                            }
                                        };

                                        cancelorder();
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    })) :
                    (
                        <div></div>
                    )
                }
            </div>
            {
                deliverorders.length > 0 ? (<div></div>) : (<div className="text-3xl items-center justify-center ">
                    No Deliver Items Pending.
                </div>)
            }
        </>
    )
}

export default deliverorders;