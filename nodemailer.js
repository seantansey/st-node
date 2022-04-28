const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'Hotmail',
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD
    }
})

module.exports = transporter