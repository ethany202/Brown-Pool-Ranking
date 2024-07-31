const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: process.env.EMAIL_PORT,
    service: 'gmail',
    auth: {
        user: process.env.CLUB_EMAIL,
        pass: process.env.EMAIL_PASS
    },
});

function sendConfirmationEmail(email, userName, confirmID) {
    const confirmLink = `${process.env.APP_HOST}/new-member?email=${email}&id=${confirmID}`;
    const mailOptions = {
        from: process.env.CLUB_EMAIL,
        to: email,
        subject: '[Brown Pool Club] Email Confirmation',
        html: `
            <h2>Hi  ${userName},</h2>
            <p>Confirm your email with the link to join Brown Pool Club's competitive ladder: 
                <a href="${confirmLink}"> Email Confirmation </a> 
            </p>
        `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            throw error
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendConfirmationEmail