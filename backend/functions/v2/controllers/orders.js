const { SUPPORTED_CHAINS } = require('../../constants')
const orderModel = require('../models/orders')

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.getAllActiveOrders()
    return res.json({ status: "ok", orders })
  } catch (error) {
    next(error)
  }
}

exports.getOrdersByChain = async (req, res, next) => {
  try {
    const { chainId } = req.params
    if (!chainId) {
      return res.status(400).json({ message: "Chain ID is required." })
    }
    if (!SUPPORTED_CHAINS.includes(Number(chainId))) {
      return res.status(400).json({ message: "Chain ID is not supported." })
    }
    const orders = await orderModel.getAllOrdersWithChainId(chainId)
    console.log(orders)
    return res.json({ status: "ok", chainId, orders })
  } catch (error) {
    next(error)
  }
}

exports.refreshOrderCache = async (req, res, next) => {
  try {
    await orderModel.refreshOrderCache()
    return res.json({ status: "ok", message: "cache refreshed" })
  } catch (error) {
    next(error)
  }
}