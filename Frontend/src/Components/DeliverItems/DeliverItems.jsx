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
    const [loading, setLoading] = useState(true);

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
                setLoading(true);
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
            } finally {
                setLoading(false);
            }
        };

        getdeliverorders();
    }, [update])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading delivery orders...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <NavBar />
            
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                            <span className="flex items-center justify-center">
                                Delivery Orders
                            </span>
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Complete deliveries and manage your orders
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {deliverorders.length > 0 ? (
                    <>
                        {/* Orders Count */}
                        <div className="mb-6">
                            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-indigo-500">
                                <p className="text-sm text-gray-600">
                                    You have <span className="font-semibold text-indigo-600">{deliverorders.length}</span> pending delivery order{deliverorders.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        {/* Orders Grid - Single column on mobile for better mobile experience */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8 max-w-md mx-auto lg:max-w-none">
                            {deliverorders.map((order, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                                    {/* Card Header */}
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                                        <div className="flex items-center justify-center mb-4">
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/en/e/e1/International_Institute_of_Information_Technology%2C_Hyderabad_logo.png"
                                                className="h-14 w-14 object-contain bg-white rounded-full p-2 shadow-md"
                                                alt="Logo"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-white text-sm font-medium mb-2">Transaction ID</p>
                                            <div className="relative group">
                                                <p className="text-white text-xs font-mono bg-white bg-opacity-20 rounded-lg px-3 py-2 truncate backdrop-blur-sm">
                                                    {order._id}
                                                </p>
                                                <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg px-3 py-2 z-10 whitespace-nowrap shadow-lg">
                                                    {order._id}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6 space-y-5">
                                        {/* Item Details */}
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <h3 className="font-semibold text-lg text-gray-800 mb-3 truncate">
                                                {item_buyer[index]?.item?.Name}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600 text-sm">Item Price</span>
                                                <span className="text-xl font-bold text-green-600">
                                                    ₹{item_buyer[index]?.item?.Price}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="flex justify-center">
                                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                                <div className="w-2 h-2 bg-amber-400 rounded-full mr-2 animate-pulse"></div>
                                                Awaiting Delivery
                                            </span>
                                        </div>

                                        {/* Buyer Information */}
                                        <div className="border-t border-gray-100 pt-5">
                                            <h4 className="font-semibold text-gray-800 mb-4 text-center">Buyer Information</h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 text-sm">Name</span>
                                                    <span className="text-gray-800 font-medium text-sm text-right">
                                                        {item_buyer[index]?.buyer?.FirstName} {item_buyer[index]?.buyer?.LastName}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 text-sm">Phone</span>
                                                    <a href={`tel:${item_buyer[index]?.buyer?.ContactNumber}`} 
                                                       className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors">
                                                        {item_buyer[index]?.buyer?.ContactNumber}
                                                    </a>
                                                </div>
                                                <div className="flex justify-between items-start">
                                                    <span className="text-gray-600 text-sm">Email</span>
                                                    <div className="relative group text-right max-w-32">
                                                        <a href={`mailto:${item_buyer[index]?.buyer?.Email}`}
                                                           className="text-indigo-600 hover:text-indigo-800 font-medium text-sm truncate block transition-colors">
                                                            {item_buyer[index]?.buyer?.Email}
                                                        </a>
                                                        <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg px-3 py-2 z-10 whitespace-nowrap shadow-lg">
                                                            {item_buyer[index]?.buyer?.Email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* OTP Section */}
                                        <div className="border-t border-gray-100 pt-5">
                                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                                                    <span className="flex items-center justify-center">
                                                        <svg className="w-4 h-4 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                                        </svg>
                                                        Enter OTP to Complete Delivery
                                                    </span>
                                                </label>
                                                <input
                                                    id="OTP"
                                                    type="text"
                                                    placeholder="Enter OTP from buyer"
                                                    value={otps[index] || ''}
                                                    onChange={(e) => {
                                                        const newOtps = [...otps];
                                                        newOtps[index] = e.target.value;
                                                        setOtps(newOtps);
                                                    }}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-center font-mono text-lg tracking-wider"
                                                />
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                            <button
                                                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                                                onClick={() => {
                                                    let TransactionId = order._id
                                                    const endtransaction = async () => {
                                                        try {
                                                            const otp = otps[index]
                                                            if (!otp) {
                                                                alert("Please enter the OTP to complete the transaction.");
                                                                return;
                                                            }
                                                            const response = await axios.post("http://localhost:4000/api/endtransaction", { TransactionId, otp }, {
                                                                withCredentials: true,
                                                            });

                                                            if (response.status === 201) {
                                                                alert("Transaction completed successfully!")
                                                                set3()
                                                                set4(index)
                                                            } else {
                                                                alert(`An Error Occurred: ${response.data.error}`)
                                                            }
                                                        } catch (error) {
                                                            alert(`An Error Occurred: ${error}`)
                                                        }
                                                    };

                                                    endtransaction();
                                                }}
                                            >
                                                <span className="flex items-center justify-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                    Complete Delivery
                                                </span>
                                            </button>
                                            <button
                                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                                                onClick={() => {
                                                    if (!confirm("Are you sure you want to cancel this order?")) return;
                                                    
                                                    let TransactionId = order._id
                                                    const cancelorder = async () => {
                                                        try {
                                                            const response = await axios.post("http://localhost:4000/api/cancelorder", { TransactionId }, {
                                                                withCredentials: true,
                                                            });

                                                            if (response.status === 201) {
                                                                alert("Order cancelled successfully.")
                                                                set3()
                                                                set4(index)
                                                            } else {
                                                                alert(`An Error Occurred: ${response.data.error}`)
                                                            }
                                                        } catch (error) {
                                                            alert(`An Error Occurred: ${error}`)
                                                        }
                                                    };

                                                    cancelorder();
                                                }}
                                            >
                                                <span className="flex items-center justify-center">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                    </svg>
                                                    Cancel Order
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16">
                        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-gray-100">
                            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Pending Deliveries</h3>
                            <p className="text-gray-600 mb-6">All caught up! You don't have any delivery orders at the moment.</p>
                            <button 
                                onClick={() => navigate("/")}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default deliverorders;