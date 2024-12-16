import userModel from "../../models/User.js"

async function accountDetails(req, res) {
    try {
        const userId = req.userId
        const user = await userModel.findById(userId)

        if (!userId) {
            return res.status(401).json({
                message: "User not logged in",
                success: false,
                error: true,
            });
        }

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: true,
            });
        }

        return res.status(201).json({
            message: "Data Fetched Successfully",
            success: true,
            data: user
        })

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: true,
        });
    }
}

export default accountDetails