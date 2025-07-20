import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import NavBar from "../NavBar/NavBar";

function Profile() {
    const [isEditMode, setIsEditMode] = useState(false)
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

    const [editedUserInfo, setEditedUserInfo] = useState({})
    const [oldpassword, setOldpassword] = useState("")
    const [newpassword, setNewpassword] = useState("")

    function set(user) {
        setUserInfo(user);
        setEditedUserInfo(user);
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

    const handleEditProfile = () => {
        setIsEditMode(true);
        setEditedUserInfo({ ...UserInfo });
    }

    const handleCancel = () => {
        setIsEditMode(false);
        setEditedUserInfo({ ...UserInfo });
        setOldpassword("");
        setNewpassword("");
    }

    const handleSave = async () => {
        try {
            let response = await axios.post("http://localhost:4000/api/updatedetails", { 
                UserInfo: editedUserInfo, 
                oldpassword, 
                newpassword 
            }, {
                withCredentials: true,
            });

            if (response.status == 201) {
                alert("Profile Details Updated Successfully.")
                setUserInfo(editedUserInfo);
                setNewpassword("")
                setOldpassword("")
                setIsEditMode(false);
            }
            else {
                alert(`Update Failed: ${response.error}`)
            }
        } catch (error) {
            alert(`Update Failed: ${error}`)
        }
    }

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="container mx-auto px-4 py-6 lg:py-8">
                    <div className="flex flex-col xl:flex-row gap-6 xl:gap-8">
                        {/* User Details Section */}
                        <div className="flex-1 xl:w-2/3">
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-center">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-white">User Profile</h1>
                                    <p className="text-blue-100 mt-2">
                                        {isEditMode ? "Edit your account information" : "Manage your account information"}
                                    </p>
                                </div>
                                
                                <div className="p-6 sm:p-8">
                                    {!isEditMode ? (
                                        /* View Mode */
                                        <div className="space-y-6">
                                            {/* Name Section */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                                                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">First Name</label>
                                                    <p className="text-xl font-bold text-gray-800 mt-2">{UserInfo.FirstName}</p>
                                                </div>
                                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                                                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Last Name</label>
                                                    <p className="text-xl font-bold text-gray-800 mt-2">{UserInfo.LastName}</p>
                                                </div>
                                            </div>

                                            {/* Email */}
                                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                                                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Email Address</label>
                                                <p className="text-xl font-bold text-gray-800 mt-2">{UserInfo.Email}</p>
                                                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                            </div>

                                            {/* Contact and Age */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                                                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Contact Number</label>
                                                    <p className="text-xl font-bold text-gray-800 mt-2">{UserInfo.ContactNumber}</p>
                                                </div>
                                                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
                                                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Age</label>
                                                    <p className="text-xl font-bold text-gray-800 mt-2">{UserInfo.Age} years</p>
                                                </div>
                                            </div>

                                            {/* Edit Profile Button */}
                                            <div className="pt-6 text-center">
                                                <button
                                                    onClick={handleEditProfile}
                                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-lg inline-flex items-center gap-2"
                                                >
                                                    Edit Profile
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Edit Mode */
                                        <div className="space-y-6">
                                            {/* Name Fields */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700">First Name</label>
                                                    <input
                                                        type="text"
                                                        value={editedUserInfo.FirstName}
                                                        onChange={(e) => setEditedUserInfo({ ...editedUserInfo, FirstName: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700">Last Name</label>
                                                    <input
                                                        type="text"
                                                        value={editedUserInfo.LastName}
                                                        onChange={(e) => setEditedUserInfo({ ...editedUserInfo, LastName: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                                                    />
                                                </div>
                                            </div>

                                            {/* Email (Read-only) */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={editedUserInfo.Email}
                                                    readOnly
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                                                />
                                                <p className="text-xs text-gray-500">Email cannot be changed</p>
                                            </div>

                                            {/* Contact and Age */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700">Contact Number</label>
                                                    <input
                                                        type="text"
                                                        value={editedUserInfo.ContactNumber}
                                                        onChange={(e) => setEditedUserInfo({ ...editedUserInfo, ContactNumber: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700">Age</label>
                                                    <input
                                                        type="number"
                                                        value={editedUserInfo.Age}
                                                        onChange={(e) => setEditedUserInfo({ ...editedUserInfo, Age: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                                                    />
                                                </div>
                                            </div>

                                            {/* Password Change Section */}
                                            <div className="border-t border-gray-200 pt-6 mt-8">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">Change Password (Optional)</h3>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-semibold text-gray-700">Old Password</label>
                                                        <input
                                                            type="password"
                                                            value={oldpassword}
                                                            onChange={(e) => setOldpassword(e.target.value)}
                                                            placeholder="Enter current password"
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-semibold text-gray-700">New Password</label>
                                                        <input
                                                            type="password"
                                                            value={newpassword}
                                                            onChange={(e) => setNewpassword(e.target.value)}
                                                            placeholder="Enter new password"
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center">
                                                <button
                                                    onClick={handleSave}
                                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-lg inline-flex items-center justify-center gap-2"
                                                >
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-lg inline-flex items-center justify-center gap-2"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="xl:w-1/3">
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden sticky top-6">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-center">
                                    <h2 className="text-2xl font-bold text-white">⭐ Reviews</h2>
                                    <p className="text-slate-300 mt-2">What people say about you</p>
                                </div>

                                <div className="p-6 max-h-96 overflow-y-auto">
                                    {buyers.length > 0 ? (
                                        <div className="space-y-4">
                                            {buyers.slice(0, 2).map((review, index) => (
                                                <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-100 hover:shadow-md transition-shadow duration-200">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-2xl">⭐</span>
                                                            <span className="font-bold text-lg text-gray-800">{review.rating}</span>
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {review.FirstName} {review.LastName}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed">"{review.comment}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="text-6xl mb-4">📝</div>
                                            <p className="text-xl text-gray-500">No Reviews Yet</p>
                                            <p className="text-gray-400 mt-2">Start selling to get your first review!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;