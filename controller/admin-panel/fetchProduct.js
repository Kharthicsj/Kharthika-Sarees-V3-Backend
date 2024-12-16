import productModel from "../../models/ProductModel.js"

async function fetchProducts(req, res) {
    try{
        const allProducts = await productModel.find().sort({createdAt : -1})

        return res.status(201).json({
            success : true,
            error : false,
            message : "Successfully fetched Products",
            data : allProducts
        })

    }catch(err){
        return res.status(400).json({
            success : false,
            error : true,
            message : "Error in fetching products" || err
        })
    }
}

export default fetchProducts