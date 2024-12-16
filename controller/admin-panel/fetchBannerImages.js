import BannerModel from "../../models/BannerModel.js";

async function fetchBannerImages(req, res) {
    try {
        const banners = await BannerModel.find();

        const activeBanners = banners.filter(banner => banner.active === true);
        const inactiveBanners = banners.filter(banner => banner.active === false);

        return res.status(200).json({
            success: true,
            activeBanners,
            inactiveBanners
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export default fetchBannerImages;
