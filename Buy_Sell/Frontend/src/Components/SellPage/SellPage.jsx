import React from "react";
import { useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function SellPage() {
    const [Name, setName] = useState("")
    const [Price, setPrice] = useState(0)
    const [Description, setDescription] = useState("")
    const [Category,setCategory] = useState("")
    const categories =  ["Clothing", "Grocery", "Electronics", "Accessories", "Home&Kitchen", "Sports&Outdoors", "Stationery", "Furniture", "PersonalCare", "Toys&Games"]
    const navigate = useNavigate()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                let response = await axios.get("http://localhost:4000/api/validate", {
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

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center justify-center mt-20 ">
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                            let response = await axios.post("http://localhost:4000/api/additem", { Name,Price,Description,Category}, {
                                withCredentials: true
                            });

                            if (response.status == 201) {
                                alert("Item Uploaded on the website.")
                            }
                            else
                            {
                                alert("An error Occured while selling this item.")
                            }
                        } catch (err) {
                            alert(err.response?.data?.message || "An error occurred");
                        }
                    }}

                    className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg text-xl"
                >
                    <Link to="#" className="flex items-center justify-center">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/en/e/e1/International_Institute_of_Information_Technology%2C_Hyderabad_logo.png"
                            className="mr-3 h-20 "
                            alt="Logo"
                        /> 
                    </Link>
                    <div className="mb-4 mt-5">
                        <label
                            htmlFor="Name"
                            className="block text-gray-700 font-bold mb-2"
                        >
                            Name:
                        </label>
                        <input
                            id="Name"
                            type="text"
                            placeholder="Enter Item Name"
                            value={Name}
                            required
                            onChange={(e) => {
                                return setName(e.target.value)
                            }}
                            autoComplete="given-name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none hover:ring-2 hover:ring-blue-400"
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="Price(Rs)"
                            className="block text-gray-700 font-bold mb-2"
                        >
                            Price:
                        </label>
                        <input
                            id="Price"
                            type="Price"
                            placeholder="Enter Item Price"
                            value={Price}
                            onChange={(e) => {
                                return setPrice(e.target.value)
                            }}
                            autoComplete="given-name"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none hover:ring-2 hover:ring-blue-400"
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="Description"
                            className="block text-gray-700 font-bold mb-2"
                        >
                            Description:
                        </label>
                        <textarea
                            id="Description"
                            type="Description"
                            placeholder="Enter Item Description"
                            value={Description}
                            required
                            onChange={(e) => {
                                return setDescription(e.target.value)
                            }}
                            autoComplete="given-name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none hover:ring-2 hover:ring-blue-400"
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            htmlFor="Category"
                            className="block text-gray-700 font-bold mb-2"
                        >
                            Category:
                        </label>
                        <select
                            id="Category"
                            name="Category"
                            value={Category}
                            onChange={(e) => {
                                return setCategory(e.target.value)
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="mt-5  bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Sell Item
                    </button>
                </form>

            </div>
        </>
    )
}

export default SellPage;