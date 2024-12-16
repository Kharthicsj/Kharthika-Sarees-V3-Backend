import userModel from "../../models/User.js";
import uploadProductPermission from "../../helpers/permission.js";

async function deleteUser(req, res) {
    try{
        const sessionUserId = req.userId;
        if (!uploadProductPermission(sessionUserId)) {
            return res.status(403).json({
                error: true,
                success: false,
                message: "You do not have permission to delete",
            });
        }

        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                error: true,
                message: "Product ID is required"
            });
        }

        const deletedUser = await userModel.findByIdAndDelete(_id);

        if (!deletedUser) {
            return res.status(404).json({
                error: true,
                message: "User not found"
            });
        }

        return res.status(200).json({
            error: false,
            success: true,
            message: "User deleted successfully",
        });

    }catch(err){
        return res.status(400).json({
            error : true,
            success : true,
            message : "Error while processing request"
        })
    }
}

export default deleteUser