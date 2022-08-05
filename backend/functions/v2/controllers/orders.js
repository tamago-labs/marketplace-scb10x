const { SUPPORTED_CHAINS } = require('../../constants')
const { redisClient } = require("../../redis")
const orderModel = require('../models/orders')

exports.getAllOrders = async (req, res, next) => {
  try {

    //connect to cache
    redisClient.connect()

    const orders = await orderModel.getAllActiveOrders()

    //disconnect from cache
    redisClient.quit()

    return res.json({ status: "ok", orders })
  } catch (error) {
    next(error)
  }
}

exports.getOrdersByChain = async (req, res, next) => {
  try {
    const { chainId } = req.params

    //input validation

    //connect to cache
    redisClient.connect()

    if (!chainId) {
      return res.status(400).json({ message: "Chain ID is required." })
    }
    if (!SUPPORTED_CHAINS.includes(Number(chainId))) {
      return res.status(400).json({ message: "Chain ID is not supported." })
    }
    const orders = await orderModel.getAllOrdersWithChainId(chainId)
    console.log(orders)


    //disconnect from cache
    redisClient.quit()


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