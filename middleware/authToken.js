import JsonWebToken from "jsonwebtoken";

async function authToken(req, res, next) {
    try {
        const authHeader = req.headers["authorization"];
        const token = req.cookies?.token || (authHeader && authHeader.split(" ")[1]);


        if (!token) {
            return res.status(401).json({
                message: "User not Logged in",
                success: false,
                error: true
            })
        }

        JsonWebToken.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(403).json({
                        message: "Session expired. Please log in again.",
                        success: false,
                        error: true,
                    });
                }
                return res.status(401).json({
                    message: "Invalid token. Please log in again.",
                    success: false,
                    error: true,
                });
            }
            req.userId = decoded.tokenData._id;
            next();
        });

    } catch (err) {
        return res.status(401).json({
            message: err.message,
            data: [],
            success: false,
            error: true
        });
    }
}

export default authToken