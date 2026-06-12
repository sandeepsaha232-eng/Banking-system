const transporter = require('../config/email');

const transactionMail = async ({to,subject,amount,type})=>{
    
    // dummy boiler plate for further additions of transaction mail

    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        html: `
            <div style="font-family: Arial; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                <h2 style="color: ${type === 'debit' ? '#03a9f4' : '#28a745'};">${subject}</h2>
                <p>A <strong>${type}</strong> transaction has been processed on your account.</p>
                <div style="font-size: 18px; margin: 20px 0; padding: 10px; background-color: #f9f9f9; border-left: 5px solid ${type === 'debit' ? '#c61616' : '#28a745'};">
                    Amount: <strong>${amount}</strong>
                </div>
                <p>Thank you for using GBI.</p>
            </div>
        `
    }

    try{

        await transporter.sendMail(mailOptions);
        console.log("transaction alert sent");

    } catch(err){

        console.error(`Error sending email :  ${err.message}`);
    
    }

}

const loginMail = async(to,time)=>{

    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: "login detected",
        html : `<div style="font-family: Arial; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #03a9f4;">login detected</h2>
                    <p>Successfully logged in to your account at ${time}</p>
                    <p>Thank you for using GBI.</p>
                </div>`
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