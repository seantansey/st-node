const express = require('express')
const router = express.Router()
const db = require('../db')
const bcrypt = require('bcrypt')
const { validateParams } = require('../utils/params')

const postUser = async (req, res, next) => {
    const errors = validateParams(req, ['username', 'password'])
    if (errors) {
        next(errors)
        return
    }

    const { username, password } = req.body

    bcrypt.hash(password, 10)
        .then((hash) => {
            const query = {
                text: 'INSERT INTO users (username, password) VALUES ($1, $2)',
                values: [ username, hash ]
            }   

            return db.transact(query)
                .then(() => {
                    res.status(201).json({ message: 'user created' })
                })
                .catch((error) => {
                    next(error)
                })
        }) 
        .catch((error) => {
            next(error)
        })
}


router.post('/', postUser)

module.exports = {
    postUser,
    usersRouter: router
}
