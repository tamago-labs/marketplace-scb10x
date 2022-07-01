const _sgMail = require('@sendgrid/mail')

require('dotenv').config()


const sgMail = _sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const msg = {
  to: 'pongzthor@gmail.com',
  from: {
    name: 'Tamago Team',
    email: process.env.SENDGRID_MSG_FROM_EMAIL
  },
  subject: 'This is the subject',
  html: '<strong>Here lies html</strong>',
}


// sgMail.send(msg).then((res) => { console.log("Email sent!") }).catch((err) => { console.log(err) })

module.exports = {
  sgMail,
  msg
}