import BannerModel from "../../models/BannerModel.js";
import uploadBannerPermission from "../../helpers/permission.js";

async function UploadBannerImg(req, res) {
    try {
        const sessionUserId = req.userId;

        if (!uploadBannerPermission(sessionUserId)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Not an admin user to upload banners. Please contact admin."
            });
        }

        const { name, banner, active, screen } = req.body;

        if (!name || !banner || !active || !screen) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "All fields (name, banner, active, screen) are required."
            });
        }

        if (!["mobile", "computer"].includes(screen)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid screen type. Please select either 'mobile' or 'computer'."
            });
        }

        const newBanner = new BannerModel({
            name,
            banner,
            active,
            screen, 
        });

        const savedBanner = await newBanner.save();

        return res.status(201).json({
            success: true,
            error: false,
            data: savedBanner,
            message: "Banner uploaded successfully."
        });

    } catch (err) {
        return res.status(400).json({
            error: true,
            success: false,
            message: err.message || "An error occurred while uploading the banner."
        });
    }
}

export default UploadBannerImg;
