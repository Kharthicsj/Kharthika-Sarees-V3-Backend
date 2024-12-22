import cartModel from "../../models/CartModel.js";
import productModel from "../../models/ProductModel.js";

async function getCartItems(req, res) {
  try {
    const user = req.userId;

    if (!user) {
      return res.status(401).json({
        message: "Kindly login to view your cart",
        error: true,
        success: false,
      });
    }

    const cartItems = await cartModel.find({ userId: user });

    if (cartItems.length === 0) {
      return res.status(200).json({
        message: "Your cart is empty",
        error: false,
        success: true,
        data: [],
      });
    }

    const productIds = cartItems.map(item => item.productId);
    const products = await productModel.find({ _id: { $in: productIds } });

    const cartWithProducts = cartItems.map(item => {
      const product = products.find(p => p._id.toString() === item.productId);
      return {
        ...item._doc, 
        productName: product.productName,
        price: product.price,
        selling: product.selling,
        productImage: product.productImage[0], 
        description: product.description,
        total_quantity: product.quantity,
        quantity_present: item.quantity_present,
        category: product.category,
        fabric: product.fabric,
      };
    });

    return res.status(200).json({
      error: false,
      success: true,
      message: "Cart items fetched successfully",
      data: cartWithProducts,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      success: false,
      message: "Error while fetching cart items",
    });
  }
}

export default getCartItems;
