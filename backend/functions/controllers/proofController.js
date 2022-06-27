const { db } = require("../firebase")
const { ethers } = require("ethers")
const { MerkleTree } = require("merkletreejs")
const keccak256 = require("keccak256")
const { generateRelayMessages, generateValidatorMessages } = require("../utils")

exports.generateSwapProof = async (req, res, next) => {
  try {

    if (!req || !req.body) {
      return res.status(400).json({ message: "one or more required inputs missing." })
    }
    const { order: _order, chainId, tokenIndex } = req.body

    if (!(_order && chainId && tokenIndex)) {
      return res.status(400).json({ message: "one or more required inputs missing." })
    }
    // console.log("getting order with ID: ", id)
    let order = await db.collection('orders').where('orderId', '==', Number(_order.orderId)).where('version', '==', 1).get()
    if (order.empty) {
      return res.status(400).json({ message: "order with this ID does not exist" })
    }
    let result = []
    order.forEach(doc => {
      result.push(doc.data())
    });

    order = result[0]

    // console.log(order)

    const token = order.barterList[tokenIndex]

    const leaves = order.barterList.filter(item => item.chainId === chainId).map(item => ethers.utils.keccak256(ethers.utils.solidityPack(["address", "uint256"], [item.assetAddress, item.assetTokenIdOrAmount])))
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
    // console.log(tree)

    const proof = tree.getHexProof(ethers.utils.keccak256(ethers.utils.solidityPack(["address", "uint256"], [token.assetAddress, token.assetTokenIdOrAmount])))

    res.status(200).json({ status: "ok", order: _order, chainId, tokenIndex, proof, })
  } catch (error) {
    next(error)
  }
}
exports.generatePartialSwapProof = async (req, res, next) => {
  try {

    if (!req || !req.body) {
      return res.status(400).json({ message: "one or more required inputs missing." })
    }
    const { order, token } = req.body

    if (!(order && token)) {
      return res.status(400).json({ message: "one or more required inputs missing." })
    }


    const messages = await generateRelayMessages()
    // console.log(messages)

    const leaves = messages.map(({ orderId, chainId, assetAddress, assetTokenIdOrAmount }) => ethers.utils.keccak256(ethers.utils.solidityPack(["uint256", "uint256", "address", "uint256"], [orderId, chainId, assetAddress, assetTokenIdOrAmount]))) // Order ID, Chain ID, Asset Address, Token ID
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })

    const proof = tree.getHexProof(ethers.utils.keccak256(ethers.utils.solidityPack(["uint256", "uint256", "address", "uint256"], [order.orderId, token.chainId, token.assetAddress, token.assetTokenIdOrAmount])))


    res.status(200).json({ status: "ok", order, token, proof })
  } catch (error) {
    next(error)
  }
}
exports.generateClaimProof = async (req, res, next) => {
  try {

    if (!req || !req.body) {
      return res.status(400).json({ message: "one or more required inputs missing." })
    }
    const { order, account } = req.body

    if (!(order && account)) {
      return res.status(400).json({ message: "one or more required inputs missing." })
    }

    const messages = await generateValidatorMessages()
    // console.log(messages)
    const leaves = messages.map(({ orderId, chainId, claimerAddress, isOrigin }) => ethers.utils.keccak256(ethers.utils.solidityPack(["uint256", "uint256", "address", "bool"], [orderId, chainId, claimerAddress, isOrigin]))) // Order ID, Chain ID, Claimer Address, Is Origin Chain
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true })
    // console.log(tree)

    const proof = tree.getHexProof(ethers.utils.keccak256(ethers.utils.solidityPack(["uint256", "uint256", "address", "bool"], [order.orderId, order.chainId, account, true])))

    res.status(200).json({ status: "ok", order, account, proof })
  } catch (error) {
    next(error)
  }
}

exports.generateRelayMessages = async (req, res, next) => {
  try {
    const messages = await generateRelayMessages()
    res.status(200).json({ status: "ok", messages })
  } catch (error) {
    next(error)
  }
}

exports.generateValidatorMessages = async (req, res, next) => {
  try {
    const claims = await generateValidatorMessages()
    //TODO : (This task has been postponed for now) decide on how to cache this proof
    res.status(200).json({ status: "ok", claims })
  } catch (error) {
    next(error)
  }
}