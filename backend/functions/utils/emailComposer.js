const fs = require('fs')
const path = require('path')
const Handlebars = require("handlebars")

exports.composeOrderConfirm = async (username, orderId, nftImage, orderLink) => {
  try {
    const source = fs.readFileSync(path.resolve(__dirname, "..", "templates", "sendgrid", "orderConfirmation.html"))
    const template = Handlebars.compile(source)
    const data = { username, orderId, nftImage, orderLink }
    return template(data)
  } catch (error) {
    console.log(error)
  }
}

exports.composeOrderCancel = async (
  //TODO
) => {
  try {
    //TODO
  } catch (error) {
    console.log(error)
  }
}

exports.composeOrderFulfill = async (
  //TODO 
) => {
  try {
    //TODO
  } catch (error) {
    console.log(error)
  }
}

