import userModel from "../../models/User.js"

async function Allusers(req, res) {
    try {

        const allUser = await userModel.find()

        return res.status(201).json({
            message : allUser,
            success : true,
            error : false
        })

    } catch (err) {
        res.status(400).json({
            message: err,
            success: false,
            error: true
        })
    }
}

export default Allusers