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
                    // let UserInfo = response.data.user
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
            <div className="flex flex-wrap mt-5 w-full">
                <div className="mt-2">
                    <div className="absolute left-10 mt-5 text-2xl"><b>Filters</b></div>
                    <div className="w-1/4 absolute left-10 mt-10 text-lg">
                        {Categories.map((category, index) => {
                            return <div className="flex mt-10" key={index}>
                                <input
                                    type="checkbox"
                                    id={category}
                                    checked={checkboxes[category]}
                                    className="w-5"
                                    onChange={(e) => {
                                        setCheckboxes((prev) => { return { ...prev, [category]: !prev[category] } })
                                    }} />
                                <label htmlFor={category} className="mr-2 px-8 text-lg">{Categories[index]}</label>
                            </div>
                        })}
                    </div>
                </div>
                <div className=" mt-5 w-full">
                    <form onSubmit={(e) => {
                        e.preventDefault()
                    }}>
                        <div className="flex">
                            <input
                                type="text"
                                id="SearchBar"
                                value={SearchBar}
                                onChange={(e) => setSearchBar(e.target.value)}
                                placeholder="Search Products Here...."
                                className="w-full text-black border border-gray-400 hover:border-gray-500 p-2 text-2xl rounded-xl"/>
                            <button type="submit"
                                className="mx-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200">
                                Search
                            </button>
                        </div>
                    </form>
                </div>
                <div className="flex flex-wrap w-full">
                    {Items.map((item, index) => {
                        return <div className="flex flex-col m-20 w-1/5 border border-gray-400 hover:border-gray-500 p-5 rounded-3xl" key={index}>
                            <Link to="#" className="flex items-center">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/en/e/e1/International_Institute_of_Information_Technology%2C_Hyderabad_logo.png"
                                    className="mr-3 h-30 "
                                    alt="Logo"
                                />
                            </Link>
                            <div className="text-xl mt-4"><b>{item.Name}</b></div>
                            <div className="text-xl mt-2">Price( Rs): {item.Price}/-</div>
                            <div className="text-xl mt-2">Category: {item.Category}</div>
                            <button
                                onClick={() => {
                                    navigate(`/Item/${item._id}`)
                                }}
                                className=" bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 mt-5"
                            >
                                Click Here
                            </button>
                        </div>
                    })}
                </div>
            </div>
        </>
    )
}

export default SearchItems;