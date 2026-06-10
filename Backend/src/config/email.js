const nodemailer = require('nodemailer');

// transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user : process.env.EMAIL,
        pass : process.env.APP_PASS
    }
})

module.exports = transporter;