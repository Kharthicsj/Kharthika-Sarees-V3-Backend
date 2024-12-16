import uploadProductPermission from "../../helpers/permission.js"
import productModel from "../../models/ProductModel.js"

async function EditProduct(req, res) {
    try{

        const sessionUserId = req.userId

        if(!uploadProductPermission(sessionUserId)){
            return res.status(400).json({
                error : true,
                success : false,
                message : "Some error occured while processing request kindly contact admin"
            })
        }

        const {_id, ...resBody} = req.body
        const updateProduct = await productModel.findByIdAndUpdate(_id, resBody)

        return res.status(201).json({
            error : false,
            success : true,
            message : "Successfully updated the Product",
            data : updateProduct
        })

    }catch(err){
        return res.status(400).json({
            error : true,
            success : false,
            message : err
        })
    }
}

export default EditProduct