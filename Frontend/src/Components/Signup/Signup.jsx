import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
    const [formData, setFormData] = useState({
        FirstName: "",
        LastName: "",
        Email: "",
        Password: "",
        Age: "",
        ContactNumber: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const newErrors = {};
        if (!formData.FirstName) newErrors.FirstName = "First name is required";
        if (!formData.LastName) newErrors.LastName = "Last name is required";
        if (!formData.Email || !/.*@.*\.iiit\.ac\.in/.test(formData.Email)) {
            newErrors.Email = "Please enter a valid IIIT email";
        }
        if (!formData.Password) newErrors.Password = "Password is required";
        if (!formData.Age) newErrors.Age = "Age is required";
        if (!formData.ContactNumber || formData.ContactNumber.length !== 10) {
            newErrors.ContactNumber = "10-digit number required";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            setLoading(false);
            return;
        }

        try {
            let response = await axios.post("http://localhost:4000/api/register", formData);
            alert('Registration Successful.');
            if (response.status === 201) {
                navigate('/');
            }
        } catch (err) {
            alert(err.response?.data.error || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                let response = await axios.get("http://localhost:4000/api/validate", {
                    withCredentials: true,
                });
                if (response.status === 201) {
                    navigate("/Profile");
                }
            } catch (error) {
                // Stay on register page if not authenticated
            }
        };
        checkAuth();
    }, [navigate]);

    return (
        <div className="min-h-screen flex flex-col justify-center py-6 sm:px-2 lg:px-4">
            <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                <div className="flex justify-center">
                    <div className="flex flex-col items-center text-center">
                        {/* Shopping Cart Icon */}
                        <svg className="h-20 w-20 text-indigo-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4-1H1m6 12a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
                        </svg>
                        <div className="mb-8">
                            <h1 className="text-4xl font-extrabold text-gray-900">IIITH Marketplace</h1>
                            <p className="text-lg text-gray-600">Campus Buy & Sell Platform</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-lg">
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
                    <h4 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
                        Create Account
                    </h4>
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div className="md:col-span-1">
                                <label htmlFor="FirstName" className="block text-lg font-semibold text-gray-700 mb-2 text-left">
                                    First Name
                                </label>
                                <input
                                    id="FirstName"
                                    name="FirstName"
                                    type="text"
                                    value={formData.FirstName}
                                    onChange={handleChange}
                                    placeholder="Enter your first name"
                                    className={`block w-full appearance-none rounded-md border px-4 py-3 placeholder-gray-400 shadow-sm focus:outline-none text-base ${
                                        errors.FirstName
                                            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                    }`}
                                />
                                {errors.FirstName && (
                                    <p className="mt-1 text-base text-red-600">{errors.FirstName}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div className="md:col-span-1">
                                <label htmlFor="LastName" className="block text-lg font-semibold text-gray-700 mb-2 text-left">
                                    Last Name
                                </label>
                                <input
                                    id="LastName"
                                    name="LastName"
                                    type="text"
                                    value={formData.LastName}
                                    onChange={handleChange}
                                    placeholder="Enter your last name"
                                    className={`block w-full appearance-none rounded-md border px-4 py-3 placeholder-gray-400 shadow-sm focus:outline-none text-base ${
                                        errors.LastName
                                            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                    }`}
                                />
                                {errors.LastName && (
                                    <p className="mt-1 text-base text-red-600">{errors.LastName}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="Email" className="block text-lg font-semibold text-gray-700 mb-2 text-left">
                                IIIT Email Address
                            </label>
                            <div className="relative">
                                <input
                                    id="Email"
                                    name="Email"
                                    type="email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    placeholder="Enter your IIIT email"
                                    className={`block w-full appearance-none rounded-md border px-4 py-3 placeholder-gray-400 shadow-sm focus:outline-none text-base ${
                                        errors.Email
                                            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                    }`}
                                />
                                {/* Email Icon */}
                                <svg className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            {errors.Email && (
                                <p className="mt-1 text-base text-red-600">{errors.Email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="Password" className="block text-lg font-semibold text-gray-700 mb-2 text-left">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="Password"
                                    name="Password"
                                    type="password"
                                    value={formData.Password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className={`block w-full appearance-none rounded-md border px-4 py-3 placeholder-gray-400 shadow-sm focus:outline-none text-base ${
                                        errors.Password
                                            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                    }`}
                                />
                                {/* Lock Icon */}
                                <svg className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            {errors.Password && (
                                <p className="mt-1 text-base text-red-600">{errors.Password}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Age */}
                            <div>
                                <label htmlFor="Age" className="block text-lg font-semibold text-gray-700 mb-2 text-left">
                                    Age
                                </label>
                                <input
                                    id="Age"
                                    name="Age"
                                    type="number"
                                    value={formData.Age}
                                    onChange={handleChange}
                                    placeholder="Enter your age"
                                    className={`block w-full appearance-none rounded-md border px-4 py-3 placeholder-gray-400 shadow-sm focus:outline-none text-base ${
                                        errors.Age
                                            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                    }`}
                                />
                                {errors.Age && (
                                    <p className="mt-1 text-base text-red-600">{errors.Age}</p>
                                )}
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label htmlFor="ContactNumber" className="block text-lg font-semibold text-gray-700 mb-2 text-left">
                                    Contact Number
                                </label>
                                <div className="relative">
                                    <input
                                        id="ContactNumber"
                                        name="ContactNumber"
                                        type="tel"
                                        value={formData.ContactNumber}
                                        onChange={handleChange}
                                        placeholder="9876543210"
                                        className={`block w-full appearance-none rounded-md border px-4 py-3 placeholder-gray-400 shadow-sm focus:outline-none text-base ${
                                            errors.ContactNumber
                                                ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                        }`}
                                    />
                                    {/* Phone Icon */}
                                    <svg className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                {errors.ContactNumber && (
                                    <p className="mt-1 text-base text-red-600">{errors.ContactNumber}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-lg font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </div>

                        {/* Login Link */}
                        <div className="text-center">
                            <p className="mt-2 text-lg text-gray-600">
                                Already have an account?{' '}
                                <Link
                                    to="/"
                                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors "
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;