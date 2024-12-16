import mongoose from "mongoose";

const wishListSchema = new mongoose.Schema({
    productId : String,
    userId : String
},{
    timestamps : true
})

const wishListModel = new mongoose.model("wishlist", wishListSchema)


export default wishListModel