import React from "react";
import NavBar from "../NavBar/NavBar";
import { useState, useEffect} from "react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import PendingOrders from "../PendingOrders/PendingOrders";
import BoughtItems from "../BoughtItems/BoughtItems";
import SoldItems from "../SoldItems/SoldItems";

function History() {
    const navigate = useNavigate()
    const [currpage, setCurrpage] = useState('PendingOrders')

    useEffect(() => {
        const checkAuth = async () => {
            try {
                let response = await axios.get("http://localhost:4000/api/validate", {
                    withCredentials: true,
                });
                if (response.status == 201) {
                    let UserInfo = response.data.user
                    navigate("/History");
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

            <div className="flex flex-col items-center justify-between space-y-10 m-10">
                <div className="text-3xl text-center "><b>Click on the Buttons to Visit</b></div>
                <div className="flex">
                    <button
                        className="mx-10 w-1/4 bg-orange-600 text-white font-bold py-3 px-6 rounded-lg  hover:bg-orange-700"
                        onClick={() => {
                            // return navigate('/PendingOrders')
                            return setCurrpage('PendingOrders')
                        }}
                    >
                        Pending Orders
                    </button>
                    <button
                        className="mx-10 w-1/4 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700"
                        onClick={() => {
                            // return navigate('/BoughtItems')
                            return setCurrpage('BoughtItems')
                        }}
                    >
                        Bought Items
                    </button>
                    <button
                        className="mx-10 w-1/4 bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 "
                        onClick={() => {
                            // return navigate('/SoldItems')
                            return setCurrpage('SoldItems')
                        }}
                    >
                        Sold Items
                    </button>
                </div>

                <div>
                    {currpage === 'PendingOrders' && <PendingOrders />}
                    {currpage === 'BoughtItems' && <BoughtItems />}
                    {currpage === 'SoldItems' && <SoldItems />}
                </div>
            </div>

        </>
    )
}

export default History;