import mongoose from "mongoose";
import bcrypt from "bcrypt";

const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
    },
    comment: {
        type: String,
    }
}, { _id: false }); 

const OrderSchema = new mongoose.Schema({
    BuyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    SellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    Amount: {
        type: String,
        required: true
    },
    HashedOTP: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        required: true
    },
    ItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },
    Review: {
        type: ReviewSchema, 
        required: false, 
    }

}
    , {
        timestamps: true
    })

OrderSchema.pre("save", async function (next) {
    if (!this.isModified("HashedOTP")) {
        return next();
    }

    this.HashedOTP = await bcrypt.hash(this.HashedOTP, 10)
    next()
})

OrderSchema.methods.CheckOTP = async function (HashedOTP) {
    return await bcrypt.compare(HashedOTP, this.HashedOTP)
}

let Order;
export default Order = mongoose.model("Order", OrderSchema)