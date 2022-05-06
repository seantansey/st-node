const express = require('express')
const router = express.Router()
const sendEmail = require('../nodemailer')
const db = require('../db')


const validateParams = ({ body }) => {
    if (!body) {
        return new Error('Missing required input parameters')
    }
    const { name, email, subject, message } = body
    if (!name || !email || !subject || !message) {
        return new Error('Missing required input parameters')
    }
}


const getAllMessages = async (req, res, next) => {
    const query = {
        text: 'SELECT * FROM messages',
    }  
    return db.query(query)
        .then(({ rows }) => {
            res.status(200).json(rows)
        })
        .catch((error) => next(error))
}

const getMessageById = async (req, res, next) => {
    const query = {
        text: 'SELECT * FROM messages WHERE id = $1',
        values: [req.params.id]
    }
    return db.query(query)
        .then(({ rows }) => {
            res.status(200).json(rows)
        })
        .catch((error) => next(error))
}


const postMessage = async (req, res, next) => {
    const paramError = validateParams(req)
    
    if (paramError) {
        next(paramError)
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
    ]).then(() => {
        res.status(201).json({ status: 'success' })
    }).catch((error) => {
        next(error)
    })
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
