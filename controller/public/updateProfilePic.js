import userModel from "../../models/User.js";

async function updateProfilePic(req, res) {
  try {
    const userId = req.userId;
    const { profilepic } = req.body;

    if (!userId || !profilepic) {
      return res.status(400).json({
        error: true,
        message: "User ID and profilepic are required",
        success: false,
      });
    }

    const updateUser = await userModel.findByIdAndUpdate(userId, { profilepic }, { new: true });

    if (!updateUser) {
      return res.status(404).json({
        error: true,
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: updateUser,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: true,
      message: err.message,
      success: false,
    });
  }
}

export default updateProfilePic;
