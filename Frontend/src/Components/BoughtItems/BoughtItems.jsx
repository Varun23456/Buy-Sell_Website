import React from "react";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function BoughtItems() {
    const navigate = useNavigate()
    const [boughtitems, setBoughtitems] = useState([])
    const [item_seller, setItem_Seller] = useState([])
    const [ReviewVisible, setReviewVisible] = useState([]);
    const [rating, setRating] = useState([]);
    const [comment, setComment] = useState([]);
    const [loading, setLoading] = useState(true);

    function set1(boughtitems) {
        setBoughtitems(boughtitems)
        setRating(boughtitems.map((order) => {
            return order.Review.rating
        }))
        setComment(boughtitems.map((order) => {
            return order.Review.comment
        }))
    }

    function set2(item_seller) {
        setItem_Seller(item_seller)
    }

    useEffect(() => {
        const getboughtitems = async () => {
            try {
                setLoading(true);
                const response = await axios.post("/api/getboughtitems", { message: 'getboughtitems' }, {
                    withCredentials: true,
                });

                if (response.status === 201) {
                    set1(response.data.boughtitems)
                    set2(response.data.item_seller)
                } else {
                    navigate("/");
                }
            } catch (error) {
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        getboughtitems();
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your purchases...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
            {/* <NavBar /> */}
            
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                            Bought Items
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Review and manage your purchased items
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {boughtitems.length > 0 ? (
                    <>
                        {/* Items Count */}
                        <div className="mb-6">
                            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
                                <p className="text-sm text-gray-600">
                                    You have purchased <span className="font-semibold text-purple-600">{boughtitems.length}</span> item{boughtitems.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        {/* Items Grid - Single column on mobile, responsive on larger screens */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8 max-w-md mx-auto lg:max-w-none">
                            {boughtitems.map((order, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                                    {/* Card Header */}
                                    <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-6">
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
                                        <div className="bg-purple-50 rounded-xl p-4">
                                            <h3 className="font-semibold text-lg text-gray-800 mb-3 truncate">
                                                {item_seller[index]?.item?.Name}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600 text-sm">Price Paid</span>
                                                <span className="text-xl font-bold text-purple-600">
                                                    ₹{item_seller[index]?.item?.Price}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="flex justify-center">
                                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200">
                                                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                                                Purchased
                                            </span>
                                        </div>

                                        {/* Seller Information */}
                                        <div className="border-t border-gray-100 pt-5">
                                            <h4 className="font-semibold text-gray-800 mb-4 text-center">Seller Information</h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 text-sm">Name</span>
                                                    <span className="text-gray-800 font-medium text-sm text-right">
                                                        {item_seller[index]?.seller?.FirstName} {item_seller[index]?.seller?.LastName}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 text-sm">Phone</span>
                                                    <a href={`tel:${item_seller[index]?.seller?.ContactNumber}`} 
                                                       className="text-violet-600 hover:text-violet-700 font-medium text-sm transition-colors">
                                                        {item_seller[index]?.seller?.ContactNumber}
                                                    </a>
                                                </div>
                                                <div className="flex justify-between items-start">
                                                    <span className="text-gray-600 text-sm">Email</span>
                                                    <div className="relative group text-right max-w-32">
                                                        <a href={`mailto:${item_seller[index]?.seller?.Email}`}
                                                           className="text-violet-600 hover:text-violet-700 font-medium text-sm truncate block transition-colors">
                                                            {item_seller[index]?.seller?.Email}
                                                        </a>
                                                        <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg px-3 py-2 z-10 whitespace-nowrap shadow-lg">
                                                            {item_seller[index]?.seller?.Email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Review Section */}
                                        <div className="border-t border-gray-100 pt-5">
                                            {!ReviewVisible[index] ? (
                                                <button
                                                    className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                                                    onClick={() => setReviewVisible((prev) => {
                                                        const newReviewVisible = [...prev];
                                                        newReviewVisible[index] = true;
                                                        return newReviewVisible;
                                                    })}
                                                >
                                                    <span className="flex items-center justify-center">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                                                        </svg>
                                                        Write Review
                                                    </span>
                                                </button>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <h5 className="font-semibold text-gray-800">Write Your Review</h5>
                                                        <button
                                                            className="text-gray-500 hover:text-gray-700 p-1"
                                                            onClick={() => setReviewVisible((prev) => {
                                                                const newReviewVisible = [...prev];
                                                                newReviewVisible[index] = false;
                                                                return newReviewVisible;
                                                            })}
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="5"
                                                            placeholder="Enter rating (1-5)"
                                                            value={rating[index] || ''}
                                                            onChange={(e) => setRating((prev) => {
                                                                const newRating = [...prev];
                                                                newRating[index] = e.target.value;
                                                                return newRating;
                                                            })}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                                                        <textarea
                                                            rows="3"
                                                            placeholder="Share your experience..."
                                                            value={comment[index] || ''}
                                                            onChange={(e) => setComment((prev) => {
                                                                const newComment = [...prev];
                                                                newComment[index] = e.target.value;
                                                                return newComment;
                                                            })}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                                                        />
                                                    </div>

                                                    <button
                                                        className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                                                        onClick={() => {
                                                            const updateReview = () => {
                                                                if (!rating[index] || !comment[index]) {
                                                                    alert("Please enter both rating and comment.");
                                                                    return;
                                                                }
                                                                
                                                                const Review = { rating: rating[index], comment: comment[index] };
                                                                const TransactionId = order._id;
                                                                const SellerId = item_seller[index].seller._id;
                                                                
                                                                const updateReviewAsync = async () => {
                                                                    try {
                                                                        const response = await axios.post("/api/updatereview", { TransactionId, SellerId, Review }, {
                                                                            withCredentials: true,
                                                                        });
                                                                        if (response.status === 201) {
                                                                            alert("Review Updated Successfully!")
                                                                            // Close the review form after successful submission
                                                                            setReviewVisible((prev) => {
                                                                                const newReviewVisible = [...prev];
                                                                                newReviewVisible[index] = false;
                                                                                return newReviewVisible;
                                                                            });
                                                                        } else {
                                                                            alert(`An Error Occurred: ${response.data.error}`)
                                                                        }
                                                                    } catch (error) {
                                                                        alert(`An Error Occurred: ${error}`)
                                                                    }
                                                                };
                                                                updateReviewAsync(); 
                                                            };
                                                            updateReview();
                                                        }}
                                                    >
                                                        <span className="flex items-center justify-center">
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                            </svg>
                                                            Submit Review
                                                        </span>
                                                    </button>
                                                </div>
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
                        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-gray-100">
                            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Items Purchased</h3>
                            <p className="text-gray-600 mb-6">You haven't bought any items yet. Start shopping to see your purchases here!</p>
                            <button 
                                onClick={() => navigate("/")}
                                className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                Start Shopping
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BoughtItems;