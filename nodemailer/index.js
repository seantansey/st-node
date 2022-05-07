const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD
    }
})

const sendEmail = ({ name, email, subject, message }) => {
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
}

module.exports = sendEmail