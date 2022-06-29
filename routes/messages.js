const express = require('express')
const router = express.Router()
const sendEmail = require('../nodemailer')


const validateParams = ({ body }) => {
    if (!body) {
        return new Error('Missing required input parameters')
    }
    const { name, email, subject, message } = body
    if (!name || !email || !subject || !message) {
        return new Error('Missing required input parameters')
    }
}

const sendMessage = async (req, res, next) => {
    const paramError = validateParams(req)
    
    if (paramError) {
        next(paramError)
        return
    }
    const { name, email, subject, message } = req.body

    return sendEmail({ name, email, subject, message })
        .then(() => {
            res.status(201).json({ status: 'success' })
        }).catch((error) => {
            next(error)
        })
}

router.post('/', sendMessage)

module.exports = {
    sendMessage,
    messagesRouter: router
}
