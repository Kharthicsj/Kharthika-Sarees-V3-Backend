import bcrypt from 'bcrypt';
import userModel from "../../models/User.js";

async function resetPassword(req, res) {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Email and New Password are required"
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "User not found"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password has been successfully updated"
        });

    } catch (err) {
        console.error("Error in resetPassword:", err);
        return res.status(500).json({
            error: true,
            success: false,
            message: "An error occurred. Please try again later."
        });
    }
}

export default resetPassword;
