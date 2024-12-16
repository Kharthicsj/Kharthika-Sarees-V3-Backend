import orderModel from "../../models/OrderModel.js";

async function fetchAllOrders(req, res) {
  try {
    const orders = await orderModel.find();

    const orderCount = await orderModel.countDocuments();

    return res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
      count: orderCount,
    });
  } catch (err) {
    return res.status(400).json({
      error: true,
      success: false,
      message: err.message || 'An error occurred while fetching orders',
    });
  }
}

export default fetchAllOrders;
