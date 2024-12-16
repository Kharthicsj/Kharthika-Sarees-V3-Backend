import userModel from "../../models/User.js";

async function updateAccountDetails(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        error: true,
        message: "User not found",  
        success: false,
      });
    }

    
    const {_id, ...resBody} = req.body
    const updateUser = await userModel.findByIdAndUpdate(_id,resBody)

    return res.status(200).json({
      success: true,
      message: "Account details updated successfully",
      data: updateUser,
    });

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      error: true,
      message: err.message,
      success: false,
    });
  }
}

export default updateAccountDetails;
