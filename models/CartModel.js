import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    productId : String,
    quantity_present : Number,
    userId : String
},{
    timestamps : true
})

const cartModel = new mongoose.model("cart", cartSchema)

export default cartModel