import WishlistModel from "../../models/WishlistModel.js";

async function countWishlist(req, res) {
    try{
        const userId = req.userId
        
        const count = await WishlistModel.countDocuments({userId : userId});
        return res.status(201).json({
            success : true,
            error : false,
            data : {
                count
            },
            message : "ok"
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            error: true,
            success: false,
            message: "Error while adding product to cart",
          });
    }
}

export default countWishlist