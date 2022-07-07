// const fs = require('fs')
// const path = require('path')
// const Handlebars = require('handlebars')
const _sgMail = require('@sendgrid/mail')

require('dotenv').config()


const sgMail = _sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const msg = {
  to: 'user email here',
  from: {
    name: 'Tamago Finance Team',
    email: 'no-reply@tamago.finance'
  },
  subject: 'subject here',
  html: '<strong>email body here</strong>',

}


// const testSendingMail = async () => {
//   // 

//   try {
//     const templateSource = fs.readFileSync(path.resolve(__dirname, "templates", "sendgrid", "orderConfirmation.html"), "utf-8")
//     const template = Handlebars.compile(templateSource)
//     const data = { "Sender_Name": "Moo", "Sender_Address": "123 Grove Street", "Sender_City": "Liberty City", "Sender_State": "Michigan", "Sender_Zip": "10110" }
//     msg.html = template(data)
//     await sgMail.send(msg).then((res) => { console.log("email submitted to sendgrid") }).catch((err) => { console.log(err.response.body.errors) })
//   } catch (error) {
//     console.log("error" + error)

//   }
// }


module.exports = {
  sgMail,
  msg,
  // testSendingMail
}