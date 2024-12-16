import productModel from "../../models/ProductModel.js";

const getChudiSlider = async (req, res) => {
  try {
    const saree = await productModel.aggregate([
      { 
        $match: { category: "Chudithar" }
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
          quantity: 1,
        },
      },
    ]);

    if (!saree || saree.length === 0) {
      return res.status(404).json({ error: true, message: "No Saree products found" });
    }

    return res.status(200).json(saree);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: true, message: "Error fetching Saree products" });
  }
};

export default getChudiSlider;
