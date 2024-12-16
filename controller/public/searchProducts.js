import mongoose from 'mongoose';
import ProductModel from "../../models/ProductModel.js";

async function searchProduct(req, res) {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Query parameter is missing!",
      });
    }

    // Split the query into individual words
    const queryWords = query.split(" ").map(word => word.trim()).filter(word => word);

    // Check if query is a valid ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(query);

    // Build search conditions for multiple keywords
    const searchConditions = queryWords.map(word => ({
      $or: [
        { productName: { $regex: word, $options: "i" } },
        { category: { $regex: word, $options: "i" } },
        { fabric: { $regex: word, $options: "i" } }
      ]
    }));

    // Add _id search condition if query is a valid ObjectId
    if (isValidObjectId) {
      searchConditions.push({ _id: query });
    }

    // Use $and to ensure all keywords must match
    const products = await ProductModel.find({
      $and: searchConditions,
    });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err) {
    console.error("Error during search:", err);
    res.status(500).json({
      error: true,
      success: false,
      message: "Something went wrong during search!",
    });
  }
}

export default searchProduct;
