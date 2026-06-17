const nodemailer = require('nodemailer');
require('dotenv').config();

// ERROR on render when trying to send mail : corrected code but study of this is required
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',   // explicit host instead of 'service: gmail'
    port: 587,                // 587 with TLS, not 465 with SSL
    secure: false,            // false for port 587
    family: 4,                // CRITICAL: force IPv4, prevents ENETUNREACH on Render
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASS
    }
});

module.exports = transporter;