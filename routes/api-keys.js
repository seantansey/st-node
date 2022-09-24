const express = require('express')
const router = express.Router()
const db = require('../db')
const bcrypt = require('bcrypt')
const crypto = require('crypto');

const generateAPIKey = async (req, res, next) => {
    const key = crypto.randomUUID()

    bcrypt.hash(key, 10)
        .then((hash) => {
            const query = {
                text: 'INSERT INTO api_keys (key) VALUES ($1) RETURNING id',
                values: [ hash ]
            }   

            return db.transact(query)
                .then(({ rows }) => {
                    res.status(201).json({
                        appId: rows[0].id,
                        apiKey: key
                    })
                })
                .catch((error) => next(error))
        }) 
        .catch((error) => next(error))
}


router.post('/', generateAPIKey)

module.exports = {
    generateAPIKey,
    apiKeyRouter: router
}
