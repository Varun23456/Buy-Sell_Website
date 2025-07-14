import React from "react"
import { Link, NavLink } from "react-router-dom"

function NavBar() {
    return (
        <>
            <header className="shadow z-50 top-0">
                <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
                    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                        <Link to="#" className="flex items-center">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/en/e/e1/International_Institute_of_Information_Technology%2C_Hyderabad_logo.png"
                                className="mr-3 h-12 height"
                                alt="Logo"
                            />
                        </Link>
                        <div className="flex items-center lg:order-2 text-lg">
                            <Link
                                to="/Logout"
                                className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                            >
                                Logout
                            </Link>
                        </div>
                        <div
                            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1 text-lg"
                            id="mobile-menu-2"
                        >
                            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                                <li>
                                    <NavLink
                                        to="/Profile"
                                        className={({ isActive }) =>
                                            `block py-2 pr-4 pl-3 ${isActive ? "text-blue-500" : "text-gray-700"}
                                    duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-blue-500 lg:p-0`
                                        }
                                    >
                                        Profile
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/SearchItems"
                                        className={({ isActive }) =>
                                            `block py-2 pr-4 pl-3 ${isActive ? "text-blue-500" : "text-gray-700"}
                                    duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-blue-500 lg:p-0`
                                        }
                                    >
                                        Buy
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/History"
                                        className={({ isActive }) =>
                                            `block py-2 pr-4 pl-3 ${isActive ? "text-blue-500" : "text-gray-700"}
                                    duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-blue-500 lg:p-0`
                                        }
                                    >
                                        History
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/DeliverItems"
                                        className={({ isActive }) =>
                                            `block py-2 pr-4 pl-3 ${isActive ? "text-blue-500" : "text-gray-700"}
                                    duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-blue-500 lg:p-0`
                                        }
                                    >
                                        Deliver Items
                                    </NavLink>
                                </li>


                                <li>
                                    <NavLink
                                        to="/MyCart"
                                        className={({ isActive }) =>
                                            `block py-2 pr-4 pl-3 ${isActive ? "text-blue-500" : "text-gray-700"}
                                    duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-blue-500 lg:p-0`
                                        }
                                    >
                                        MyCart
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/SellPage"
                                        className={({ isActive }) =>
                                            `block py-2 pr-4 pl-3 ${isActive ? "text-blue-500" : "text-gray-700"}
                                    duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-blue-500 lg:p-0`
                                        }
                                    >
                                        Sell
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/ChatBot"
                                        className={({ isActive }) =>
                                            `block py-2 pr-4 pl-3 ${isActive ? "text-blue-500" : "text-gray-700"}
                                    duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-blue-500 lg:p-0`
                                        }
                                    >
                                        Support
                                    </NavLink>
                                </li>

                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    );
}

export default NavBar;