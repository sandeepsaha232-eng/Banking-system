const sendMail = require('../config/email');

const transactionMail = async ({to,subject,amount,type,time})=>{

    const mailOptions = {
        to: to,
        subject: subject,
        html: `
            <div style="font-family: Arial; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                <h2 style="color: ${type === 'debit' ? '#03a9f4' : '#28a745'};">${subject}</h2>
                <p>A <strong>${type}</strong> transaction has been processed on your account.</p>
                <div style="font-size: 18px; margin: 20px 0; padding: 10px; background-color: #f9f9f9; border-left: 5px solid ${type === 'debit' ? '#c61616' : '#28a745'};">
                    Amount: <strong>${amount}</strong>
                </div>
                <div>
                    Time : ${time}
                </div>
                <p>Thank you for using GBI.</p>
            </div>
        `
    }
    try{

        await sendMail(mailOptions);
        console.log("transaction alert sent");

    } catch(err){
        console.error(`Error sending email :  ${err.message}`);
    }

}

const loginMail = async(to,systemDetails)=>{

    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: "login detected",
        html : `<div style="font-family: Arial; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #03a9f4;">login detected</h2>
                    <p>Successfully logged in to your account on <span style="color: #03a9f4;">${systemDetails.time}</span> on <strong style="color: #bc03f4ff;">${systemDetails.browser}</strong></p>
                    <h3 style="color: #f4a803ff;">Device Details</h3>
                    <p>Device : ${systemDetails.device.device.model}</p>
                    <p>OS : ${systemDetails.device.os.name}</p>
                    <p>Browser : ${systemDetails.device.browser.name}</p>
                    <p>Location : ${systemDetails.location}</p>
                    <p>Time : ${systemDetails.time}</p>
                    <p>Thank you for using GBI.</p>
                </div>`
    }

    try{
        await sendMail(mailOptions);
    } catch(err){
        console.error(`Error sending email :  ${err.message}`);
    }

}

const depositMail = async(to,amount,time)=>{

    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: "Deposited amount",
        html : `<div style="font-family: Arial; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #03a9f4;">Amount deposited</h2>
                <div style="font-size: 18px; margin: 20px 0; padding: 10px; background-color: #f9f9f9; border-left: 5px solid #28a745;">
                    Amount: <strong>${amount}</strong>
                </div>
                <div>
                    Time : ${time}
                </div>
                    <p>Thank you for using GBI.</p>
                </div>`
    }

    try{
        await sendMail(mailOptions);
        console.log("deposit alert sent");
    } catch(err){
        console.log(`error sending email : ${err.message}`);
    }
}

module.exports = {transactionMail,loginMail,depositMail};