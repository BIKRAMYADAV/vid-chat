// verifyMailer.js
const nodemailer = require('nodemailer');

const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function verifyMailer() {
  try {
    await mailer.verify();
    console.log('Mailer ready');
  } catch (err) {
    console.log('Mailer error:', err.message);
  }
}

module.exports = { mailer, verifyMailer };
