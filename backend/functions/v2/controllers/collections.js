
const { SUPPORTED_CHAINS } = require('../../constants')
const { redisClient } = require("../../redis")
const collectionModel = require('../models/collections')
const orderModel = require('../models/orders')
const validator = require("validator")

exports.getCollectionByChainAndAddress = async (req, res, next) => {
  try {
    const { chain, contractAddress } = req.params
    // input validation
    if (!chain || !contractAddress) {
      return res.status(400).json({ message: "Chain ID and Contract Address required" })
    }
    if (!SUPPORTED_CHAINS.includes(Number(chain))) {
      return res.status(400).json({ message: "This chain is not supported" })
    }
    if (!validator.isEthereumAddress(contractAddress)) {
      return res.status(400).json({ message: "Contract address is invalid" })
    }

    //connect to cache
    redisClient.connect()

    const collection = await collectionModel.getCollectionByChainAndAddress(chain, contractAddress)
    if (!collection) {
      return res.status(503).json({ message: "The collection does not exist in the database. Please contact the backend developer to manually add it." })
    }
    collection.lowestPrice = await collectionModel.getCollectionFloorPrice(collection.chainId, collection.assetAddress)

    //disconnect from cache
    redisClient.quit()

    return res.json({ status: "ok", collection })
  } catch (error) {
    next(error)
  }
}

exports.getCollectionsByChain = async (req, res, next) => {
  try {
    const { chain } = req.params

    //input validation
    if (!chain) {
      return res.status(400).json({ message: "Chain is required as input" })
    }
    if (!SUPPORTED_CHAINS.includes(Number(chain))) {
      return res.status(400).json({ message: "This chain is not supported" })
    }

    //connect to cache
    redisClient.connect()

    const collections = await collectionModel.getCollectionsByChain(chain)
    for (const collection of collections) {
      collection.lowestPrice = await collectionModel.getCollectionFloorPrice(collection.chainId, collection.assetAddress) || 0
    }

    //disconnect from cache
    redisClient.quit()

    return res.json({ status: "ok", collections })
  } catch (error) {
    next(error)
  }
}

// exports.getCollectionBySlug = async (req, res, next) => {
//   try {
//     const { slug } = req.params

//   } catch (error) {
//     next(error)
//   }
// }