import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

function Login() {
    const navigate = useNavigate();
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [captchaToken, setCaptchaToken] = useState("");

    const Login = async (e) => {
        e.preventDefault();
        
        if (!captchaToken) {
            alert("Please complete the CAPTCHA");
            return;
        }

        try {
            let response = await axios.post("http://localhost:4000/api/login", { Email, Password,captchaToken }, {
                withCredentials: true
            });
            if (response.status == 201) {
                navigate('/Profile')
            }
        } catch (error) {
            alert(error.response.data.error || "An error occurred");
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
            <div className="flex flex-col items-center justify-center min-h-screen text-lg">
                <h1 className="text-3xl mb-4"><b>Login</b></h1>
                <form
                    onSubmit={Login}
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
                            htmlFor="Email"
                            className="block text-gray-700 font-bold mb-2"
                        >
                            Email:
                        </label>
                        <input
                            id="Email"
                            type="Email"
                            placeholder="Enter your Email"
                            value={Email}
                            onChange={(e) => {
                                return setEmail(e.target.value)
                            }}
                            autoComplete="given-name"
                            required
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
                            autoComplete="given-name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none hover:ring-2 hover:ring-blue-400"
                        />
                    </div>
                    <div className="mb-4">
                        <ReCAPTCHA
                            sitekey="6LeAecUqAAAAAPAX0z3PkRc2eVyJsdq5DeXYgNQi"
                            onChange={(token) => {
                                return setCaptchaToken(token)
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Login
                    </button>
                </form>
                <div className="text-black bg-white shadow-lg w-full max-w-sm">
                    <h2 className="mb-8" > Don't have an account?  <Link to='/Register' className="text-blue-500">  Register</Link></h2>
                </div>
            </div>
        </>
    )
}

export default Login;