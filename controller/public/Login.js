import userModel from "../../models/User.js";
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken";

async function LoginController(req, res) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(400).json({
                success: false,
                message: "Please enter the Correct Password",
                error: true
            })
        } else {

            const tokenData = {
                _id: user._id,
                email: user.email,
            }

            const token = await jsonwebtoken.sign({
                tokenData,
            }, process.env.TOKEN_SECRET_KEY, { expiresIn: 60 * 60 });

            const tokenOption = {
                httpOnly : true,
                secure : true,
                sameSite: 'None',
            }

            return res.cookie("token", token, tokenOption).status(201).json({
                success: true,
                message: "Login Successful",
                error: false,
                data: token
            })
        }

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

export default LoginController