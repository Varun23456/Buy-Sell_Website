import mongoose from "mongoose";
const url = "mongodb+srv://Varun:Varun%40123@cluster0.0gejx.mongodb.net"
const dbname = "assignment-1"

const connectDB = async function() {
    try {
        await mongoose.connect(`${url}/${dbname}`)
        console.log("\n MongoDB connected");
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB