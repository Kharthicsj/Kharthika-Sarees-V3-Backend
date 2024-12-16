import wishListModel from "../../models/WishlistModel.js";

async function addToWishList(req, res) {
    try{
        const {productId} = req.body
        const userId = req.userId

        if(!userId) {
            return res.status(401).json({
                error : true,
                success : false,
                message : "Kindly login"
            })
        }

        const isProductAvailable = await wishListModel.findOne({ productId, userId: userId });
        if(isProductAvailable){
            return res.status(201).json({
                error : false,
                success : true,
                message : "Product already wishlisted!"
            })
        }

        const payLoad = {
            productId,
            userId
        };

        const newWishlistItem = new wishListModel(payLoad);
        const savedProduct = newWishlistItem.save();

        return res.status(201).json({
            success : true,
            error : false,
            data : savedProduct,
            message : "Successfuly added product to wishlist"
        })

    }catch(err) {
        console.log(err)
        return res.status(400).json({
            message : err,
            error : true,
            success : false
        })
    }
}

export default addToWishList