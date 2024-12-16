import cartModel from "../../models/CartModel.js";

async function countCart(req, res) {
    try{
        const userId = req.userId
        
        const count = await cartModel.countDocuments({userId : userId});
        return res.status(201).json({
            success : true,
            error : false,
            data : {
                count
            },
            message : "ok"
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            error: true,
            success: false,
            message: "Error while adding product to cart",
          });
    }
}

export default countCart