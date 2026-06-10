const send = require('send');
const transporter = require('../config/email');

const transactionMail = async ({to,subject,amount,type})=>{
    
    // dummy boiler plate for further additions of transaction mail

    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        text : `type : ${type}, amount : ${amount}`
    }

    try{

        await transporter.sendMail(mailOptions);
        console.log("transaction alert sent");

    } catch(err){

        console.error(`Error sending email :  ${err.message}`);
    
    }

}

const loginMail = async(to)=>{

    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: "login detected",
        text : "successfully logged in"
    }

    try{

        await transporter.sendMail(mailOptions);
        console.log("login alert sent");

    } catch(err){

        console.error(`Error sending email :  ${err.message}`);
    
    }

}

const depositMail = async(to,amount)=>{

    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: "Deposited amount",
        text : `Your amount of ${amount} has been deposited successfully`
    }

    try{

        await transporter.sendMail(mailOptions);
        console.log("deposit alert sent");

    } catch(err){

        console.log(`error sending email : ${err.message}`);

    }
}

module.exports = {transactionMail,loginMail,depositMail};