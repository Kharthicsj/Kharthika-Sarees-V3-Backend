import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    name : String,
    banner : String,
    active : Boolean,
    screen : String,
},{
    timestamps : true
})

const BannerModel = new mongoose.model("BannerImages", bannerSchema);

export default BannerModel