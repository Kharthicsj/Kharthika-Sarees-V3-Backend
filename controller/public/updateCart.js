import cartModel from "../../models/CartModel.js";

async function updateCart(req, res) {
  try {
    const { productId, quantity_present } = req.body;
    const userId = req.userId;  // Assuming the userId is set in the request (e.g., via middleware)

    // Find the cart item for the specific user
    const cartItem = await cartModel.findOne({ productId, userId });

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found for the current user.",
        error: true,
        success: false,
      });
    }

    // Update the quantity for the cart item
    cartItem.quantity_present = quantity_present;

    // Save the updated cart item
    await cartItem.save();

    return res.status(200).json({
      message: "Cart updated successfully.",
      success: true,
      data: cartItem,
    });
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(400).json({
      message: err?.message || err,
      error: true,
      success: false,
    });
  }
}

export default updateCart;
