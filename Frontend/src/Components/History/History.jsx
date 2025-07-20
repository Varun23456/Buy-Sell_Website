import React from "react";
import NavBar from "../NavBar/NavBar";
import { useState, useEffect} from "react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import PendingOrders from "../PendingOrders/PendingOrders";
import BoughtItems from "../BoughtItems/BoughtItems";
import SoldItems from "../SoldItems/SoldItems";

function History() {
    const navigate = useNavigate()
    const [currpage, setCurrpage] = useState('PendingOrders')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                let response = await axios.get("/api/validate", {
                    withCredentials: true,
                });
                if (response.status == 201) {
                    let UserInfo = response.data.user
                    setLoading(false)
                    navigate("/History");
                }
                else {
                    navigate("/")
                }
            } catch (error) {
                navigate("/");
            }
        };

        checkAuth();
    }, [navigate]);

    const getButtonClasses = (page) => {
        const baseClasses = "relative px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 shadow-lg w-full sm:w-auto sm:min-w-[160px] md:min-w-[180px]";
        
        if (currpage === page) {
            return `${baseClasses} bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-200 ring-blue-300`;
        }
        
        switch (page) {
            case 'PendingOrders':
                return `${baseClasses} bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-orange-200 focus:ring-orange-300`;
            case 'BoughtItems':
                return `${baseClasses} bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-purple-200 focus:ring-purple-300`
            case 'SoldItems':
                return `${baseClasses} bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-green-200 focus:ring-green-300`;;
            default:
                return baseClasses;
        }
    };

    if (loading) {
        return (
            <>
                <NavBar />
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-sm sm:text-base">Loading your order history...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <NavBar />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
                {/* Header Section */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                        <div className="text-center">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                Order History
                            </h1>
                            {/* <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
                                Track and manage all your orders in one place. View pending orders, purchased items, and sales history.
                            </p> */}
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 md:gap-6">
                            <button
                                className={getButtonClasses('PendingOrders')}
                                onClick={() => setCurrpage('PendingOrders')}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs sm:text-sm">Pending Orders</span>
                                </div>
                            </button>
                            
                            <button
                                className={getButtonClasses('BoughtItems')}
                                onClick={() => setCurrpage('BoughtItems')}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs sm:text-sm">Bought Items</span>
                                </div>
                            </button>
                            
                            <button
                                className={getButtonClasses('SoldItems')}
                                onClick={() => setCurrpage('SoldItems')}
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-13a1 1 0 112 0v.092a4.535 4.535 0 011.676.662C13.398 6.14 14 6.895 14 8c0 1.105-.602 1.86-1.324 2.246a4.535 4.535 0 01-1.676.662V12a1 1 0 11-2 0v-1.092a4.535 4.535 0 01-1.676-.662C6.602 9.86 6 9.105 6 8c0-1.105.602-1.86 1.324-2.246A4.535 4.535 0 019 5.092V5z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs sm:text-sm">Sold Items</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-4 sm:p-6 md:p-8">
                            <div className="transition-all duration-500 ease-in-out">
                                {currpage === 'PendingOrders' && (
                                    <div className="animate-fadeIn">
                                        <div className="overflow-x-auto">
                                            <PendingOrders />
                                        </div>
                                    </div>
                                )}
                                
                                {currpage === 'BoughtItems' && (
                                    <div className="animate-fadeIn">
                                        <div className="overflow-x-auto">
                                            <BoughtItems />
                                        </div>
                                    </div>
                                )}
                                
                                {currpage === 'SoldItems' && (
                                    <div className="animate-fadeIn">
                                        <div className="overflow-x-auto">
                                            <SoldItems />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                
                /* Mobile-specific improvements */
                @media (max-width: 640px) {
                    .min-h-screen {
                        min-height: calc(100vh - 60px); /* Account for mobile nav height */
                    }
                }
                
                /* Touch-friendly button sizing */
                @media (max-width: 768px) {
                    button {
                        min-height: 48px; /* iOS minimum touch target */
                    }
                }
                
                /* Prevent horizontal scroll on small screens */
                .overflow-x-auto {
                    scrollbar-width: thin;
                    scrollbar-color: #cbd5e0 #f7fafc;
                }
                
                .overflow-x-auto::-webkit-scrollbar {
                    height: 6px;
                }
                
                .overflow-x-auto::-webkit-scrollbar-track {
                    background: #f7fafc;
                    border-radius: 3px;
                }
                
                .overflow-x-auto::-webkit-scrollbar-thumb {
                    background: #cbd5e0;
                    border-radius: 3px;
                }
                
                .overflow-x-auto::-webkit-scrollbar-thumb:hover {
                    background: #a0aec0;
                }
            `}</style>
        </>
    )
}

export default History;