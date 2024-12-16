import cartModel from "../../models/CartModel.js";

async function removeFromCart(req, res) {
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

    const cartItem = await cartModel.findOneAndDelete({ productId, userId: user });

    if (!cartItem) {
      return res.status(404).json({
        error: true,
        message: "Product not found in your cart",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from your cart",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: "Error removing product from cart",
    });
  }
}

export default removeFromCart;
