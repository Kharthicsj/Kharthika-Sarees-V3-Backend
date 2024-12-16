import orderModel from "../../models/OrderModel.js";
import productModel from "../../models/ProductModel.js";

async function newOrder(req, res) {
  try {
    const userId = req.userId;
    const { products, totalPrice, address, transactionId } = req.body;

    // Check if all required fields are present
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid products data. Ensure products are provided.",
      });
    }
    if (!totalPrice || !address || !transactionId) {
      return res.status(400).json({
        success: false,
        message: "Missing totalPrice, address, or transactionId.",
      });
    }

    // Validate and process the products array
    const validProducts = products.map((product) => ({
      ...product,
      quantity: product.quantity || 0, // Ensure quantity is present
    }));

    // Reduce the quantity in the product model
    for (const product of validProducts) {
      const productId = product._id || product.productId;
      const orderQuantity = product.quantity;

      // Find and update the product's quantity in the database
      const existingProduct = await productModel.findById(productId);

      if (!existingProduct) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${productId} not found.`,
        });
      }

      if (existingProduct.quantity < orderQuantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${existingProduct.productName}.`,
        });
      }

      // Reduce the quantity
      existingProduct.quantity -= orderQuantity;
      await existingProduct.save();
    }

    // Create a new order after successfully updating product quantities
    const newOrder = new orderModel({
      userId,
      product: validProducts,
      total: totalPrice,
      address,
      transactionId,
      orderStatus: "Pending",
    });

    await newOrder.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });

  } catch (err) {
    console.error("Error in newOrder:", err.message);
    return res.status(400).json({
      error: true,
      success: false,
      message: err.message || "Error while creating a new order",
    });
  }
}

export default newOrder;
