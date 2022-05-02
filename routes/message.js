const express = require('express');
const router = express.Router();
const transporter = require('../nodemailer')
const db = require('../db')


const validateParams = ({ name, email, subject, message }) => {
    if (!name || !email || !subject || !message) {
        return new Error('Missing required input parameters')
    }
}

// POST message to db and send email
router.post('/', async (req, res, next) => {
    const { name, email, subject, message } = req.body

    const paramError = validateParams({ name, email, subject, message })
    if (paramError) next(paramError)

    const query = {
        text: 'INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4)',
        values: [ name, email, subject, message ]
    }   

    const options = {
        from: `"[STWeb] - ${name}" <${process.env.EMAIL_SENDER}>`,
        to: process.env.EMAIL_RECEIVER,
        subject,
        html: `
            <div>Name: ${name}</div>
            <div>Email: ${email}</div>
            <br>
            <p>${message}</p>
        `
    }

    return Promise.all([
        transporter.sendMail(options),
        db.query(query)
    ]).then(() => {
        res.status(201).json({ status: 'success' })
    }).catch((error) => {
        next(error)
    })
})

module.exports = router;
