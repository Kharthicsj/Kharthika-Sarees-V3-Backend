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


const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
  profilepic: String,
  role: String,
  phone: String,
  address: [addressSchema]
}, {
  timestamps: true
});

const userModel = new mongoose.model("user", userSchema);

export default userModel