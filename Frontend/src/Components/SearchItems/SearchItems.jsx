import React from "react";
import NavBar from "../NavBar/NavBar";
import { useState, useEffect } from "react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";

function SearchItems() {
    let Categories = ["Clothing", "Grocery", "Electronics", "Accessories", "Home&Kitchen", "Sports&Outdoors", "Stationery", "Furniture", "PersonalCare", "Toys&Games"]
    const navigate = useNavigate()
    const [Items, setItems] = useState([])
    const [SearchBar, setSearchBar] = useState("")
    const [checkboxes, setCheckboxes] = useState({
        "Clothing": false, "Grocery": false, "Electronics": false, "Accessories": false, "Home&Kitchen": false, "Sports&Outdoors": false,
        "Stationery": false, "Furniture": false, "PersonalCare": false, "Toys&Games": false
    })

    useEffect(() => {
        const checkAuth = async () => {
            try {
                let response = await axios.get("http://localhost:4000/api/validate", {
                    withCredentials: true,
                });
                if (response.status == 201) {
                    navigate("/SearchItems");
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

    function set(items) {
        setItems(items);
    }

    useEffect(() => {
        const getItems = async () => {
            try {
                let response = await axios.post("http://localhost:4000/api/getitems", { checkboxes, SearchBar }, {
                    withCredentials: true,
                });
                set(response.data.items);
            } catch (error) {
                throw error;
            }
        };

        getItems();

    }, [checkboxes, SearchBar])

    return (
        <>
            <NavBar />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="top-0 z-30 bg-gradient-to-br from-gray-50 to-gray-100 pt-4 pb-2">
                    <div className="w-full px-4 lg:px-8">
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 backdrop-blur-sm bg-white/95">
                            <form onSubmit={(e) => { e.preventDefault() }}>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            id="SearchBar"
                                            value={SearchBar}
                                            onChange={(e) => setSearchBar(e.target.value)}
                                            placeholder="Search for products, brands, and more..."
                                            className="w-full px-6 py-4 pl-12 text-base text-gray-700 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/50 focus:border-blue-500 transition duration-300 hover:bg-gray-100"
                                        />
                                        <svg className="absolute left-4 top-4 h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-3 focus:ring-blue-500/50 focus:ring-offset-2 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        Search
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Fixed Mobile Horizontal Filters */}
                <div className="lg:hidden sticky top-24 z-20 bg-gradient-to-br from-gray-50 to-gray-100 pb-2">
                    <div className="w-full px-4">
                        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 backdrop-blur-sm bg-white/95">
                            <div className="flex items-center mb-4">
                                <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {Categories.map((category, index) => {
                                    return (
                                        <label
                                            key={index}
                                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 border-2 ${checkboxes[category]
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checkboxes[category]}
                                                onChange={(e) => {
                                                    setCheckboxes((prev) => { return { ...prev, [category]: !prev[category] } })
                                                }}
                                                className="sr-only"
                                            />
                                            <span className="text-xs sm:text-sm">
                                                {Categories[index].replace('&', ' & ')}
                                            </span>
                                        </label>
                                    )
                                })}
                            </div>
                            {/* Clear Filters Button for Mobile */}
                            <div className="mt-4 pt-3 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        setCheckboxes({
                                            "Clothing": false, "Grocery": false, "Electronics": false, "Accessories": false, "Home&Kitchen": false, "Sports&Outdoors": false,
                                            "Stationery": false, "Furniture": false, "PersonalCare": false, "Toys&Games": false
                                        });
                                    }}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full px-4 py-4 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8 max-w-full">
                        {/* Desktop Sidebar Filters - Fixed */}
                        <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
                            <div className="sticky top-28 bg-white rounded-xl shadow-lg p-6 h-fit border border-gray-200 backdrop-blur-sm bg-white/95">
                                <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
                                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                                    </svg>
                                    <h2 className="text-xl font-bold text-gray-800">
                                        Filter Products
                                    </h2>
                                </div>
                                <div className="space-y-5 max-h-96 overflow-y-auto">
                                    {Categories.map((category, index) => {
                                        return (
                                            <div className="flex items-center group hover:bg-gray-50 p-2 rounded-lg transition-all duration-200" key={index}>
                                                <input
                                                    type="checkbox"
                                                    id={`desktop-${category}`}
                                                    checked={checkboxes[category]}
                                                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                                                    onChange={(e) => {
                                                        setCheckboxes((prev) => { return { ...prev, [category]: !prev[category] } })
                                                    }}
                                                />
                                                <label
                                                    htmlFor={`desktop-${category}`}
                                                    className="ml-4 text-base font-medium text-gray-700 hover:text-blue-600 cursor-pointer transition-colors duration-200 group-hover:text-blue-600"
                                                >
                                                    {Categories[index].replace('&', ' & ')}
                                                </label>
                                            </div>
                                        )
                                    })}
                                </div>
                                {/* Clear Filters Button for Desktop */}
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => {
                                            setCheckboxes({
                                                "Clothing": false, "Grocery": false, "Electronics": false, "Accessories": false, "Home&Kitchen": false, "Sports&Outdoors": false,
                                                "Stationery": false, "Furniture": false, "PersonalCare": false, "Toys&Games": false
                                            });
                                        }}
                                        className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-blue-50"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            {/* Products Grid with Mobile Spacing */}
                            <div className="px-4 sm:px-0">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-md mx-auto lg:max-w-none">
                                    {Items.map((item, index) => {
                                        return (
                                            <div
                                                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-gray-200 transform hover:-translate-y-2 backdrop-blur-sm bg-white/95"
                                                key={index}
                                            >
                                                <div className="relative overflow-hidden">
                                                    <Link to="#" className="block">
                                                        <div className="h-48 lg:h-64 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative">
                                                            <img
                                                                src="https://upload.wikimedia.org/wikipedia/en/e/e1/International_Institute_of_Information_Technology%2C_Hyderabad_logo.png"
                                                                className="h-32 lg:h-40 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
                                                                alt="Product"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                        </div>
                                                    </Link>
                                                    <div className="absolute top-3 right-3">
                                                        <span className="inline-flex items-center px-2 py-1 lg:px-3 lg:py-1.5 rounded-full text-xs lg:text-sm font-semibold bg-blue-100 text-blue-800 shadow-sm">
                                                            {item.Category}
                                                        </span>
                                                    </div>
                                                    <div className="absolute top-3 left-3">
                                                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 lg:p-2 shadow-sm">
                                                            <svg className="w-3 h-3 lg:w-4 lg:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="max-w-[60%] sm:max-w-[70%] md:max-w-[75%] lg:max-w-none mx-auto">
                                                    <div className="p-4 lg:p-6">
                                                        <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-2 lg:mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                                                            {item.Name}
                                                        </h3>

                                                        <div className="flex items-center justify-between mb-4 lg:mb-5">
                                                            <div className="text-xl lg:text-2xl font-bold text-green-600">
                                                                ₹{item.Price}
                                                            </div>
                                                            <div className="flex items-center text-xs lg:text-sm text-gray-500">
                                                                <svg className="w-3 h-3 lg:w-4 lg:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                                4.5
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => {
                                                                navigate(`/Item/${item._id}`)
                                                            }}
                                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm lg:text-base font-semibold py-2.5 lg:py-3.5 px-3 lg:px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-3 focus:ring-blue-500/50 focus:ring-offset-2 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* No Results Message */}
                            {Items.length === 0 && (
                                <div className="px-4 sm:px-0">
                                    <div className="bg-white rounded-xl shadow-lg p-8 lg:p-16 text-center border border-gray-200 backdrop-blur-sm bg-white/95 max-w-md mx-auto lg:max-w-none">
                                        <div className="text-gray-300 text-4xl lg:text-6xl mb-4 lg:mb-6">
                                            🔍
                                        </div>
                                        <h3 className="text-xl lg:text-2xl font-bold text-gray-600 mb-3 lg:mb-4">
                                            No products found
                                        </h3>
                                        <p className="text-base lg:text-lg text-gray-500 max-w-md mx-auto">
                                            We couldn't find any products matching your search criteria. Try adjusting your filters or search terms.
                                        </p>
                                        <button
                                            onClick={() => {
                                                setSearchBar("");
                                                setCheckboxes({
                                                    "Clothing": false, "Grocery": false, "Electronics": false, "Accessories": false, "Home&Kitchen": false, "Sports&Outdoors": false,
                                                    "Stationery": false, "Furniture": false, "PersonalCare": false, "Toys&Games": false
                                                });
                                            }}
                                            className="mt-4 lg:mt-6 px-5 lg:px-6 py-2.5 lg:py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-300"
                                        >
                                            Clear All Filters
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SearchItems; 