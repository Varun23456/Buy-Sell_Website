import React from "react";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function BoughtItems() {
    const [boughtitems, setBoughtitems] = useState([])
    const [item_seller, setItem_Seller] = useState([])
    const [ReviewVisible, setReviewVisible] = useState([]);
    const [rating, setRating] = useState([]);
    const [comment, setComment] = useState([]);

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

    const navigate = useNavigate()
    useEffect(() => {
        const getboughtitems = async () => {
            try {
                const response = await axios.post("http://localhost:4000/api/getboughtitems", { message: 'getboughtitems' }, {
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
            }
        };

        getboughtitems();
    }, [])

    return (
        <>
            {/* <NavBar /> */}
            <h1 className="text-3xl mt-10"><b>Bought Items Page</b></h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-10 p-6 mt-10 ">
                {boughtitems.length > 0 ?
                    (boughtitems.map((order, index) => {
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
                                <div className="mt-3">{item_seller[index].item.Name}</div>

                                <div className="font-bold mt-3">ItemPrice (Rs):</div>
                                <div className="mt-3">{item_seller[index].item.Price}/-</div>

                                <div className="font-bold mt-3">SoldBy:</div>
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
                                <div className="mt-3">
                                    {!ReviewVisible[index] && (
                                        <button
                                            className="mx-4 mb-3 mt-2 bg-blue-500 text-white font-bold py-2 px-2 rounded-md hover:bg-blue-600 transition duration-200 text-base"
                                            onClick={() => {return setReviewVisible((prev) => {
                                                const newReviewVisible = [...prev];
                                                newReviewVisible[index] = true;
                                                return newReviewVisible;
                                            })}}
                                        >
                                            Review
                                        </button>
                                    )}

                                    {ReviewVisible[index] && (
                                        <button
                                            className="mx-4 mb-3 mt-2 bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 transition duration-200 "
                                            onClick={() => {return setReviewVisible((prev) => {
                                                const newReviewVisible = [...prev];
                                                newReviewVisible[index] = false;
                                                return newReviewVisible;
                                             })}}
                                        >
                                            close
                                        </button>
                                    )}

                                    {ReviewVisible[index] && (
                                        <div className="mt-3 space-y-2">
                                            <div><b>Rating:</b></div>
                                            <input
                                                type="number"
                                                placeholder="Enter rating (1-5)"
                                                value={rating[index]}
                                                onChange={(e) => { return setRating((prev) => {
                                                    const newRating = [...prev];
                                                    newRating[index] = e.target.value;
                                                    return newRating;
                                                })}}
                                                className="text-base px-4 py-2 border border-gray-300 rounded-md focus:outline-none hover:ring-2 hover:ring-blue-400"
                                            />
                                            <div><b>Comment:</b></div>
                                            <textarea
                                                placeholder="Enter your comment"
                                                value={comment[index]}
                                                onChange={(e) => {return setComment((prev) => {
                                                    const newComment = [...prev];
                                                    newComment[index] = e.target.value;
                                                    return newComment;
                                                })}}
                                                className="h-15 text-base px-4 py-2 border border-gray-300 rounded-md focus:outline-none hover:ring-2 hover:ring-blue-400"
                                            />
                                            <button
                                                className="mx-4 mb-3 mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                                                onClick={() => {
                                                    const updateReview = () => {
                                                        if (!rating[index] || !comment[index]) {
                                                            alert("Please enter both rating and comment.");
                                                            return;
                                                        }
                                                        else 
                                                        {
                                                            const Review = { rating: rating[index], comment: comment[index] };
                                                            const TransactionId = order._id;
                                                            const SellerId = item_seller[index].seller._id;
                                                            const updateReview = async () => {
                                                                try {
                                                                    const response = await axios.post("http://localhost:4000/api/updatereview", { TransactionId,SellerId, Review }, {
                                                                        withCredentials: true,
                                                                    });
                                                                    if (response.status === 201) {
                                                                        alert("Review Updated Succesfully.")
                                                                    } else {
                                                                        alert(`An Error Ocurred: ${response.data.error}`)
                                                                    }
                                                                } catch (error) {
                                                                    alert(`An Error Ocurred: ${error}`)
                                                                }
                                                            };
                                                            updateReview(); 
                                                        }
                                                    };
                                                    updateReview();
                                                }}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    )}

                                    
                                </div>
                            </div>
                        </div>
                    })) : (<div></div>)
                }
            </div >
            {
                boughtitems.length > 0 ? (<div></div>) : (<div className="text-3xl items-center justify-center ">
                    No Items Bought Until Now..
                </div>)
            }
        </>
    )
}

export default BoughtItems;