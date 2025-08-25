const google = require('googleapis')
const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')
const sendMimeMessage = require('../controllers/SendMessage')
const {mailer} = require('../controllers/verifyMailer')


module.exports = (app) => {
    app.post('/send-mail', async  (req , res) => {
        const {sender, emails, inviteLink} = req.body;

        const mailOptions = {
            from : `${sender} <${process.env.EMAIL_USER}>`,
            to: emails,
            subject: 'invitation for joining video meet',
             html: `
        <h2>You’ve been invited to a meeting</h2>
        <p><b>From:</b> ${sender}</p>
        <p>Join the meeting: <a href=${inviteLink}>Click here</a></p>
      `
        }

        try{
            const info = await mailer.sendMail(mailOptions);
            console.log('email sent', info.messageId);
            res.status(200).json({success:true, messageId:info.messageId});

        }catch (err){
            res.status(500).json({
                success : false,
                error: err.message 
            })
        }
    })
}