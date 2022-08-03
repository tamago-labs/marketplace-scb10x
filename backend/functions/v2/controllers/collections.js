
const { supportedChains } = require('../../constants')
const collectionModel = require('../models/collections')
const validator = require("validator")

exports.getCollectionByChainAndAddress = async (req, res, next) => {
  try {
    const { chain, contractAddress } = req.params
    if (!chain || !contractAddress) {
      return res.status(400).json({ message: "Chain ID and Contract Address required" })
    }
    if (!supportedChains.includes(Number(chain))) {
      return res.status(400).json({ message: "This chain is not supported" })
    }
    if (!validator.isEthereumAddress(contractAddress)) {
      return res.status(400).json({ message: "Contract address is invalid" })
    }
    const collection = await collectionModel.getCollectionByChainAndAddress(chain, contractAddress)
    if (!collection) {
      return res.status(503).json({ message: "The collection does not exist in the database. Please contact the backend developer to manually add it." })
    }
    collection.lowestPrice = await collectionModel.getFloorPrice(collection.chainId, collection.assetAddress)
    //check for empty object
    return res.json({ status: "ok", collection })
  } catch (error) {
    next(error)
  }
}

exports.getCollectionsByChain = async (req, res, next) => {
  try {
    const { chain } = req.params
    if (!chain) {
      return res.status(400).json({ message: "Chain is required as input" })
    }
    if (!supportedChains.includes(Number(chain))) {
      return res.status(400).json({ message: "This chain is not supported" })
    }
    const collections = await collectionModel.getCollectionsByChain(chain)
    for (const collection of collections) {
      collection.lowestPrice = await collectionModel.getFloorPrice(collection.chainId, collection.assetAddress)
    }
    console.log(collections)
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