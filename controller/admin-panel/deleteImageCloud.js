import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();


cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const deleteImage = async (req, res) => {
    const { publicId } = req.body;

    try {
        const result = await cloudinary.v2.uploader.destroy(publicId);
        if (result.result === 'ok') {
            res.status(200).json({ message: 'Image deleted successfully' });
        } else {
            res.status(400).json({ message: 'Failed to delete image', details: result });
        }
    } catch (error) {
        console.error('Cloudinary error:', error);
        res.status(500).json({ message: 'Error deleting image', error });
    }
};



export default deleteImage;
