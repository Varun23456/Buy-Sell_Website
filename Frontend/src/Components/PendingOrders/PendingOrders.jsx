import React, { useEffect, useState} from "react";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function PendingOrders() {
    const navigate = useNavigate()
    const [pendingorders, setPendingorders] = useState([])
    const [item_seller, setItem_Seller] = useState([])
    const [loading, setLoading] = useState(true)
    
    function set1(pendingorders) {
        setPendingorders(pendingorders)
    }

    function set2(item_seller) {
        setItem_Seller(item_seller)
    }

    useEffect(() => {
        const getpendingorders = async () => {
            try {
                setLoading(true)
                const response = await axios.post("/api/getpendingorders", { message: 'getpendingorders' }, {
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
            } finally {
                setLoading(false)
            }
        };

        getpendingorders();
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your orders...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            {/* <NavBar /> */}
            
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            Pending Orders
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Track and manage your pending transactions
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {pendingorders.length > 0 ? (
                    <>
                        {/* Orders Count */}
                        <div className="mb-6">
                            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-indigo-500">
                                <p className="text-sm text-gray-600">
                                    You have <span className="font-semibold text-indigo-600">{pendingorders.length}</span> pending order{pendingorders.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        {/* Orders Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-8">
                            {pendingorders.map((order, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
                                    {/* Card Header */}
                                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                                        <div className="flex items-center justify-center mb-3">
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/en/e/e1/International_Institute_of_Information_Technology%2C_Hyderabad_logo.png"
                                                className="h-12 w-12 object-contain bg-white rounded-full p-1"
                                                alt="Logo"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-white text-sm font-medium mb-1">Transaction ID</p>
                                            <div className="relative group">
                                                <p className="text-white text-xs font-mono bg-black bg-opacity-20 rounded px-2 py-1 truncate">
                                                    {order._id}
                                                </p>
                                                <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap">
                                                    {order._id}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6 space-y-4">
                                        {/* Item Details */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="font-semibold text-lg text-gray-900 mb-2 truncate">
                                                {item_seller[index]?.item?.Name}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600 text-sm">Price</span>
                                                <span className="text-xl font-bold text-green-600">
                                                    ₹{item_seller[index]?.item?.Price}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="flex justify-center">
                                            {order.Status === "Pending" ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                                                    Pending
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                                                    <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                                                    Cancelled
                                                </span>
                                            )}
                                        </div>

                                        {/* Seller Information */}
                                        <div className="border-t pt-4">
                                            <h4 className="font-semibold text-gray-900 mb-3 text-center">Seller Information</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 text-sm">Name</span>
                                                    <span className="text-gray-900 font-medium text-sm text-right">
                                                        {item_seller[index]?.seller?.FirstName} {item_seller[index]?.seller?.LastName}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 text-sm">Phone</span>
                                                    <a href={`tel:${item_seller[index]?.seller?.ContactNumber}`} 
                                                       className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                                                        {item_seller[index]?.seller?.ContactNumber}
                                                    </a>
                                                </div>
                                                <div className="flex justify-between items-start">
                                                    <span className="text-gray-600 text-sm">Email</span>
                                                    <div className="relative group text-right max-w-32">
                                                        <a href={`mailto:${item_seller[index]?.seller?.Email}`}
                                                           className="text-indigo-600 hover:text-indigo-800 font-medium text-sm truncate block">
                                                            {item_seller[index]?.seller?.Email}
                                                        </a>
                                                        <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap">
                                                            {item_seller[index]?.seller?.Email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="pt-4">
                                            {order.Status === "Pending" ? (
                                                <button
                                                    onClick={() => {
                                                        const regenerateOTP = async () => {
                                                            try {
                                                                const orderId = order._id
                                                                const response = await axios.post("/api/regenerateOTP", { orderId }, {
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
                                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                                                >
                                                    <span className="flex items-center justify-center">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                                        </svg>
                                                        Regenerate OTP
                                                    </span>
                                                </button>
                                            ) : (
                                                <button
                                                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                                                    onClick={() => {
                                                        const removefrompendingorder = async () => {
                                                            try {
                                                                const orderId = order._id
                                                                const response = await axios.post("/api/removefromorders", { orderId }, {
                                                                    withCredentials: true,
                                                                });

                                                                if (response.status === 201) {
                                                                    alert("Removed from Database. Please refresh the page.")
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
                                                    <span className="flex items-center justify-center">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                        </svg>
                                                        Remove Order
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16">
                        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Pending Orders</h3>
                            <p className="text-gray-600 mb-6">You don't have any pending orders at the moment.</p>
                            <button 
                                onClick={() => navigate("/")}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                Browse Items
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PendingOrders;