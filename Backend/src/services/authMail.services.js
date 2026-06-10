const transporter = require('../config/email');

// otp must be generated
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// send the generated otp to further verify 
const sendOTPEmail = async (email, otp) => {

    // adding space betweem numbers to make it look good
    const otpstring = otp.toString()
                            .split('')
                            .join(' ');

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'GBI: OTP for registration',
        html: `<h2>Your OTP for registration of GBI</h2> 
                <div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; color: #c61616ff; text-align: center; font-size: 20px;">${otpstring}</div>
            `
    };

    try {

        await transporter.sendMail(mailOptions);
        console.log("otp sent");

    } catch (error) {
        
        console.error(`Error sending otp :  ${error.message}`);
    }
}

module.exports = { sendOTPEmail, generateOTP };