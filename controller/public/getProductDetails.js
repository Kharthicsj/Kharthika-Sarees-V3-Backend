import productModel from "../../models/ProductModel.js";

async function getProductDetails(req, res) {
    try{
        const { id } = req.body;
        const product = await productModel.findById(id);

        return res.status(210).json({
            message : "Successfully fetched the product",
            error : false,
            success : true,
            data : product
        })

    }catch(err){
        return res.status(400).json({
            message : err || "Unable to fetch product",
            error : true,
            success : false
        })
    }
}

export default getProductDetails