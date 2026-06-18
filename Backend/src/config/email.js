require('dotenv').config();

//Gmail's SMTP (smtp.gmail.com) requires the connecting server to have a trusted IP with a proper PTR record (reverse DNS). 
//Render's free tier servers don't have this Gmail sees an unknown IP hitting port 465/587 and drops the connection
// That gave the first error : ENETUNREACH.

//Brevo SMTP : only allows fixed ips but render uses dynamic ips, impossible to fix in free tier atleast

//Brevo HTTP API : Brevo's HTTP API (api.brevo.com/v3/smtp/email) goes over port 443 (HTTPS) 
// the same port as regular web traffic Render never blocks 443 outbound.
// There's no IP whitelisting because authentication is done via the API key in the header, not by who's connecting. 
// The email sending happens entirely on Brevo's servers after they receive your API request.

const sendEmail = async ({ to, subject, html }) => {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'api-key': process.env.BREVO_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sender: { name: 'GBI Banking',  // display name of the mail
                      email: 'noreply@nitishsingh.in' }, // email, set in the brevo's sender list
            to: [{ email: to }],
            subject,
            htmlContent: html
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send email');
    }

    console.log('Email sent successfully');
};

module.exports = sendEmail;