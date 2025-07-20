import React from "react";
import { useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function SellPage() {
    const [Name, setName] = useState("")
    const [Price, setPrice] = useState("")
    const [Description, setDescription] = useState("")
    const [Category, setCategory] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formErrors, setFormErrors] = useState({})
    const [successMessage, setSuccessMessage] = useState("")
    
    const categories = [
        "Select Category", 
        "Clothing", 
        "Grocery", 
        "Electronics", 
        "Accessories", 
        "Home & Kitchen", 
        "Sports & Outdoors", 
        "Stationery", 
        "Furniture", 
        "Personal Care", 
        "Toys & Games"
    ]
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                let response = await axios.get("/api/validate", {
                    withCredentials: true,
                });
                if (response.status == 201) {
                    navigate("/SellPage");
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

    const validateForm = () => {
        const errors = {};
        
        if (!Name.trim()) errors.Name = "Item name is required";
        if (!Price || parseFloat(Price) <= 0) errors.Price = "Valid price is required";
        if (!Category || Category === "Select Category") errors.Category = "Please select a category";
        if (!Description.trim()) errors.Description = "Description is required";
        if (Description.trim().length < 10) errors.Description = "Description must be at least 10 characters";
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        
        try {
            let response = await axios.post("/api/additem", { 
                Name: Name.trim(), 
                Price: parseFloat(Price), 
                Description: Description.trim(), 
                Category 
            }, {
                withCredentials: true
            });

            if (response.status == 201) {
                setSuccessMessage("🎉 Item listed successfully! Your item is now available for sale.");
                // Reset form
                setName("");
                setPrice("");
                setDescription("");
                setCategory("");
                setFormErrors({});
                
                // Auto-hide success message after 5 seconds
                setTimeout(() => setSuccessMessage(""), 5000);
            } else {
                alert("An error occurred while listing this item.");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An error occurred while listing your item";
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="space-y-2">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                                List Your Item
                            </h1>
                        </div>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <p className="ml-3 text-sm font-medium text-green-800">{successMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Form Section */}
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 sm:px-8 py-6">
                            <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center">
                                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                </svg>
                                Item Details
                            </h2>
                            <p className="text-blue-100 text-sm mt-1">Fill in the information about your item</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                            {/* Item Name */}
                            <div className="space-y-2">
                                <label htmlFor="Name" className="flex items-center text-sm font-semibold text-gray-700">
                                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                                    </svg>
                                    Item Name <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    id="Name"
                                    type="text"
                                    placeholder="e.g., iPhone 13, Study Table, Winter Jacket..."
                                    value={Name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (formErrors.Name) setFormErrors({...formErrors, Name: ""});
                                    }}
                                    className={`w-full px-4 py-3 sm:py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-gray-50 hover:bg-white ${
                                        formErrors.Name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                    }`}
                                />
                                {formErrors.Name && (
                                    <p className="text-red-600 text-xs mt-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                        </svg>
                                        {formErrors.Name}
                                    </p>
                                )}
                            </div>

                            {/* Price and Category Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {/* Price */}
                                <div className="space-y-2">
                                    <label htmlFor="Price" className="flex items-center text-sm font-semibold text-gray-700">
                                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                                        </svg>
                                        Price (₹) <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                        <input
                                            id="Price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="1500"
                                            value={Price}
                                            onChange={(e) => {
                                                setPrice(e.target.value);
                                                if (formErrors.Price) setFormErrors({...formErrors, Price: ""});
                                            }}
                                            className={`w-full pl-8 pr-4 py-3 sm:py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 bg-gray-50 hover:bg-white ${
                                                formErrors.Price ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                            }`}
                                        />
                                    </div>
                                    {formErrors.Price && (
                                        <p className="text-red-600 text-xs mt-1 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                            </svg>
                                            {formErrors.Price}
                                        </p>
                                    )}
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <label htmlFor="Category" className="flex items-center text-sm font-semibold text-gray-700">
                                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                                        </svg>
                                        Category <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <select
                                        id="Category"
                                        name="Category"
                                        value={Category}
                                        onChange={(e) => {
                                            setCategory(e.target.value);
                                            if (formErrors.Category) setFormErrors({...formErrors, Category: ""});
                                        }}
                                        className={`w-full px-4 py-3 sm:py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-gray-50 hover:bg-white ${
                                            formErrors.Category ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                        }`}
                                    >
                                        {categories.map((category) => (
                                            <option 
                                                key={category} 
                                                value={category}
                                                disabled={category === "Select Category"}
                                                className={category === "Select Category" ? "text-gray-400" : "text-gray-900"}
                                            >
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                    {formErrors.Category && (
                                        <p className="text-red-600 text-xs mt-1 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                            </svg>
                                            {formErrors.Category}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label htmlFor="Description" className="flex items-center text-sm font-semibold text-gray-700">
                                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"/>
                                    </svg>
                                    Description <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <textarea
                                        id="Description"
                                        placeholder="Provide a detailed description of your item including condition, features, and any other relevant information..."
                                        value={Description}
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                            if (formErrors.Description) setFormErrors({...formErrors, Description: ""});
                                        }}
                                        rows="5"
                                        className={`w-full px-4 py-3 sm:py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none bg-gray-50 hover:bg-white ${
                                            formErrors.Description ? 'border-red-300 bg-red-50' : 'border-gray-200'
                                        }`}
                                    />
                                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                                        {Description.length}/500
                                    </div>
                                </div>
                                {formErrors.Description && (
                                    <p className="text-red-600 text-xs mt-1 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                        </svg>
                                        {formErrors.Description}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-4 px-6 rounded-xl font-semibold text-white text-base sm:text-lg transition-all duration-300 transform ${
                                        isSubmitting 
                                            ? 'bg-gray-400 cursor-not-allowed scale-100' 
                                            : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                                            <span>Listing Your Item...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                                            </svg>
                                            List Item for Sale
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Tips Section */}
                    {/* <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-semibold text-amber-800 mb-2">💡 Tips for Better Sales</h3>
                                <ul className="text-xs text-amber-700 space-y-1">
                                    <li>• Use clear, descriptive names for your items</li>
                                    <li>• Set competitive prices based on item condition</li>
                                    <li>• Write detailed descriptions including condition and features</li>
                                    <li>• Choose the most appropriate category for better visibility</li>
                                </ul>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default SellPage;