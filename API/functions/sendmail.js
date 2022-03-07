const nodemailer = require('nodemailer')
require('dotenv').config()


module.exports = {
    sendmail: function(receiver, subject, message){
        // Step 1=
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.GMAIL_PASSWORD
            }
        });

        // Step 2
        const mailOptions = {
            from: {
                name: 'Health Care Webiste',
                address: ''
            }, 
            to: receiver,
            subject: subject,
            html: message
        };

        // Step 3
        transporter.sendMail(mailOptions, (error, data) => {
            if(error){
                return error 
            }
        });
    }
}