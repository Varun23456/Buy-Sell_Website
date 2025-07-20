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
    const [loading, setLoading] = useState(true);

    function set1(solditems) {
        setSolditems(solditems)
    }

    function set2(item_buyer) {
        setItem_buyer(item_buyer)
    }

    useEffect(() => {
        const getsolditems = async () => {
            try {
                setLoading(true);
                const response = await axios.post("/api/getsolditems", { message: 'getsolditems' }, {
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
            } finally {
                setLoading(false);
            }
        };

        getsolditems();
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your sold items...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
            {/* <NavBar /> */}
            
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                            Sold Items
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Track and manage your successful sales
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {solditems.length > 0 ? (
                    <>
                        {/* Items Count */}
                        <div className="mb-6">
                            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
                                <p className="text-sm text-gray-600">
                                    You have sold <span className="font-semibold text-green-600">{solditems.length}</span> item{solditems.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        {/* Items Grid - Single column on mobile, responsive on larger screens */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8 max-w-md mx-auto lg:max-w-none">
                            {solditems.map((order, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                                    {/* Card Header */}
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
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
                                        <div className="bg-green-50 rounded-xl p-4">
                                            <h3 className="font-semibold text-lg text-gray-800 mb-3 truncate">
                                                {item_buyer[index]?.item?.Name}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600 text-sm">Sale Price</span>
                                                <span className="text-xl font-bold text-green-600">
                                                    ₹{item_buyer[index]?.item?.Price}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="flex justify-center">
                                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                                Sold
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
                                                       className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors">
                                                        {item_buyer[index]?.buyer?.ContactNumber}
                                                    </a>
                                                </div>
                                                <div className="flex justify-between items-start">
                                                    <span className="text-gray-600 text-sm">Email</span>
                                                    <div className="relative group text-right max-w-32">
                                                        <a href={`mailto:${item_buyer[index]?.buyer?.Email}`}
                                                           className="text-emerald-600 hover:text-emerald-700 font-medium text-sm truncate block transition-colors">
                                                            {item_buyer[index]?.buyer?.Email}
                                                        </a>
                                                        <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg px-3 py-2 z-10 whitespace-nowrap shadow-lg">
                                                            {item_buyer[index]?.buyer?.Email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sales Success Message */}
                                        <div className="border-t border-gray-100 pt-5">
                                            <div className="bg-green-50 rounded-xl p-4 text-center">
                                                <div className="flex items-center justify-center mb-2">
                                                    <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                    <span className="text-green-700 font-semibold">Successfully Sold!</span>
                                                </div>
                                                {/* <p className="text-green-600 text-sm">
                                                    Congratulations on your successful sale. The buyer's contact information is provided above for any follow-up communication.
                                                </p> */}
                                            </div>
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
                            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Items Sold Yet</h3>
                            <p className="text-gray-600 mb-6">You haven't sold any items yet. Start listing your items to see your sales here!</p>
                            <button 
                                onClick={() => navigate("/sell")}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                Start Selling
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SoldItems;