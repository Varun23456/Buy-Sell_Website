import express from "express"
import cors from "cors"
import connectDB from "./src/db/ConnectDB.js"
import User from "./src/models/User.models.js"
import Item from "./src/models/Item.models.js"
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"
import bcrypt from "bcrypt"
import VerifyJwt from "./src/Middleware/auth.middleware.js"
import Order from "./src/models/Order.models.js"
import axios from "axios"
import { GoogleGenerativeAI } from "@google/generative-ai"

const secretkey = "uhbiuyg899876%W#@*jhbuhg76blkoiho8ygf6r5"

connectDB()
const app = express()

const GEMINI_API_KEY = "AIzaSyBRtucveBlj7s8XuWfd2x_mfmcmqq8VajM"
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


const OTPgen = () => {
    let pass = ""
    let str = "0123456789"
    for (let i = 1; i <= 6; i++) {
        let char = str[Math.floor(Math.random() * str.length)]
        pass += char
    }
    return pass;
}

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.post("/api/register", async function (req, res) {
    try {
        const { FirstName, LastName, Email, Age, ContactNumber, Password, CartItems, SellerReviews } = req.body
        const existedUser = await User.findOne({ Email })
        if (existedUser) {
            return res.status(400).json({ error: 'Email already registered.' });
        }

        const user = await User.create({
            FirstName,
            LastName,
            Email,
            Age,
            ContactNumber,
            Password,
            CartItems,
            SellerReviews,
        })

        const createdUser = await User.findById(user._id)

        if (!createdUser) {
            return res.status(500).json({ error: "Something went wrong while registering the user" });
        }

        return res.status(201).json({
            message: "User Registered Succesfully"
        })
    }
    catch (error) {
        throw error;
    }
})


app.post("/api/login", async function (req, res) {
    try {
        const { Email, Password, captchaToken } = req.body
  
        if (!Email || !Password) {
            return res.status(400).json({ error: 'Please Enter Your Credentials.' });
        }

        const user = await User.findOne({ Email: Email })

        if (!user) {
            return res.status(400).json({ error: 'User does not exist.' });
        }

        const check = await user.CheckPassword(Password)

        if (!check) {
            return res.status(400).json({ error: 'Invalid Credentials.' });
        }

        if (!captchaToken) {
            return res.status(400).json({ success: false, message: "CAPTCHA token is missing" });
        }

        try {
            const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
                params: {
                    secret: "6LeAecUqAAAAAN68P0f2CwK75ikhrmGIB8uOWn5t",
                    response: captchaToken,
                },
            });

            if (!response.data.success) {
                return res.status(400).json({ success: false, message: "CAPTCHA verification failed" });
            }

        } catch (error) {
            console.error("Error verifying CAPTCHA:", error);
            res.status(500).json({ success: false, message: "Server error" });
        }

        const token = jwt.sign({ userId: user._id }, secretkey, { expiresIn: '19d' });

        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 19 * 24 * 60 * 60 * 1000 });

        return res.status(201).json({ message: 'Login successful', token });
    }
    catch (error) {
        throw error;
    }
})

app.post("/api/logout", async function (req, res) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }
        const decodedToken = jwt.verify(token, secretkey)
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }

        const user = await User.findById(decodedToken.userId)
        if (!user) {
            return res.status(401).json({ error: 'Invalid Access Token' });
        }   

        res.clearCookie('token', {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 0,
            domain: "localhost"
        });

        res.status(201).json({ message: 'Logged out successful' });
    }
    catch (error) {
        throw error;
    }
})


app.get("/api/validate", VerifyJwt)

app.post("/api/updatedetails", async function (req, res) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }
        const decodedToken = jwt.verify(token, secretkey)
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }

        const user = await User.findById(decodedToken.userId)
        const { UserInfo, oldpassword, newpassword } = req.body

        if (oldpassword == "") {
            if (newpassword == "") {
                const updatedUser = await User.findByIdAndUpdate(
                    decodedToken.userId,
                    { $set: UserInfo },
                    { new: true }
                );
                if (!updatedUser) {
                    return res.status(401).json({ error: 'Invalid Access Token' });
                }

                req.user = updatedUser;
                res.status(201).json({ user: updatedUser })
            }
            else {
                return res.status(401).json({ error: 'Please Enter old password to reset.' });
            }
        }
        else {
            const check = await user.CheckPassword(oldpassword)
            if (!check) {
                return res.status(401).json({ error: 'Incorrect Old password' });
            }

            if (newpassword == "") {
                return res.status(401).json({ error: 'New password cannot be empty' });
            }

            UserInfo.Password = await bcrypt.hash(newpassword, 10);
            const updatedUser = await User.findByIdAndUpdate(
                decodedToken.userId,
                { $set: UserInfo },
                { new: true }
            );
            if (!updatedUser) {
                return res.status(401).json({ error: 'Invalid Access Token' });
            }

            req.user = updatedUser;
            res.status(201).json({ user: updatedUser })
        }
    } catch (error) {
        throw error
    }
})

