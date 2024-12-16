import cartModel from "../../models/CartModel.js";

async function addToCart(req, res) {
  try {
    const { productId } = req.body;
    const user = req.userId;

    if (!user) {
      return res.status(401).json({
        message: "Kindly login to add products to your cart",
        error: true,
        success: false
      });
    }

    if (!productId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "User or product ID is missing",
      });
    }

    const isProductAvailable = await cartModel.findOne({ productId, userId: user });

    if (isProductAvailable) {
      return res.status(200).json({
        message: "Product already added to cart",
        error: false,
        success: true,
      });
    }

    const payload = {
      productId,
      quantity_present: 1, 
      userId: user,
    };

    const newCartItem = new cartModel(payload);
    const savedProduct = await newCartItem.save();

    return res.status(201).json({
      error: false,
      success: true,
      message: "Added to cart successfully",
      data: savedProduct,
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      success: false,
      message: "Error while adding product to cart",
    });
  }
}

export default addToCart;
