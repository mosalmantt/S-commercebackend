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
        const decoded = jwt.verify(actualToken,process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.json({
            StatusCode: 401,
            Message: "Invalid token"
        })
    }
}

module.exports = verifyToken