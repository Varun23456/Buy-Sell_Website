import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Logout() {
    const navigate = useNavigate()
    useEffect(() => {
        const checkAuth = async () => {
            try {
                let response = await axios.post("http://localhost:4000/api/logout",{message: "Clear Cookie"}, {
                    withCredentials: true,
                });

                if (response.status == 201) {
                    navigate("/Logout");
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
            <div className="text-center justify-center text-3xl min-h-screen mt-20">Logged Out Successfully.<br/>
                <button
                    type="button"
                    className="mt-10 bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                    onClick={() => {
                        navigate('/');
                    }}
                >
                    Login
                </button>
            </div>
        </>
    )
}

export default Logout;