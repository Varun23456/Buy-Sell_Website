import jwt from "jsonwebtoken"
import User from "../models/User.models.js";
const secretkey = "uhbiuyg899876%W#@*jhbuhg76blkoiho8ygf6r5"


const VerifyJwt = async (req,res,next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized request 1' });
        }

        const decodedToken = jwt.verify(token, secretkey )
        if(!decodedToken) {
            return res.status(401).json({ error: 'Unauthorized request 2' });
        }
        
        const user = await User.findById(decodedToken.userId)
        if (!user) {
            return res.status(401).json({ error: 'Invalid Access Token' });
        }
        
        req.user = user;
        res.status(201).json({user: user})
        next(); 
    } catch (error) {
        throw error
    }
}

export default VerifyJwt