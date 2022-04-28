const express = require('express');
const router = express.Router();
const transporter = require('../nodemailer')


const inputParameterValidation = ({ name, email, subject, message }) => {
    if (!name || !email || !subject || !message) {
        throw new Error('Missing required input parameters')
    }
}

// POST results to db and send email
router.post('/', async (req, res, next) => {
    const { name, email, subject, message } = req.body

    inputParameterValidation({ name, email, subject, message })

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

    return transporter.sendMail(options)
        .then(data => {
            console.log(data)
            res.json({ status: 'success' })
        })
        .catch(error => {
            // figure out error handling, use next?
            console.log('error')
            res.send(error)
        })
})

module.exports = router;
