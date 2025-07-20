import mongoose from "mongoose";
import bcrypt from "bcrypt"

const UserSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)*iiit\.ac\.in$/.test(value);
            },
            message: "Only IIIT mails are allowed."
        }
    },
    Age: {
        type: Number,
        required: true
    },
    ContactNumber: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    CartItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item"
        }
    ],
    SellerReviews: [{
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true
        }
    }]
},
{
    timestamps: true
})

UserSchema.pre("save", async function (next) {
    if(!this.isModified("Password")) 
    {
        return next();
    }
    this.Password = await bcrypt.hash(this.Password, 10)
    next()
})

UserSchema.methods.CheckPassword = async function(Password) {
    return await bcrypt.compare(Password, this.Password)
}


let User;
export default User = mongoose.model("User",UserSchema)