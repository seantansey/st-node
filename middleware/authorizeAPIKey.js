const bcrypt = require('bcrypt')
const db = require('../db')

// middleware to verify API key
const authorizeAPIKey = (req, res, next) => {
    const appId = req.headers['x-app-id']
    const apiKey = req.headers['x-api-key']

    if (!appId || !apiKey) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized: missing required credentials"
        })
    }

    const query = {
        text: 'SELECT * FROM api_keys WHERE id = $1',
        values: [ appId ]
    }

    return db.query(query)
        .then(({ rows }) => {
            bcrypt.compare(apiKey, rows[0].key)
                .then((authorized) => {
                    if (!authorized) res.status(401).json({
                        status: 401,
                        message: "Unauthorized: api key not authorized to perform this action"
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
            message: "Unauthorized: app id not recognized"
        }))
}

module.exports = {
    authorizeAPIKey
}