import BannerModel from "../../models/BannerModel.js";

async function deleteBanner(req, res) {
  const { id } = req.params;

  try {
    const banner = await BannerModel.findById(id);

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    await BannerModel.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ success: false, message: 'An error occurred while deleting the banner' });
  }
}

export default deleteBanner;
