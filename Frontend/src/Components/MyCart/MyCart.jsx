import React, { useContext, useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import axios from "axios";
import CartContext from "../../Context/CartContext";
import { useNavigate } from "react-router-dom";

function MyCart() {
    const navigate = useNavigate();
    const { Mycart, setMycart } = useContext(CartContext);
    const [Total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [removingItems, setRemovingItems] = useState(new Set());

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

    const handleRemoveItem = async (myitem) => {
        setRemovingItems(prev => new Set(prev).add(myitem._id));
        
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
            } finally {
                setRemovingItems(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(myitem._id);
                    return newSet;
                });
            }
        };

        removefromcart();
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
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
            } finally {
                setLoading(false);
            }
        };

        placeorder();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
            <NavBar />
            
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                         Shopping Cart
                    </h1>
                    {/* <p className="text-gray-600 text-base">
                        {Mycart.length} {Mycart.length === 1 ? 'item' : 'items'} in your cart
                    </p> */}
                </div>

                {Mycart.length > 0 ? (
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {Mycart.map((myitem, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        {/* Item Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                                                        {myitem.Name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">
                                                        Item #{index + 1}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                                                <span className="text-sm font-medium text-gray-700">Price:</span>
                                                <span className="text-xl font-bold text-green-600">
                                                    ₹{myitem.Price}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <div className="flex sm:flex-col sm:items-end gap-3">
                                            <button
                                                onClick={() => handleRemoveItem(myitem)}
                                                disabled={removingItems.has(myitem._id)}
                                                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 focus:ring-4 focus:ring-red-300 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                            >
                                                {removingItems.has(myitem._id) ? (
                                                    <>
                                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Removing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Remove
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-8">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                                    Order Summary
                                </h2>
                                
                                <div className="space-y-3 mb-5">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-gray-600 font-medium text-sm">Items ({Mycart.length})</span>
                                        <span className="text-gray-800 font-semibold">₹{Total}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-gray-600 font-medium text-sm">Shipping</span>
                                        <span className="text-green-600 font-semibold">Free</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 bg-gray-50 px-3 rounded-lg">
                                        <span className="text-lg font-bold text-gray-800">Total</span>
                                        <span className="text-2xl font-bold text-green-600">₹{Total}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                                            </svg>
                                            Place Order
                                        </>
                                    )}
                                </button>

                                {/* <div className="mt-4 text-center">
                                    <p className="text-xs text-gray-500">
                                        🔒 Secure checkout guaranteed
                                    </p>
                                </div> */}
                            </div>
                        </div>
                    </div>
                ) : (
                    // Empty Cart State
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-3">
                                Your cart is empty
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Looks like you haven't added any items to your cart yet.
                            </p>
                            <button
                                onClick={() => navigate("/")}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                            >
                                Start Shopping
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Fixed Trust Indicators at Bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
                <div className="container mx-auto px-4 py-3">
                    <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-2xl mx-auto">
                        <div className="text-center">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1 md:mb-2">
                                <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-800 text-xs md:text-sm">Secure Payment</h3>
                        </div>
                        <div className="text-center">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1 md:mb-2">
                                <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-800 text-xs md:text-sm">Fast Delivery</h3>
                        </div>
                        <div className="text-center">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1 md:mb-2">
                                <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-800 text-xs md:text-sm">24/7 Support</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyCart;