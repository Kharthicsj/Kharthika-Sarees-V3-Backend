import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  fullname: String,
  addressName: String,
  type: String,
  phone: String,
  addressContent: String,
  pincode: String,
  email: String,
  landmark: String,
});

const productSchema = new mongoose.Schema({
    productName: String,
    category: String,
    fabric: String,
    productImage: [],
    description: String,
    price: Number,
    selling: Number,
    quantity : Number,
})

const OrderSchema = new mongoose.Schema({
    userId: String,
    product: [productSchema],
    total: Number,
    address: addressSchema,
    transactionId: { type: String, unique: true },
    orderStatus: String,
},{
    timestamps: true
})

const orderModel = new mongoose.model("Orders", OrderSchema)
export default orderModel