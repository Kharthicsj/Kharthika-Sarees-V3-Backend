import cancelOrderModel from "../../models/CancelOrderModel.js";
import orderModel from "../../models/OrderModel.js";
import userModel from "../../models/User.js";
import nodemailer from "nodemailer";

async function cancelOrderController(req, res) {
    try {        
        const userId = req.userId;
        const { reason, why, howCanWeImprove, confirmCancel, orderId } = req.body;

        // Validation
        if (!reason || !why || !howCanWeImprove || confirmCancel !== "confirm cancel") {
            return res.status(400).json({
                error: true,
                success: false,
                message: "All fields are required, and 'confirm cancel' must be confirmed.",
            });
        }

        // Fetch the user details from the database
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "User not found.",
            });
        }

        const userEmail = user.email;

        // Fetch the order details including the address
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Order not found.",
            });
        }

        const { address } = order;  // Address details from the order

        // Save the cancellation reason in the database
        const cancelOrder = new cancelOrderModel({
            userId,
            reason,
            why,
            howCanWeImprove,
            confirmCancel,
            orderId,
        });

        await cancelOrder.save();

        // Nodemailer configuration
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER, // Your email
                pass: process.env.APP_PASSWORD, // Your email password
            },
        });

        // Email content for the user
        const userMailOptions = {
            from: process.env.GMAIL_USER,
            to: userEmail,
            subject: "Order Cancellation Confirmation",
            html: `
                <h2>Order Cancellation Confirmation</h2>
                <p>Dear ${user.name},</p>
                <p>We have received your request to cancel your order. Below are the details of your cancellation:</p>
                <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; margin-top: 20px;">
                    <tr><td><strong>Order ID:</strong></td><td>${orderId}</td></tr>
                    <tr><td><strong>Cancellation Reason:</strong></td><td>${reason}</td></tr>
                    <tr><td><strong>Why did you decide to cancel?</strong></td><td>${why}</td></tr>
                    <tr><td><strong>How can we improve our service?</strong></td><td>${howCanWeImprove}</td></tr>
                    <tr><td><strong>Delivery Address:</strong></td><td>${address.fullname}, ${address.addressContent}, ${address.landmark}, ${address.pincode}, Phone: ${address.phone}</td></tr>
                </table>
                <p>We appreciate your feedback and hope to serve you better in the future.</p>
                <p>If you have any further questions, please don't hesitate to reach out to us.</p>
                <p>Best regards,</p>
                <p>Kharthika Sarees Team</p>
            `,
        };

        // Email content for the admin
        const adminMailOptions = {
            from: process.env.GMAIL_USER,
            to: "kharthikasarees@gmail.com",
            subject: "New Order Cancellation Notification",
            html: `
                <h2>Order Cancellation Notification</h2>
                <p>Dear Admin,</p>
                <p>A user has canceled their order. Below are the details:</p>
                <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; margin-top: 20px;">
                    <tr><td><strong>User Name:</strong></td><td>${user.name}</td></tr>
                    <tr><td><strong>User Email:</strong></td><td>${userEmail}</td></tr>
                    <tr><td><strong>Order ID:</strong></td><td>${orderId}</td></tr>
                    <tr><td><strong>Cancellation Reason:</strong></td><td>${reason}</td></tr>
                    <tr><td><strong>Why did they cancel?</strong></td><td>${why}</td></tr>
                    <tr><td><strong>Suggestions for Improvement:</strong></td><td>${howCanWeImprove}</td></tr>
                    <tr><td><strong>User's Delivery Address:</strong></td><td>${address.fullname}, ${address.addressContent}, ${address.landmark}, ${address.pincode}, Phone: ${address.phone}</td></tr>
                </table>
                <p>Please review the feedback and take necessary actions.</p>
                <p>Best regards,</p>
                <p>System Notification</p>
            `,
        };

        // Send emails to the user and admin
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(adminMailOptions);

        // Send a success response
        return res.status(200).json({
            error: false,
            success: true,
            message: "Order cancellation recorded successfully. Confirmation emails sent.",
        });
    } catch (err) {
        console.error("Error in cancelOrderController:", err);
        return res.status(500).json({
            error: true,
            success: false,
            message: "An error occurred while processing your request.",
        });
    }
}

export default cancelOrderController;
