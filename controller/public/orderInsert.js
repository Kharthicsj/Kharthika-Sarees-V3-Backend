import nodemailer from "nodemailer";
import orderModel from "../../models/OrderModel.js";
import productModel from "../../models/ProductModel.js";
import userModel from "../../models/User.js";

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

		// Fetch user's email
		const user = await userModel.findById(userId);
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found.",
			});
		}
		const userEmail = user.email;

		// Validate and process the products array
		const validProducts = products.map((product) => ({
			...product,
			quantity: product.quantity || 0, // Ensure quantity is present
		}));

		// Reduce the quantity in the product model
		for (const product of validProducts) {
			const productId = product._id || product.productId;
			const orderQuantity = product.quantity;

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

			existingProduct.quantity -= orderQuantity;
			await existingProduct.save();
		}

		// Create a new order
		const newOrder = new orderModel({
			userId,
			product: validProducts,
			total: totalPrice,
			address,
			transactionId,
			orderStatus: "Pending",
		});

		await newOrder.save();

		// Set up Nodemailer transporter
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.APP_PASSWORD,
			},
		});

		// Prepare email content
		const productDetailsHTML = validProducts
			.map(
				(prod) =>
					`<li><strong>Product:</strong> ${prod.name || prod.productName} <br/><strong>Quantity:</strong> ${prod.quantity}</li>`
			)
			.join("");

		// Format the address object into a string
		const formattedAddress = `
				<p><strong>Full Name:</strong> ${address.fullname}</p>
				<p><strong>Address:</strong> ${address.addressContent}</p>
				<p><strong>Landmark:</strong> ${address.landmark || "N/A"}</p>
				<p><strong>City/State:</strong> ${address.state}</p>
				<p><strong>Pincode:</strong> ${address.pincode}</p>
				<p><strong>Phone:</strong> ${address.phone}</p>
				<p><strong>Email:</strong> ${address.email}</p>
			`;


		const mailOptionsUser = {
			from: process.env.GMAIL_USER,
			to: userEmail,
			subject: "Order Confirmation - Kharthika Sarees",
			text: `Dear ${user.name},\n\nThank you for your order. Here are the details:\n\n${productDetailsHTML}\n\nTotal Price: ₹${totalPrice}\nAddress: ${address}\nTransaction ID: ${transactionId}\n\nYour order is currently being processed.\n\nThank you for shopping with us!\n\nBest Regards,\nKharthika Sarees Team`,
			html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-bottom: 2px solid #e2e3e5;">
            <h1 style="color: #ff6347;">Kharthika Sarees</h1>
            <p style="font-size: 16px; margin: 0;">Thank you for shopping with us!</p>
          </div>
          <div style="padding: 20px;">
            <p>Dear <strong>${user.name}</strong>,</p>
            <p>We are excited to let you know that your order has been received and is currently being processed. Below are your order details:</p>
            <ul style="list-style-type: none; padding: 0;">
              ${productDetailsHTML}
            </ul>
            <p><strong>Total Price:</strong> ₹${totalPrice}</p>
            <p><strong>Delivery Address:</strong> ${formattedAddress}</p>
            <p><strong>Transaction ID:</strong> ${transactionId}</p>
            <hr/>
            <p>We will notify you once your order is shipped.</p>
            <p style="margin-top: 20px;">Best Regards,<br/><strong>Kharthika Sarees Team</strong></p>
          </div>
          <div style="text-align: center; padding: 10px; background-color: #f8f9fa; border-top: 2px solid #e2e3e5;">
            <p style="font-size: 14px; color: #6c757d;">&copy; 2024 Kharthika Sarees. All Rights Reserved.</p>
          </div>
        </div>
        `,
		};

		const mailOptionsAdmin = {
			from: process.env.GMAIL_USER,
			to: process.env.GMAIL_USER,
			subject: "New Order Received - Kharthika Sarees",
			text: `New order received from ${user.name} (${userEmail}):\n\n${productDetailsHTML}\n\nTotal Price: ₹${totalPrice}\nAddress: ${address}\nTransaction ID: ${transactionId}\n\nCheck the admin panel for more details.`,
			html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-bottom: 2px solid #e2e3e5;">
          <h1 style="color: #ff6347;">Kharthika Sarees</h1>
          <p style="font-size: 16px; margin: 0;">New Order Notification</p>
        </div>
        <div style="padding: 20px;">
          <p><strong>Customer Name:</strong> ${user.name}</p>
          <p><strong>Email:</strong> ${userEmail}</p>
          <p><strong>Order Details:</strong></p>
          <ul style="list-style-type: none; padding: 0;">
            ${productDetailsHTML}
          </ul>
          <p><strong>Total Price:</strong> ₹${totalPrice}</p>
          <p><strong>Delivery Address:</strong> ${formattedAddress}</p>
          <p><strong>Transaction ID:</strong> ${transactionId}</p>
          <hr/>
          <p style="margin-top: 20px;">Log in to the admin panel to view more details about this order.</p>
          <p style="margin-top: 20px;">Best Regards,<br/><strong>Kharthika Sarees Team</strong></p>
        </div>
        <div style="text-align: center; padding: 10px; background-color: #f8f9fa; border-top: 2px solid #e2e3e5;">
          <p style="font-size: 14px; color: #6c757d;">&copy; 2024 Kharthika Sarees. All Rights Reserved.</p>
        </div>
      </div>
      `,
		};

		await transporter.sendMail(mailOptionsUser);
		await transporter.sendMail(mailOptionsAdmin);

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
