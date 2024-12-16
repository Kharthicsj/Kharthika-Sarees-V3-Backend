import BannerModel from "../../models/BannerModel.js";
import EditBannerPermission from "../../helpers/permission.js";

async function editBanner(req, res) {
    try {
        const sessionUserId = req.userId;

        if (!EditBannerPermission(sessionUserId)) {
            return res.status(403).json({
                error: true,
                success: false,
                message: "You do not have permission to edit banners. Please contact the admin."
            });
        }

        const { _id, name, active, screen, banner } = req.body;

        if (!_id) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Banner ID is required to edit the banner."
            });
        }

        const updatedBanner = await BannerModel.findByIdAndUpdate(
            _id,
            {
                name,
                active,
                screen,
                banner,
            },
            { new: true }
        );

        if (!updatedBanner) {
            return res.status(404).json({
                error: true,
                success: false,
                message: "Banner not found. Please check the banner ID."
            });
        }

        return res.status(200).json({
            error: false,
            success: true,
            message: "Banner updated successfully.",
            data: updatedBanner
        });
    } catch (err) {
        console.error("Error editing banner:", err);
        return res.status(500).json({
            error: true,
            success: false,
            message: "An error occurred while updating the banner. Please try again later.",
            details: err.message
        });
    }
}

export default editBanner;
