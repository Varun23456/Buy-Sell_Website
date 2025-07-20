import React, { useState, useEffect } from "react"
import { Link, NavLink } from "react-router-dom"

function NavBar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobileMenuOpen && !event.target.closest('nav')) {
                setIsMobileMenuOpen(false)
            }
        }

        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [isMobileMenuOpen])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMobileMenuOpen])

    const navLinks = [
        { to: "/Profile", label: "Profile" },
        { to: "/SearchItems", label: "Buy" },
        { to: "/History", label: "History" },
        { to: "/DeliverItems", label: "Deliver" },
        { to: "/MyCart", label: "Cart" },
        { to: "/SellPage", label: "Sell" },
        { to: "/ChatBot", label: "Support" }
    ]

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200">
            <nav className="px-4 lg:px-8 py-4">
                <div className="flex justify-between items-center mx-auto max-w-8xl">
                    {/* Logo */}
                    <Link to="/Profile" className="flex items-center flex-shrink-0 group">
                        <div className="relative">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/en/e/e1/International_Institute_of_Information_Technology%2C_Hyderabad_logo.png"
                                className="h-12 w-auto mr-4 transition-transform duration-300 group-hover:scale-105"
                                alt="IIIT Hyderabad Logo"
                                onError={(e) => {
                                    e.target.style.display = 'none'
                                }}
                            />
                            <div className="absolute inset-0 bg-blue-500/10 rounded-full scale-0 group-hover:scale-110 transition-transform duration-300"></div>
                        </div>
                        <div className="hidden sm:block">
                            {/* <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                BUY SELL IIIT-H
                            </span> */}
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-2 flex-1 justify-center">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `group relative px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-300 transform ${
                                        isActive 
                                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-105" 
                                            : "text-gray-700 hover:bg-gray-100 hover:text-blue-600 hover:scale-105"
                                    }`
                                }
                            >
                                <span className="flex items-center space-x-2">
                                    <span>{link.label}</span>
                                </span>
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </NavLink>
                        ))}
                    </div>

                    {/* Right side buttons */}
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/Logout"
                            className="group relative bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl text-base px-6 py-2.5 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
                        >
                            <span className="flex items-center space-x-2">
                                <span>Logout</span>
                            </span>
                            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>

                        {/* Mobile menu button */}
                        <button
                            type="button"
                            className="lg:hidden relative inline-flex items-center justify-center p-3 text-gray-600 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105"
                            onClick={toggleMobileMenu}
                            aria-expanded={isMobileMenuOpen}
                            aria-label="Toggle mobile menu"
                        >
                            <div className="relative w-6 h-6">
                                <span 
                                    className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${
                                        isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
                                    }`}
                                    style={{ top: '50%', left: '0' }}
                                ></span>
                                <span 
                                    className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${
                                        isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                                    }`}
                                    style={{ top: '50%', left: '0' }}
                                ></span>
                                <span 
                                    className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${
                                        isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
                                    }`}
                                    style={{ top: '50%', left: '0' }}
                                ></span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div 
                    className={`lg:hidden transition-all duration-500 ease-out ${
                        isMobileMenuOpen 
                            ? 'max-h-screen opacity-100 translate-y-0 visible' 
                            : 'max-h-0 opacity-0 -translate-y-4 overflow-hidden invisible'
                    }`}
                >
                    <div className="px-4 pt-4 pb-6 space-y-3 mt-4 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border border-gray-200/50 shadow-lg backdrop-blur-sm">
                        {navLinks.map((link) => (
                            <NavLink
                                key={`mobile-${link.to}`}
                                to={link.to}
                                className={({ isActive }) =>
                                    `group block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 transform hover:scale-102 ${
                                        isActive 
                                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md" 
                                            : "text-gray-700 hover:bg-white/70 hover:text-blue-600 hover:shadow-md"
                                    }`
                                }
                                onClick={closeMobileMenu}
                            >
                                <span className="flex items-center space-x-3">
                                    <span>{link.label}</span>
                                </span>
                            </NavLink>
                        ))}
                        
                        {/* Mobile Logout Button */}
                        <div className="pt-3 border-t border-gray-200">
                            <Link
                                to="/Logout"
                                className="group block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 transform hover:scale-102 bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md hover:shadow-lg"
                                onClick={closeMobileMenu}
                            >
                                <span className="flex items-center space-x-3">
                                    <span>Logout</span>
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default NavBar;