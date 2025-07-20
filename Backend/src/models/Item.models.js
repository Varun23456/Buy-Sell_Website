import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true,
        default: 0
    },
    Description: {
        type: String
    },
    Category: {
        type: String,
        enum: ["Clothing", "Grocery", "Electronics", "Accessories", "Home&Kitchen", "Sports&Outdoors", "Stationery", "Furniture", "PersonalCare", "Toys&Games"],
        required: true
    },
    SellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
{
    timestamps: true
})

let Item;
export default Item = mongoose.model("Item",ItemSchema)