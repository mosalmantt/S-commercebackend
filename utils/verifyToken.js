const jwt = require('jsonwebtoken');
require('dotenv').config();
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    const actualToken = token.split(' ')[1]
    if (!actualToken) {
        res.json({
            StatusCode: 404,
            Message: "Access denied. Token is missing",
        })
    }
    try {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const decoded = jwt.verify(actualToken,process.env.JWT_SECRET);
        if(decoded.exp && decoded.exp < currentTimestamp){
            res.json({
                StatusCode: 401,
                Message: "Token has expired",
            });
        }else{
            next();
        }
    } catch (error) {
        res.json({
            StatusCode: 401,
            Message: "Invalid token"
        })
    }
}

module.exports = verifyToken