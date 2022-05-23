const { db } = require("../firebase")


exports.getAllOrders = async (req, res, next) => {
  try {
    res.status(200).json({ message: "WIP getAllOrders" })
  } catch (error) {
    next(error)
  }
}

exports.getOrder = async (req, res, next) => {
  try {
    res.status(200).json({ message: "WIP getOrder" })
  } catch (error) {
    next(error)
  }
}

exports.createOrder = async (req, res, next) => {
  try {
    res.status(200).json({ message: "WIP createOrder" })
  } catch (error) {
    next(error)
  }
}

exports.confirmOrder = async (req, res, next) => {
  try {
    res.status(200).json({ message: "WIP confirmOrder" })
  } catch (error) {
    next(error)
  }
}

exports.cancelOrder = async (req, res, next) => {
  try {
    res.status(200).json({ message: "WIP cancelOrder" })
  } catch (error) {
    next(error)
  }
}
