import WishlistModel from "../../models/WishlistModel.js";
import productModel from "../../models/ProductModel.js";

async function getWishListItems(req, res) {
  try {
    const user = req.userId;

    if (!user) {
      return res.status(401).json({
        message: "Kindly login to view your wishlist",
        error: true,
        success: false,
      });
    }

    const wishListItems = await WishlistModel.find({ userId: user });

    if (wishListItems.length === 0) {
      return res.status(200).json({
        message: "Your wishlist is empty",
        error: false,
        success: true,
        data: [],
      });
    }

    const productIds = wishListItems.map(item => item.productId);
    const products = await productModel.find({ _id: { $in: productIds } });

    const wishListWithProducts = wishListItems.map(item => {
      const product = products.find(p => p._id.toString() === item.productId);
      return {
        ...item._doc,
        productName: product.productName,
        price: product.price,
        selling: product.selling,
        productImage: product.productImage[0], 
        description: product.description,
        total_quantity: product.quantity,
        fabric : product.fabric,
        category : product.category,
        quantity_present: item.quantity_present
      };
    });

    return res.status(200).json({
      error: false,
      success: true,
      message: "Wishlist items fetched successfully",
      data: wishListWithProducts,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      success: false,
      message: "Error while fetching wishlist items",
    });
  }
}

export default getWishListItems;
