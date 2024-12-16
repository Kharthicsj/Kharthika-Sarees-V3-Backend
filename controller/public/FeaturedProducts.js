import productModel from "../../models/ProductModel.js";

const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await productModel.aggregate([
      { 
        $match: { quantity: { $gt: 0 } } 
      },
      { 
        $sample: { size: 10 } 
      },
      {
        $project: {
          productName: 1,
          category: 1,
          fabric: 1,
          productImage: 1,
          description: 1,
          price: 1,
          selling: 1,
          quantity: 1
        },
      },
    ]);

    if (featuredProducts.length === 0) {
      return res.status(404).json({ error: true, message: "No in-stock featured products found" });
    }

    return res.status(200).json(featuredProducts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: true, message: "Error fetching featured products" });
  }
};

export default getFeaturedProducts;
