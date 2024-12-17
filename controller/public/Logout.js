async function Logout(req, res){
    try{
        res.clearCookie("token", { 
            path: "/", 
            httpOnly: true, 
            sameSite: "strict", 
            secure: process.env.NODE_ENV === 'production',
            domain: "kharthika-sarees-v3-backend.onrender.com"
        });

        return res.json({
            success : true,
            error : false,
            message : "Logged Out Successfully"
        })

    }catch(err){
        console.log(err)
        return res.status(400).json({
            error : true,
            success : false,
            message : err
        })
    }
}

export default Logout