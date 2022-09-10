const express = require('express')
const router = express.Router()
const sendEmail = require('../nodemailer')
const db = require('../db')
const { validateParams } = require('../utils/params')


const getAllMessages = (req, res, next) => {
    const query = {
        text: 'SELECT * FROM messages',
    }  
    return db.query(query)
        .then(({ rows }) => res.status(200).json(rows))
        .catch((error) => next(error))
}

const getMessageById = (req, res, next) => {
    const query = {
        text: 'SELECT * FROM messages WHERE id = $1',
        values: [req.params.id]
    }
    return db.query(query)
        .then(({ rows }) => res.status(200).json(rows))
        .catch((error) => next(error))
}


const postMessage = (req, res, next) => {
    const errors = validateParams(req, ['name', 'email', 'subject', 'message'])
    if (errors) {
        next(errors)
        return
    }

    const { name, email, subject, message } = req.body

    const query = {
        text: 'INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4)',
        values: [ name, email, subject, message ]
    }   

    return Promise.all([
        sendEmail({ name, email, subject, message }),
        db.transact(query)
    ])
        .then(() => res.status(201).json({ status: 'success' }))
        .catch((error) => next(error))
}

router.get('/', getAllMessages)
router.get('/:id', getMessageById)
router.post('/', postMessage)

module.exports = {
    getAllMessages,
    getMessageById,
    postMessage,
    messagesRouter: router
}
