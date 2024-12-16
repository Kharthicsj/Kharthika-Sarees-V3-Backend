import productModel from "../../models/ProductModel.js";
import uploadProductPermission from "../../helpers/permission.js";

async function deleteProduct(req, res) {
    try {
        const sessionUserId = req.userId;

        if (!uploadProductPermission(sessionUserId)) {
            return res.status(403).json({
                error: true,
                success: false,
                message: "You do not have permission to delete products.",
            });
        }

        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                error: true,
                message: "Product ID is required"
            });
        }

        const deletedProduct = await productModel.findByIdAndDelete(_id);

        if (!deletedProduct) {
            return res.status(404).json({
                error: true,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            error: false,
            success: true,
            message: "Product deleted successfully",
        });
    } catch (err) {
        console.error("Error deleting product:", err);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Failed to delete the product",
        });
    }
}


export default deleteProduct