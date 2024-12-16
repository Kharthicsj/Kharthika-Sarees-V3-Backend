import userModel from "../../models/User.js"
import bcrypt from 'bcrypt'

async function SignupController(req, res) {
    try {
        const { name, email, password, profilepic } = req.body

        const salt = await bcrypt.genSalt(10)
        const hashPwd = await bcrypt.hash(password, salt)

        const user = await userModel.findOne({ email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists, Kindly Login."
            })
        }

        if (!hashPwd) {
            res.status(400).json({
                success: false,
                message: "Some Error Occured While Processing"
            })
        }

        const payload = {
            ...req.body,
            password: hashPwd,
            role : "user"
        }

        const userData = new userModel(payload)
        const saveUser = await userData.save()

        res.status(201).json({
            data: saveUser,
            success: true,
            message: "Added new user"
        })

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