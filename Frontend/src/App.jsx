import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Signup from './Components/Signup/Signup.jsx'
import Login from './Components/Login/Login.jsx'
import Profile from './Components/Profile/Profile.jsx'
import History from './Components/History/History.jsx'
import SearchItems from './Components/SearchItems/SearchItems.jsx'
import DeliverItems from './Components/DeliverItems/DeliverItems.jsx'
import MyCart from './Components/MyCart/MyCart.jsx'
import Logout from './Components/Logout/Logout.jsx'
import Itempage from './Components/Itempage/Itempage.jsx'
import axios from 'axios'
import CartContextProvider from './Context/CartContextProvider.jsx'
import PendingOrders from './Components/PendingOrders/PendingOrders.jsx'
import BoughtItems from './Components/BoughtItems/BoughtItems.jsx'
import SoldItems from './Components/SoldItems/SoldItems.jsx'
import SellPage from './Components/SellPage/SellPage.jsx'
import ChatBot from './Components/ChatBot/ChatBot.jsx'


function App() {
  const SearchBar = ""
  const checkboxes = {
    "Clothing": false, "Grocery": false, "Electronics": false, "Accessories": false, "Home&Kitchen": false, "Sports&Outdoors": false,
    "Stationery": false, "Furniture": false, "PersonalCare": false, "Toys&Games": false
  }
  const [items, setItems] = useState([])

  function set(items) {
    setItems(items);
  }

  useEffect(() => {
    const getItems = async () => {
      try {
        let response = await axios.post("/api/getitems", { checkboxes, SearchBar }, {
          withCredentials: true,
        });

        set(response.data.items);
      } catch (error) {
        throw error;
      }
    };

    getItems();
  }, [])

  return (
    <BrowserRouter>
      <CartContextProvider>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/Register" element={<Signup />}></Route>
          <Route path="/Profile" element={<Profile />}></Route>
          <Route path='/History' element={<History />}></Route>
          <Route path='/SearchItems' element={<SearchItems />}></Route>
          <Route path='/DeliverItems' element={<DeliverItems />}></Route>
          <Route path='/MyCart' element={<MyCart />}></Route>
          <Route path='/Logout' element={<Logout />}></Route>
          {/* <Route path='/PendingOrders' element={<PendingOrders/>}></Route>
          <Route path='/BoughtItems' element={<BoughtItems/>}></Route>
          <Route path='/SoldItems' element={<SoldItems/>}></Route> */}
          <Route path='/SellPage' element={<SellPage/>}></Route>
          <Route path='/ChatBot' element={<ChatBot/>}></Route>
          {items.map((item) => (
            <Route
              key={item._id}
              path={`/Item/${item._id}`}
              element={<Itempage item={item} />}
            />
          ))}

        </Routes>
      </CartContextProvider>
    </BrowserRouter>
  )
}

export default App
