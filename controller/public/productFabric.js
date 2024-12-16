import productModel from "../../models/ProductModel.js"

async function productFabric(req, res) {
    try{

        const productFabric = await productModel.distinct("fabric");

        const productByFabric = []

        for(const fabric of productFabric){
            const product = await productModel.findOne({fabric})
            
            if(product) {
                productByFabric.push(product)
            }
        }

        return res.status(201).json({
            success : true,
            error : false,
            data : productByFabric,
            message : "Category wise product"
        })


    }catch(err){
        return res.status(400).json({
            error : true,
            success : false,
            message : err
        })
    }
}

export default productFabric