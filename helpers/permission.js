import userModel from "../models/User.js"

const uploadProductPermission = async (userId) => {
    const user = await userModel.findById(userId);

    if(user.role === 'admin'){
        return true
    }

    return false
}

export default uploadProductPermission