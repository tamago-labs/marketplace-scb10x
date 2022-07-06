const fs = require('fs')
const path = require('path')
const Handlebars = require("handlebars")

const composeOrderConfirm = async (username, orderId, nftImage, orderLink) => {
  try {
    const source = fs.readFileSync(path.resolve(__dirname, "..", "templates", "sendgrid", "orderConfirmation.html"))
    const template = Handlebars.compile(String(source))
    const data = { username, orderId, nftImage, orderLink }
    // console.log(template(data))
    return template(data)
  } catch (error) {
    console.log(error)
  }
}

const composeOrderCancel = async (
  username, orderId, nftImage, orderLink
) => {
  try {
    const source = fs.readFileSync(path.resolve(__dirname, "..", "templates", "sendgrid", "orderCancelation.html"))
    const template = Handlebars.compile(String(source))
    const data = { username, orderId, nftImage, orderLink }
    // console.log(template(data))
    return template(data)
  } catch (error) {
    console.log(error)
  }
}

const composeOrderFulfill = async (
  username, orderId, nftImage, orderLink
) => {
  try {
    const source = fs.readFileSync(path.resolve(__dirname, "..", "templates", "sendgrid", "orderFulfillment.html"))
    const template = Handlebars.compile(String(source))
    const data = { username, orderId, nftImage, orderLink }
    // console.log(template(data))
    return template(data)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  composeOrderConfirm,
  composeOrderCancel,
  composeOrderFulfill
}