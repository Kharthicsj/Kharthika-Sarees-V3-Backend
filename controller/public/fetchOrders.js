import orderModel from "../../models/OrderModel.js";

async function fetchOrder(req, res) {
    try {
        const userId = req.userId;

        const orders = await orderModel.find({ userId: userId });

        if (orders.length === 0) {
            return res.status(200).json({
                message: "Oops! No order found",
                error: false,
                success: true,
                data: [],
            });
        }

        return res.status(200).json({
            message: "Orders fetched successfully",
            error: false,
            success: true,
            data: orders,
        });

    } catch (err) {
        console.log(err)
        return res.status(400).json({
            error: true,
            success: false,
            message: err.message,
        });
    }
}

export default fetchOrder;
