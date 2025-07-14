import React, { useState,useEffect } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Signup() {
    const [FirstName, setFirstName] = useState("");
    const [LastName, setLastName] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [Age, setAge] = useState("")
    const [ContactNumber, setContactNumber] = useState("")
    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault();
        const emailPattern = /.*@.*\.iiit\.ac\.in/;
        if (!emailPattern.test(Email)) {
            alert("Please enter a valid IIIT email.");
            return;
        }

        if(ContactNumber.length !== 10){
            alert("Please enter a valid Contact Number.")
            return;
        }

        try {
            let response = await axios.post("http://localhost:4000/api/register", { FirstName, LastName, Email, Password, Age, ContactNumber });
            alert('Registration Succesful.')
            if (response.status == 201) {
                navigate('/')
            }
        } catch (err) {
            alert(err.response?.data.error || "An error occurred");
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                let response = await axios.get("http://localhost:4000/api/validate", {
                    withCredentials: true,
                });
                if (response.status == 201) {
                    navigate("/Profile");
                }
                else {
                    navigate("/Register")
                }
            } catch (error) {
                navigate("/Register");
            }
        };

        checkAuth();
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-base">
            <b className="text-2xl mb-4">Register</b>
            <form
                onSubmit={handleRegister}
                className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg"
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
                        htmlFor="firstname"
                        className="block text-gray-700 font-bold mb-2"
                    >
                        First Name:
                    </label>
                    <input
                        id="firstname"
                        type="text"
                        placeholder="Enter your First Name"
                        value={FirstName}
                        required
                        onChange={(e) => {
                            return setFirstName(e.target.value)
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none hover:ring-2 hover:ring-blue-400"
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="lastname"
                        className="block text-gray-700 font-bold mb-2"
                    >
                        Last Name:
                    </label>
                    <input
                        id="lastname"
                        type="text"
                        placeholder="Enter your Last Name"
                        value={LastName}
                        required
                        onChange={(e) => {
                            return setLastName(e.target.value)
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none hover:ring-2 hover:ring-blue-400"
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="Email"
                        className="block text-gray-700 font-bold mb-2"
                    >
                        Email:
                    </label>
                    <input
                        id="Email"
                        type="Email"
                        placeholder="Enter your IIIT Email"
                        required
                        value={Email}
                        onChange={(e) => {
                            return setEmail(e.target.value)
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none hover:ring-2 hover:ring-blue-400"
                    />
                </div>
                <div className="mb-6">
                    <label
                        htmlFor="Password"
                        className="block text-gray-700 font-bold mb-2"
                    >
                        Password:
                    </label>
                    <input
                        id="Password"
                        type="Password"
                        placeholder="Enter your Password"
                        value={Password}
                        required
                        onChange={(e) => {
                            return setPassword(e.target.value)
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none hover:ring-2 hover:ring-blue-400"
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="Age"
                        className="block text-gray-700 font-bold mb-2"
                    >
                        Age:
                    </label>
                    <input
                        id="Age"
                        type="text"
                        placeholder="Enter your Age"
                        value={Age}
                        required
                        onChange={(e) => {
                            return setAge(e.target.value)
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none hover:ring-2 hover:ring-blue-400"
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="ContactNumber"
                        className="block text-gray-700 font-bold mb-2"
                    >
                        Contact Number:
                    </label>
                    <input
                        id="ContactNumber"
                        type="text"
                        placeholder="Enter your Contact Number"
                        value={ContactNumber}
                        required
                        onChange={(e) => {
                            return setContactNumber(e.target.value)
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none hover:ring-2 hover:ring-blue-400"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                >
                    Register
                </button>

                <h2 className="mt-9" > Already have an account?<Link to='/' className="text-blue-500">  Login </Link></h2>
            </form>
        </div>
    );
}

export default Signup;
