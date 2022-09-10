const jwt = require('jsonwebtoken')

// middleware used to verify if token exits before moving forward
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    jwt.verify(token, process.env.TOKEN_SECRET, { ignoreExpiration: true }, (err) => {
        if (err) res.status(401).json({ error: err })
        else next()
    })
}

module.exports = {
    verifyToken
}