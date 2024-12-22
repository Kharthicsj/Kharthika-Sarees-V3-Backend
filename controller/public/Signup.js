import userModel from "../../models/User.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

async function SignupController(req, res) {
    try {
        const { name, email, password, profilepic } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashPwd = await bcrypt.hash(password, salt);

        const user = await userModel.findOne({ email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists, Kindly Login.",
            });
        }

        if (!hashPwd) {
            res.status(400).json({
                success: false,
                message: "Some Error Occurred While Processing",
            });
        }

        const payload = {
            ...req.body,
            password: hashPwd,
            role: "user",
        };

        const userData = new userModel(payload);
        const saveUser = await userData.save();

        // Set up Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.APP_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"Kharthika Sarees" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "Welcome Onboard - Kharthika Sarees",
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #e07c24;">Welcome to Kharthika Sarees, ${name}!</h2>
                    <p>We’re excited to have you onboard. Your account has been successfully created.</p>
                    <p>Please note: <strong>Your email address (${email}) cannot be changed once registered.</strong> This ensures the security of your account.</p>
                    <p>Here’s what you can do next:</p>
                    <ul>
                        <li>Explore our latest collections.</li>
                        <li>Track your orders and manage your account easily.</li>
                        <li>Stay updated with our new arrivals and special offers.</li>
                    </ul>
                    <p>We look forward to serving you with the finest sarees!</p>
                    <p>Best Regards,</p>
                    <p><strong>Kharthika Sarees Team</strong></p>
                    <hr />
                    <p style="font-size: 12px; color: #777;">If you did not sign up for this account, please contact us immediately at support@kharthikasarees.com.</p>
                </div>
            `,
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Email Error:", error.message);
                // Optionally, you can log this to your database for debugging.
            } else {
                console.log("Email Sent: " + info.response);
            }
        });

        res.status(201).json({
            data: saveUser,
            success: true,
            message: "Added new user",
        });
    } catch (err) {
        console.log(err.message);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: err.message || "An unexpected error occurred",
            });
        }
    }
}

export default SignupController;
