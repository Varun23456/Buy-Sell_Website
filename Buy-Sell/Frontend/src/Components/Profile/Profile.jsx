import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import NavBar from "../NavBar/NavBar";


function Profile() {
    const [isTodoEditable1, setIsTodoEditable1] = useState(false)
    const [isTodoEditable2, setIsTodoEditable2] = useState(false)
    const [isTodoEditable3, setIsTodoEditable3] = useState(false)
    const [isTodoEditable4, setIsTodoEditable4] = useState(false)
    const [isTodoEditable5, setIsTodoEditable5] = useState(false)
    const [isTodoEditable6, setIsTodoEditable6] = useState(false)

    const [buyers, setBuyers] = useState([])
    const [UserInfo, setUserInfo] = useState({
        FirstName: '',
        LastName: '',
        Email: '',
        Age: 0,
        ContactNumber: '',
        Password: '',
        CartItems: [],
        SellerReviews: []
    })

    const [oldpassword, setOldpassword] = useState("")
    const [newpassword, setNewpassword] = useState("")

    const editTodo1 = () => {
        setIsTodoEditable1(false)
    }
    const editTodo2 = () => {
        setIsTodoEditable2(false)
    }

    const editTodo3 = () => {
        setIsTodoEditable3(false)
    }
    const editTodo4 = () => {
        setIsTodoEditable4(false)
    }

    const editTodo5 = () => {
        setIsTodoEditable5(false)
    }
    const editTodo6 = () => {
        setIsTodoEditable6(false)
    }

    function set(user) {
        setUserInfo(user);
    }

    const navigate = useNavigate()
    useEffect(() => {
        const checkAuth = async () => {
            try {
                let response = await axios.get("http://localhost:4000/api/validate", {
                    withCredentials: true,
                });
                if (response.status == 201) {
                    set(response.data.user);
                    navigate("/Profile");
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

    useEffect(() => {
        const getuserbuyers = async () => {
            try {
                let response = await axios.post("http://localhost:4000/api/getuserbuyers", { message: "getuserbuyers" }, {
                    withCredentials: true,
                });

                if (response.status == 201) {
                    setBuyers(response.data.buyers);
                }
            } catch (error) {
                throw error;
            }
        };

        getuserbuyers();
    }, [])

    return (
        <>
            <NavBar />
            <div className="flex justify-between items-start space-x-8">
                <div>
                    <h1 className="text-center justify-center text-2xl mt-10 mb-5"><b>User Details</b></h1>
                    <div className="flex space-x-4 mt-12 text-xl">
                        <div className="w-1/3 text-black p-4 text-center">
                            <b>FirstName:</b>
                        </div>
                        <div
                            className={`flex border border-black/10 rounded-lg px-3 py-1.5 gap-x-3 shadow-sm shadow-white/50 duration-300  text-black `}
                        >
                            <input
                                id="FirstName"
                                type="text"
                                className={`border outline-none w-full bg-transparent rounded-lg ${isTodoEditable1 ? "border-black/10 px-2" : "border-transparent"
                                    }`}
                                value={UserInfo.FirstName}
                                onChange={(e) => setUserInfo({ ...UserInfo, FirstName: e.target.value })}
                                readOnly={!isTodoEditable1}
                            />

                            <button
                                className="mt-2 inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50"
                                onClick={() => {

                                    if (isTodoEditable1) {
                                        editTodo1();
                                    } else setIsTodoEditable1((prev) => !prev);
                                }}
                            >
                                {isTodoEditable1 ? "📁" : "✏️"}
                            </button>
                        </div>
                    </div>

                    <div className="flex space-x-4 mt-12 text-xl">
                        <div className="w-1/3 text-black p-4 text-center">
                            <b>LastName:</b>
                        </div>
                        <div
                            className={`flex border border-black/10 rounded-lg px-3 py-1.5 gap-x-3 shadow-sm shadow-white/50 duration-300  text-black `}
                        >
                            <input
                                id="LastName"
                                type="text"
                                className={`border outline-none w-full bg-transparent rounded-lg ${isTodoEditable2 ? "border-black/10 px-2" : "border-transparent"
                                    }`}
                                value={UserInfo.LastName}
                                onChange={(e) => setUserInfo({ ...UserInfo, LastName: e.target.value })}
                                readOnly={!isTodoEditable2}
                            />

                            <button
                                className="mt-2 inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50"
                                onClick={() => {

                                    if (isTodoEditable2) {
                                        editTodo2();
                                    } else setIsTodoEditable2((prev) => !prev);
                                }}
                            >
                                {isTodoEditable2 ? "📁" : "✏️"}
                            </button>
                        </div>
                    </div>

                    <div className="flex space-x-4 mt-12 text-xl">
                        <div className="w-1/3 text-black p-4 text-center">
                            <b>Age:</b>
                        </div>
                        <div
                            className={`flex border border-black/10 rounded-lg px-3 py-1.5 gap-x-3 shadow-sm shadow-white/50 duration-300  text-black `}
                        >
                            <input
                                id="Age"
                                type="text"
                                className={`border outline-none w-full bg-transparent rounded-lg ${isTodoEditable3 ? "border-black/10 px-2" : "border-transparent"
                                    }`}
                                value={UserInfo.Age}
                                onChange={(e) => setUserInfo({ ...UserInfo, Age: e.target.value })}
                                readOnly={!isTodoEditable3}
                            />
                            <button
                                className="mt-2 inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50"
                                onClick={() => {

                                    if (isTodoEditable3) {
                                        editTodo3();
                                    } else setIsTodoEditable3((prev) => !prev);
                                }}
                            >
                                {isTodoEditable3 ? "📁" : "✏️"}
                            </button>
                        </div>
                    </div>

                    <div className="flex space-x-4 mt-12 text-xl">
                        <div className="w-1/3 text-black p-4 text-center">
                            <b>Contact No:</b>
                        </div>
                        <div
                            className={`flex border border-black/10 rounded-lg px-3 py-1.5 gap-x-3 shadow-sm shadow-white/50 duration-300  text-black `}
                        >
                            <input
                                id="ContactNumber"
                                type="text"
                                className={`border outline-none w-full bg-transparent rounded-lg ${isTodoEditable4 ? "border-black/10 px-2" : "border-transparent"
                                    }`}
                                value={UserInfo.ContactNumber}
                                onChange={(e) => setUserInfo({ ...UserInfo, ContactNumber: e.target.value })}
                                readOnly={!isTodoEditable4}
                            />

                            <button
                                className="mt-2 inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50"
                                onClick={() => {

                                    if (isTodoEditable4) {
                                        editTodo4();
                                    } else setIsTodoEditable4((prev) => !prev);
                                }}
                            >
                                {isTodoEditable4 ? "📁" : "✏️"}
                            </button>
                        </div>
                    </div>

                    <div className="flex space-x-4 mt-12 text-xl">
                        <div className="w-1/3 text-black p-4 text-center">
                            <b>Old Password:</b>
                        </div>
                        <div
                            className={`flex border border-black/10 rounded-lg px-3 py-1.5 gap-x-3 shadow-sm shadow-white/50 duration-300  text-black `}
                        >
                            <input
                                id="Old Password"
                                type="password"
                                className={`border outline-none w-full bg-transparent rounded-lg ${isTodoEditable5 ? "border-black/10 px-2" : "border-transparent"
                                    }`}
                                value={oldpassword}
                                placeholder="Enter your old password."
                                onChange={(e) => setOldpassword(e.target.value)}
                                readOnly={!isTodoEditable5}
                            />
                            <button
                                className="mt-2 inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50"
                                onClick={() => {

                                    if (isTodoEditable5) {
                                        editTodo5();
                                    } else setIsTodoEditable5((prev) => !prev);
                                }}
                            >
                                {isTodoEditable5 ? "📁" : "✏️"}
                            </button>

                        </div>
                    </div>

                    <div className="flex space-x-4 mt-12 text-xl">
                        <div className="w-1/3 text-black p-4 text-center">
                            <b>New Password:</b>
                        </div>
                        <div
                            className={`flex border border-black/10 rounded-lg px-3 py-1.5 gap-x-3 shadow-sm shadow-white/50 duration-300  text-black `}
                        >
                            <input
                                id="New Password"
                                type="password"
                                className={`border outline-none w-full bg-transparent rounded-lg ${isTodoEditable6 ? "border-black/10 px-2" : "border-transparent"
                                    }`}
                                value={newpassword}
                                placeholder="Enter your New password."
                                onChange={(e) => setNewpassword(e.target.value)}
                                readOnly={!isTodoEditable6}
                            />
                            <button
                                className="mt-2 inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50"
                                onClick={() => {

                                    if (isTodoEditable6) {
                                        editTodo6();
                                    } else setIsTodoEditable6((prev) => !prev);
                                }}
                            >
                                {isTodoEditable6 ? "📁" : "✏️"}
                            </button>

                        </div>
                    </div>

                    <button
                        onClick={async function () {
                            try {
                                let response = await axios.post("http://localhost:4000/api/updatedetails", { UserInfo, oldpassword, newpassword }, {
                                    withCredentials: true,
                                });

                                if (response.status == 201) {
                                    alert("Profile Details Updated Succesfully.")
                                    setNewpassword("")
                                    setOldpassword("")
                                }
                                else {
                                    alert(`Update Failed: ${response.error}`)
                                }
                            } catch (error) {
                                alert(`Update Failed: ${error}`)
                            }
                        }}
                        className="text-xl text-white font-semibold bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 rounded-lg px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none mt-10 "
                    >
                        Save changes
                    </button>
                </div>
                <div className="w-full lg:w-1/3 border border-gray-300 rounded-lg p-6 shadow-lg absolute-right-0 mt-10">
                    <h2 className="text-2xl font-bold text-center mb-6">Reviews</h2>

                    {buyers.length > 0 ? (buyers.map((review, index) => {
                        return <div className="mt-7" key={index}>
                            <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
                                <p className="text-lg"><b>Rating:</b><span className="mx-5">{review.rating} ⭐</span></p>
                                <p className="text-lg"><b>Comment:</b><span className="mx-5">{review.comment} </span></p>
                                <p className="text-base text-gray-600">- {review.FirstName} {review.LastName}</p>
                            </div>
                        </div>
                    })) : (
                        <div>
                            <p className="text-xl text-center">No Reviews Yet.</p>
                        </div>

                    )}

                </div>
            </div>
        </>
    )
}

export default Profile;