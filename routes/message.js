const express = require('express');
const router = express.Router();
const transporter = require('../nodemailer')
const db = require('../db')


const inputParameterValidation = ({ name, email, subject, message }) => {
    if (!name || !email || !subject || !message) {
        throw new Error('Missing required input parameters')
    }
}

// POST results to db and send email
router.post('/', async (req, res, next) => {
    const { name, email, subject, message } = req.body

    inputParameterValidation({ name, email, subject, message })

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
    ]).then((values) => {
        console.log(values)
        res.status(201).json({ status: 'success' })
    }).catch((error) => {
        next(error)
    })
})

module.exports = router;
