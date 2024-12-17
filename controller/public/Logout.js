async function Logout(req, res) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true, 
            sameSite: "None", 
            path: "/",
        });

        return res.json({
            success: true,
            error: false,
            message: "Logged Out Successfully"
        })

    } catch (err) {
        console.log(err)
        return res.status(400).json({
            error: true,
            success: false,
            message: err
        })
    }
}

export default Logout