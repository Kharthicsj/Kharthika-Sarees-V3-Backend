import WishlistModel from "../../models/WishlistModel.js";

async function removeWishListProduct(req, res) {
    try {
        const { productId } = req.body;
        const user = req.userId;

        if (!user) {
            return res.status(401).json({
                message: "Please log in to remove products from your cart",
                error: true,
            });
        }

        if (!productId) {
            return res.status(400).json({
                error: true,
                message: "Product ID is missing",
            });
        }

        const wishlistItem = await WishlistModel.findOneAndDelete({ productId, userId: user });
        if (!wishlistItem) {
            return res.status(404).json({
                error: true,
                message: "Product not found in your cart",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product removed from your wishlist",
        });

    } catch (err) {
        return res.status(400).json({
            message: err,
            error: true,
            success: false
        })
    }
}

export default removeWishListProduct