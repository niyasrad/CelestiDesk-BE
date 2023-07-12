const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '2d' })
}

const verifyToken = (req, res, next) => {
    
    try {

        const token = req.headers['authorization'].split(' ')[1]

        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err || !decoded) return res.status(403).json({
                message: "Login has failed!"
            })
            req.username = decoded.username; 
            next()
        })

    } catch (err) {

        return res.status(403).json({
            message: "You are not authorized to access this resource"
        })

    }
}

module.exports = { generateToken, verifyToken }