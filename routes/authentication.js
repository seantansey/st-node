const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const db = require('../db')
const { validateParams } = require('../utils/params')

const generateAccessToken = (req, res, next) => {
    const errors = validateParams(req, ['username', 'password'])
    if (errors) {
        next(errors)
        return
    }

    const { username, password } = req.body

    const query = {
        text: 'SELECT * FROM users WHERE username = $1',
        values: [ username ]
    }

    return db.query(query)
        .then(({ rows }) => {
            const user = rows[0]

            bcrypt.compare(password, user.password)
                .then(() => {
                    const token = jwt.sign({ username }, process.env.TOKEN_SECRET)
                    res.status(201).json({ token })
                })
                .catch((error) => next(error))
        })
        .catch((error) => next(error))
}

router.post('/', generateAccessToken)


module.exports = {
    generateAccessToken,
    authenticationRouter: router
}
