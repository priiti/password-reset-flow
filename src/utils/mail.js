const nodemailer = require('nodemailer');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');
const pug = require('pug');

const transport = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port:process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD
  }
});

exports.send = async (options) => {
  const mailOptions = {
    from: 'Priit Parl <priitparl@gmail.com>',
    to: options.user.email,
    subject: options.subject,
    html: `<div>
            <h1>
              Press link below to reset the password:
            </h1>
          </div>
          </br>
          <div>
            <p><a href="${options.resetURL}">Reset password</a></p>
          </div>`,
    text: 'Hey, what is going on?'
  };
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
};