app.post("/api/getuserbuyers", async function (req, res) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }
        const decodedToken = jwt.verify(token, secretkey)
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }

        const user = await User.findById(decodedToken.userId)
        if (!user) {
            return res.status(401).json({ error: 'Invalid Access Token' });
        }

        const buyers = []
        for (const review of user.SellerReviews) {
            const buyer = await User.findById(review.reviewer)
            if (!buyer) {
                return res.status(400).json({ error: 'No Buyers Found' });
            }
            buyers.push({FirstName: buyer.FirstName,LastName: buyer.LastName, rating: review.rating, comment: review.comment})
        }
        if (!buyers) {
            return res.status(400).json({ error: 'No Buyers Found' });
        }

        res.status(201).json({ buyers })

    } catch (error) {
        throw error
    }
})

app.post("/api/getitems", async function (req, res) {
    try {

        const { checkboxes, SearchBar } = req.body
        let check = true
        let filters = []

        Object.keys(checkboxes).forEach(key => {
            if (checkboxes[key] == true) {
                check = false
                filters.push(key)
            }
        });

        if (SearchBar === '' && check) {
            const items = await Item.find({})
            if (!items) {
                return res.status(400).json({ error: 'No Items Found' })
            }

            return res.status(201).json({ items })
        }

        if (SearchBar === '' && !check) {
            const items = await Item.find({ Category: { $in: filters } })
            if (!items) {
                return res.status(400).json({ error: 'No Items Found' })
            }
            return res.status(201).json({ items })
        }

        const items = await Item.find({ $or: [{ Name: { $regex: SearchBar, $options: 'i' } }, { Category: { $in: filters } }] })
        if (!items) {
            return res.status(400).json({ error: 'No Items Found' })
        }


        return res.status(201).json({ items })

    } catch (error) {
        throw error
    }
})

app.post("/api/getseller", async function (req, res) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }
        const decodedToken = jwt.verify(token, secretkey)
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }

        const { item } = req.body
        const Seller = await User.findById(`${item.SellerId}`)
        if (!Seller) {
            return res.status(401).json({ error: 'Invalid Access Token' });
        }

        res.status(201).json({ Seller })

    } catch (error) {
        throw error
    }
})

app.post("/api/checkitem", async function (req, res) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }
        const decodedToken = jwt.verify(token, secretkey)
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }

        const { item } = req.body
        const Buyer = await User.findById(decodedToken.userId)
        if (Buyer.CartItems.includes(item._id)) {
            return res.status(201).json({ status: true });
        }

        return res.status(201).json({ status: false });

    } catch (error) {
        throw error
    }
})

app.post("/api/addtocart", async function (req, res) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }
        const decodedToken = jwt.verify(token, secretkey)
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }

        const { item } = req.body
        if (item.SellerId == decodedToken.userId) {
            return res.status(400).json({ error: "You cannot add your own item to your cart." });
        }

        const Buyer = await User.findByIdAndUpdate(
            decodedToken.userId,
            { $push: { CartItems: item._id } },
            { new: true }
        )

        if (!Buyer) {
            return res.status(401).json({ error: 'Invalid Access Token' });
        }

        res.status(201).json({ message: "Added to Cart Sucessfully." })

    } catch (error) {
        throw error
    }
})

app.post("/api/getMycartItems", async function (req, res) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }

        const decodedToken = jwt.verify(token, secretkey)
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }

        let items = []
        let Buyer = await User.findById(decodedToken.userId)
        for (const cartitemid of Buyer.CartItems) {
            try {
                let item = await Item.findById(cartitemid);
                if (!item) {
                    return res.status(404).json({ error: "Item not found" });
                }
                items.push(item);
            } catch (error) {
                throw error;
            }
        }

        if (!Buyer) {
            return res.status(401).json({ error: 'Invalid Access Token' });
        }

        res.status(201).json({ items })

    } catch (error) {
        throw error
    }
})

app.post("/api/removefromcart", async function (req, res) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }

        const decodedToken = jwt.verify(token, secretkey)
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }

        const { myitem } = req.body

        const Buyer = await User.findByIdAndUpdate(
            decodedToken.userId,
            { $pull: { CartItems: myitem._id } },
            { new: true }
        )

        if (!Buyer) {
            return res.status(401).json({ error: 'Invalid Access Token' });
        }

        res.status(201).json({ message: "Item Removed Succesfully." })

    } catch (error) {
        throw error
    }
})

