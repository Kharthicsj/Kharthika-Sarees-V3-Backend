import userModel from "../../models/User.js";

async function addNewAddress(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "User not found",
      });
    }

    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Address is required",
      });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        $push: { address: address }, 
      },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      message: "Successfully added the new address",
      data: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      success: false,
      message: err.message,
    });
  }
}

export default addNewAddress;
