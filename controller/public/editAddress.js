import userModel from "../../models/User.js";

async function editAddress(req, res) {
  try {
    const { id, address } = req.body;
    const userId = req.userId; 

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "User not found",
      });
    }

    const updatedAddress = await userModel.updateOne(
      { _id: userId, "address._id": id }, 
      { $set: { "address.$": address } }  
    );

    if (updatedAddress.modifiedCount === 0) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Address update failed or not found",
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      message: "Address updated successfully",
      data: address,  
    });

  } catch (err) {
    console.error("Error updating address:", err.message);
    return res.status(400).json({
      error: true,
      success: false,
      message: err.message,
      data: err,
    });
  }
}

export default editAddress;
