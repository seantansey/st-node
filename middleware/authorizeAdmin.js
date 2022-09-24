const bcrypt = require('bcrypt')
const db = require('../db')

// middleware to verify user
const authorizeAdmin = (req, res, next) => {
    const credentials = req.headers?.authorization?.split(' ')[1]

    if (!credentials) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized: missing required credentials"
        })
    }

    const [ username, password ] = new Buffer.from(credentials, 'base64').toString().split(':')

    const query = {
        text: 'SELECT * FROM users WHERE username = $1',
        values: [ username ]
    }

    return db.query(query)
        .then(({ rows }) => {
            bcrypt.compare(password, rows[0].password)
                .then((authorized) => {
                    if (!authorized) res.status(401).json({
                        status: 401,
                        message: "Unauthorized: you are not authorized to perform this action"
                    })
                    else next()
                })
                .catch(() => res.status(401).json({
                    status: 401,
                    message: "Unauthorized: error processing credentials"
                }))
        })
        .catch(() => res.status(401).json({
            status: 401,
            message: "Unauthorized: user not found"
        }))
}


module.exports = {
    authorizeAdmin
}
