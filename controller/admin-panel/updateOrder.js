import orderModel from "../../models/OrderModel.js";

async function updateOrder(req, res) {
    try {
        const { orderId, orderStatus } = req.body;

        const validStatuses = ["Pending", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid order status."
            });
        }

        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Order not found."
            });
        }

        order.orderStatus = orderStatus;
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully.",
            data: order
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            success: false,
            message: err.message || "An error occurred while updating the order."
        });
    }
}

export default updateOrder;
