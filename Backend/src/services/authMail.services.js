const sendMail = require('../config/email')
const crypto = require('crypto');

// otp must be generated
const generateOTP = () => {
    return crypto.randomInt(100000, 1000000).toString(); // using crypto to generate otp :  more secure
}

// send the generated otp to further verify 
const sendOTPEmail = async (email, otp) => {

    // adding space betweem numbers to make it look good
    const otpstring = otp.toString()
                            .split('')
                            .join(' ');

    const mailOptions = {
        to: email,
        subject: 'GBI: OTP for registration',
        html: `<h2>Your OTP for registration of GBI</h2> 
                <h2 style="color: #39c616ff;">These are for testing purpose only</h2>
                <div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; color: #c61616ff; text-align: center; font-size: 20px;">${otpstring}</div>
            `
    };

    try {

        await sendMail(mailOptions); // sending mail directly via brevo API
        console.log("otp sent");

    } catch (error) {
        
        console.error(`Error sending otp :  ${error.message}`);
    }
}

module.exports = { sendOTPEmail, generateOTP };