app.post("/api/additem", async function (req, res) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }

        const decodedToken = jwt.verify(token, secretkey)
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }

        const user = await User.findById(decodedToken.userId)
        const SellerId = user._id
        const { Name, Price, Description, Category } = req.body

        const newitem = await Item.create(
            {
                Name,
                Price,
                Description,
                Category,
                SellerId
            }
        )

        if (!newitem) {
            return res.status(401).json({ error: 'Invalid Access Token' });
        }

        res.status(201).json({ message: "Item Added Succesfully." })

    } catch (error) {
        throw error
    }
})

app.post('/api/placeorder', async function (req, res) {
    try {
        const { Mycart } = req.body
        const OTP = OTPgen();
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }

        const decodedToken = jwt.verify(token, secretkey)
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }

        const user = await User.findById(decodedToken.userId)
        const BuyerId = user._id
        const HashedOTP = OTP
        const len = Mycart.length

        for (let i = 0; i < len; i++) {
            const SellerId = Mycart[i].SellerId
            const Amount = Mycart[i].Price
            const Status = "Pending"
            const ItemId = Mycart[i]._id
            const Review = { rating: 0, comment: "" }
            const newOrder = await Order.create(
                {
                    BuyerId,
                    SellerId,
                    Amount,
                    HashedOTP,
                    Status,
                    ItemId,
                    Review
                }
            )

            if (!newOrder) {
                return res.status(401).json({ error: 'Invalid Access Token' });
            }
        }

        res.status(201).json({ OTP: OTP })

    } catch (error) {
        throw error
    }
})

app.post("/api/clearcartitems", async function (req, res) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }

        const decodedToken = jwt.verify(token, secretkey)
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }

        const user = await User.findById(decodedToken.userId)
        const BuyerId = user._id

        const updatedUser = await User.findByIdAndUpdate(
            BuyerId,
            { CartItems: [] },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(201).json({ message: "Your  Cart has benn cleared.." })

    } catch (error) {
        throw error
    }
})

app.post("/api/getpendingorders", async function (req, res) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }

        const decodedToken = jwt.verify(token, secretkey)
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }

        const user = await User.findById(decodedToken.userId)
        const BuyerId = user._id

        const pendingorders = await Order.find({ BuyerId: BuyerId, $or: [{ Status: "Pending" }, { Status: "Cancelled" }] })
        if (!pendingorders) {
            return res.status(404).json({ error: "An Error Occured." });
        }

        const len = pendingorders.length
        let item_seller = []

        for (let i = 0; i < len; i++) {
            const item = await Item.findById(pendingorders[i].ItemId)
            const seller = await User.findById(pendingorders[i].SellerId)
            if (!item || !seller) {
                return res.status(404).json({ error: "An Error Occured." });
            }
            item_seller.push({ item: item, seller: seller });
        }

        res.status(201).json({ pendingorders, item_seller })

    } catch (error) {
        throw error
    }
})

app.post("/api/regenerateOTP", async function (req, res) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }

        const decodedToken = jwt.verify(token, secretkey)
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }

        const user = await User.findById(decodedToken.userId)
        const { orderId } = req.body
        const order = await Order.findById(orderId)
        const OTP = OTPgen();

        order.HashedOTP = await bcrypt.hash(OTP, 10);
        const updatedotp = await order.save();

        if (!updatedotp) {
            return res.status(401).json({ error: 'Error while regenerating OTP.' });
        }

        res.status(201).json({ OTP: OTP })

    } catch (error) { 
        throw error;
    }


})

app.post("/api/getdeliverorders", async function (req, res) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }

        const decodedToken = jwt.verify(token, secretkey)
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }

        const user = await User.findById(decodedToken.userId)
        const SellerId = user._id

        const deliverorders = await Order.find({ SellerId: SellerId, Status: "Pending" })
        if (!deliverorders) {
            return res.status(404).json({ error: "An Error Occured." });
        }

        const len = deliverorders.length
        let item_buyer = []

        for (let i = 0; i < len; i++) {
            const item = await Item.findById(deliverorders[i].ItemId)
            const buyer = await User.findById(deliverorders[i].BuyerId)
            if (!item || !buyer) {
                return res.status(404).json({ error: "An Error Occured." });
            }

            item_buyer.push({ item: item, buyer: buyer });
        }

        res.status(201).json({ deliverorders, item_buyer })

    } catch (error) {
        throw error
    }
})

