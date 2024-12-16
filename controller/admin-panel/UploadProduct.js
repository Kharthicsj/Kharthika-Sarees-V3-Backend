import uploadProductPermission from "../../helpers/permission.js"
import productModel from "../../models/ProductModel.js"

async function UpladProduct(req, res) {
    try {

        const sessionUserId = req.userId

        if (!uploadProductPermission(sessionUserId)) {
            return res.statuss(400).json({
                error: true,
                success: false,
                message: "Not an admin user to add products, please contact admin"
            })
        }

        const uploadProduct = new productModel(req.body)
        const saveProduct = await uploadProduct.save()

        return res.status(201).json({
            success: true,
            error: false,
            data: saveProduct,
            message: "Product Uploaded Successfully"
        })

    } catch (err) {
        return res.status(400).json({
            error: true,
            success: false,
            message: err
        })
    }
}

export default UpladProduct