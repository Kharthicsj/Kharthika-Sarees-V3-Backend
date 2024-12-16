import userModel from "../../models/User.js";

async function deleteAddress(req, res) {
  try {
    const { addressId } = req.body; 
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Please log in to remove an address",
        error: true,
      });
    }

    if (!addressId) {
      return res.status(400).json({
        error: true,
        message: "Address ID is missing",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    const addressIndex = user.address.findIndex(
      (address) => address._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        error: true,
        message: "Address not found in your account",
      });
    }

    user.address.splice(addressIndex, 1);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address removed from your account",
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      error: true,
      success: false,
    });
  }
}

export default deleteAddress;
