import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    productName: String,
    category: String,
    fabric: String,
    productImage: [],
    description: String,
    price: Number,
    selling: Number,
    quantity : Number,
},{
    timestamps : true
})

const productModel = new mongoose.model("products", ProductSchema)

export default productModel