app.post("/api/endtransaction", async function (req, res) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }

        const decodedToken = jwt.verify(token, secretkey)
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }

        const { TransactionId, otp } = req.body

        const order = await Order.findById(TransactionId)

        if (!order) {
            return res.status(404).json({ error: "An Error Occured." });
        }

        const otpcheck = order.CheckOTP(otp)

        if (!otpcheck) {
            return res.status(404).json({ error: "Please Enter Correct OTP." });
        }

        order.Status = "Completed";
        const updatedOrder = await order.save();

        if (!updatedOrder) {
            return res.status(404).json({ error: "Error While updating status of order." });
        }

        res.status(201).json({ message: "Transaction Completed Succesfully." })

    } catch (error) {
        throw error
    }
})

app.post("/api/cancelorder", async function (req, res) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }

        const decodedToken = jwt.verify(token, secretkey)
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }

        const { TransactionId } = req.body

        const order = await Order.findById(TransactionId)

        if (!order) {
            return res.status(404).json({ error: "An Error Occured." });
        }

        order.Status = "Cancelled";
        const updatedOrder = await order.save();

        if (!updatedOrder) {
            return res.status(404).json({ error: "Error While updating status of order." });
        }

        res.status(201).json({ message: "Order Cancelled." })

    } catch (error) {
        throw error
    }
})

app.post("/api/getboughtitems", async function (req, res) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }

        const decodedToken = jwt.verify(token, secretkey)
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }

        const user = await User.findById(decodedToken.userId)
        const BuyerId = user._id

        const boughtitems = await Order.find({ BuyerId: BuyerId, Status: "Completed" })
        if (!boughtitems) {
            return res.status(404).json({ error: "An Error Occured." });
        }

        const len = boughtitems.length
        let item_seller = []

        for (let i = 0; i < len; i++) {
            const item = await Item.findById(boughtitems[i].ItemId)
            const seller = await User.findById(boughtitems[i].SellerId)
            if (!item || !seller) {
                return res.status(404).json({ error: "An Error Occured." });
            }
            item_seller.push({ item: item, seller: seller });
        }

        res.status(201).json({ boughtitems, item_seller })

    } catch (error) {
        throw error
    }
})

app.post("/api/updatereview", async function (req, res) {
    try {
        const { TransactionId,SellerId,Review } = req.body
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }
        const decodedToken = jwt.verify(token, secretkey)
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }

        const user = await User.findById(decodedToken.userId)
        const reviewer = user._id
        const rating = Review.rating
        const comment = Review.comment

        const order = await Order.findById(TransactionId)
        order.Review = Review
        const updatedorder = await order.save()

        if (!updatedorder) {
            return res.status(401).json({ error: 'Error while updating order.' });
        }
        
        const newReview2 = await User.findByIdAndUpdate(
            SellerId,
            { $push: { SellerReviews: { reviewer,rating,comment } } },
            { new: true }
        )

        if (!newReview2) {
            return res.status(401).json({ error: 'Invalid Access Token' });
        }

        res.status(201).json({ message: "Review Added Succesfully." })

    } catch (error) {
        throw error
    }
})

app.post("/api/getsolditems", async function (req, res) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }

        const decodedToken = jwt.verify(token, secretkey)
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }

        const user = await User.findById(decodedToken.userId)
        const SellerId = user._id

        const solditems = await Order.find({ SellerId: SellerId, Status: "Completed" })
        if (!solditems) {
            return res.status(404).json({ error: "An Error Occured." });
        }

        const len = solditems.length
        let item_buyer = []

        for (let i = 0; i < len; i++) {
            const item = await Item.findById(solditems[i].ItemId)
            const buyer = await User.findById(solditems[i].BuyerId)
            if (!item || !buyer) {
                return res.status(404).json({ error: "An Error Occured." });
            }

            item_buyer.push({ item: item, buyer: buyer });
        }

        res.status(201).json({ solditems, item_buyer })

    } catch (error) {
        throw error
    }
})

app.post("/api/removefromorders", async function (req, res) {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }

        const decodedToken = jwt.verify(token, secretkey)
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }

        const user = await User.findById(decodedToken.userId)

        const { orderId } = req.body
        const order = await Order.findById(orderId)
        if(!order){ 
            return res.status(404).json({ error: "An Error Occured." });
        }

        const deletedOrder = await Order.findByIdAndDelete(orderId)

        if (!deletedOrder) {
            return res.status(404).json({ error: "An Error Occured." });
        }

        res.status(201).json({ message: "Order Removed Succesfully." })

    } catch (error) {
        throw error
    }
})

app.post("/api/chatbot", async function (req, res) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }

        const decodedToken = jwt.verify(token, secretkey);
        if (!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }

        const user = await User.findById(decodedToken.userId);
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const conversationHistory = history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        conversationHistory.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const chat = model.startChat({
            history: conversationHistory.slice(0, -1) 
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();

        res.json({ reply: response });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Sorry, I couldn't process your request." });
    }
});

app.listen(4000, () => {
    console.log("listening on port 4000")
})


