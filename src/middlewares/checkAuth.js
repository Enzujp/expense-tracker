const jwt = require("jsonwebtoken");
const { User } = require("../models/User")

const checkAuth = async(req, res, next) => {
    try {
        // get token from headers
        const auth = req.headers.authorization;
        // check to confirm token exists
        if (!auth) {
            res.status(401).json({
                message: "AUTH Header not found"
            });
        } 
        else {
            const token = req.headers.authorization.split(' ')[1] // use the split because it comes with the "Bearer" keyword
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
            const user = decodedToken.user; // gotten from authController where user = user._id
            if (req.user === user) {
                next();
            } else {
                return res.status(401).json({
                    message: "Invalid token and user"
                })
            }
        }
    } catch (error) {
        res.status(401).json({
            message: "Not authorized",
            error: error.message
        })
    
    }
}

module.exports = checkAuth;