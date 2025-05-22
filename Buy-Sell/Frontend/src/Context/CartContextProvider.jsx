import { useState } from "react";
import UserContext from "./CartContext";

const CartContextProvider = ({ children }) => {
    const [Mycart, setMycart] = useState([])

    return (
        <UserContext.Provider value={{ Mycart, setMycart }}>
            {children}
        </UserContext.Provider>
    )
}

export default CartContextProvider