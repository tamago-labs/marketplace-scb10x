const validator = require("validator")
const { ethers } = require("ethers")
const { getRpcUrl, recoverAddressFromMessageAndSignature } = require("../utils")
const { getProvider } = require("../services")
const { db } = require("../firebase")
const { algoliaClient } = require("../services/algolia")
const { SUPPORTED_CHAINS } = require("../constants")
const { OWNER_ABI } = require("../abi")
const { WHITELISTED_ADDRESSES } = require("../constants")
const { dbIsBanned } = require("../models/collections")
const { dbGetBannedOrderIds } = require("../models/orders")



exports.getCollections = async (req, res, next) => {
  try {
    const { limit, chain, offset } = req.query

    if (!chain) {
      return res.status(400).json({ message: " chainId required as  query. eg. /collections?chain=80001" })
    }

    let chains = chain.split(',')
    // converting strings to number
    chains.map((chain, index) => {
      chains[index] = +chain
    })

    const totalCollections = await db.collection("collections").where("chainId", "in", chains).where("isBanned", "==", false).get()
    const totalCount = totalCollections.size
    // console.log(totalCollections.size)

    let collections = await db.collection("collections").where("chainId", "in", chains).where("isBanned", "==", false).orderBy("activeCount", "desc").limit(+limit || 10).offset(+offset || 0).get()

    if (collections.empty) {
      return res.status(200).json({ status: "ok", collections: [], totalCount })
    }
    collections = collections.docs.map((doc, index) => ({
      ...doc.data(),
      queryIndex: (+offset || 0) + index + 1
    }))

    // console.log(result)

    res.status(200).json({ status: "ok", collections, totalCount })
  } catch (error) {
    next(error)
  }
}

exports.getCollectionByAddress = async (req, res, next) => {
  try {
    const { address, chainId } = req.params
    if (!address || !chainId) {
      return res.status(400).json({ message: "address and chainId are required" })
    }
    if (!validator.isEthereumAddress(address)) {
      return res.status(400).json({ message: "Invalid wallet address." })
    }
    if (!SUPPORTED_CHAINS.includes(Number(chainId))) {
      return res.status(400).json({ message: "Invalid chain or chain not supported." })
    }
    //get the owner's address from the smart contract
    console.log(chainId)
    const rpcUrl = getRpcUrl(chainId)
    console.log({ rpcUrl })
    const provider = getProvider(rpcUrl)
    const contract = new ethers.Contract(address, OWNER_ABI, provider)
    let ownerAddress
    try {
      ownerAddress = await contract.owner()
    } catch (error) {
      console.log(error)
    }
    console.log({ ownerAddress })

    let collection = await db.collection("collections").where("address", "==", address).where("chainId", "==", Number(chainId)).get()
    if (collection.empty) {

      return res.status(200).json({ status: "ok", collection: { ownerAddress, address, chainId } })
    }
    collection = collection.docs.map((doc) => ({
      ...doc.data(),
    }))[0]

    res.status(200).json({ status: "ok", collection: { ...collection, ownerAddress } })
  } catch (error) {
    next(error)
  }
}

exports, getOwnerAddress = async (req, res, next) => {
  try {
    const { address, chain } = req.params
    if (!address) {
      return res.status(400).json({ message: "address is required" })
    }
  } catch (error) {
    next(error)
  }
}

exports.searchByCollections = async (req, res, next) => {
  try {
    const { query } = req.query
    if (!query || (/^\s*$/.test(query)) || query.length < 3) {
      return res.status(400).json({ message: "The query text cannot be empty and must have minimum length of 3." })
    }
    console.log(query)
    const index = algoliaClient.initIndex("collections")
    await index.setSettings({
      searchableAttributes: [
        'name',
      ]
    })
    const searchResults = await index.search(query)

    if (!searchResults.hits.length) {
      return res.status(404).json({ message: "Sorry, we could not find items matching your search." })
    } else {
      //reducing orderIds to an array
      let orderIds = searchResults.hits.reduce((acc, result) => {
        console.log({ acc })
        return [...acc, ...result.activeOrders]
      }, [])

      //filtering out orders from banned collections
      const bannedOrders = await dbGetBannedOrderIds()
      orderIds = orderIds.filter(order => !(bannedOrders.includes(order)))

      orderIds.sort((a, b) => b - a)
      const results = []
      while (orderIds.length > 0) {
        const currentQuery = orderIds.splice(0, 10)
        if (currentQuery.length > 0) {
          let subQuery = await db.collection("orders").where('orderId', 'in', currentQuery).get()
          subQuery = subQuery.docs.map(doc => ({
            ...doc.data()
          })
          )
          results.push(...subQuery)
        }
      }

      if (results.empty) {
        return res.status(404).json({ message: "Sorry, we could not find items matching your search." })
      } else {
        console.log(results)
        return res.status(200).json({ status: "ok", orders: results })
      }
    }
  } catch (error) {
    next(error)
  }
}

exports.updateCollection = async (req, res, next) => {
  try {
    const { address, chainId, collectionName, slug, description, websiteLink, discordLink, instagramLink, mediumLink, telegramLink, message, signature } = req.body

    //validates missing inputs
    if (!address || !chainId) {
      return res.status(400).json({ message: "One or more required inputs are missing." })
    }

    //preventing banned collection to be updated
    if (await dbIsBanned(address, chainId)) {
      return res.status(400).json({ message: "Hold on, the collection is currently banned and can't be edited" })
    }

    //validate valid wallet address
    if (!validator.isEthereumAddress(address)) {
      return res.status(400).json({ message: "Invalid wallet address." })
    }
    //validate that chain is supported
    if (!SUPPORTED_CHAINS.includes(Number(chainId))) {
      return res.status(400).json({ message: "Invalid chain or chain not supported." })
    }

    //get the owner's address from the smart contract
    const rpcUrl = getRpcUrl(chainId)
    const provider = getProvider(rpcUrl)
    const contract = new ethers.Contract(address, OWNER_ABI, provider)
    let owner
    try {
      owner = await contract.owner()
    } catch (error) {

    }
    console.log({ owner })

    //message and signature for authentication
    if (!message || !signature) {
      return res.status(400).json({ message: "Message and signature are required for authentication." })
    }
    const recoveredAddress = recoverAddressFromMessageAndSignature(message, signature).toLowerCase()

    if (recoveredAddress !== owner?.toLowerCase() || WHITELISTED_ADDRESSES.findIndex((item) => item.toLowerCase() === recoveredAddress) === -1) {
      return res.status(403).json({ message: "You are not allowed to edit this collection." })
    }

    const newData = {}

    newData.lastEditedBy = recoveredAddress

    if (collectionName) {
      newData.name = collectionName
    }
    if (description) {
      newData.description = description
    }
    if (slug) {
      //validates slug
      if (!(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))) {
        return res.status(400).json({ message: "Slug can only contain lowercase letters, numbers, and hyphens. Hyphens can not be adjacent." })
      }
      if (slug.length < 3) {
        return res.status(400).json({ message: "Slug needs to be at least 3 characters." })
      }
      if (validator.isEthereumAddress(slug)) {
        return res.status(400).json({ message: "slugs in wallet address format are not accepted to avoid potential technical errors." })
      }
      //check if the slug was already taken by other collection document
      let duplicate = await db.collection("collections").where("slug", "==", slug).get()
      if (!duplicate.empty) {
        return res.status(409).json({ message: "Another collection with this slug already exists." })
      }
      newData.slug = slug
    }
    if (websiteLink) {
      if (!validator.isURL(websiteLink)) {
        return res.status(400).json({ message: "Link to your website is not in proper format." })
      }
      newData.websiteLink = websiteLink
    }
    if (discordLink) {
      if (!validator.isURL(discordLink)) {
        return res.status(400).json({ message: "Link to your Discord is not in proper format." })
      }
      newData.discordLink = discordLink
    }
    if (instagramLink) {
      if (!validator.isURL(instagramLink)) {
        return res.status(400).json({ message: "Link to your Instagram is not in proper format." })
      }
      newData.instagramLink = instagramLink
    }
    if (mediumLink) {
      if (!validator.isURL(mediumLink)) {
        return res.status(400).json({ message: "Link to your Medium is not in proper format." })
      }
      newData.mediumLink = mediumLink
    }
    if (telegramLink) {
      if (!validator.isURL(telegramLink)) {
        return res.status(400).json({ message: "Link to your Telegram is not in proper format." })
      }
      newData.telegramLink = telegramLink
    }
    console.log(newData)

    //search for existing document in collections database
    let collection = await db.collection("collections").where("address", "==", address).where("chainId", "==", Number(chainId)).get()

    if (collection.empty) {
      //create new collection
      const collectionDoc = {
        address: address,
        chainId: chainId,
        activeOrders: [],
        activeCount: 0,
        fulfilledOrders: [],
        fulfilledCount: 0,
        isBanned: false,
        lastEditedBy: recoveredAddress
      }
      console.log({ ...collectionDoc, ...newData })
      await db.collection("collections").add({ ...collectionDoc, ...newData, })
      return res.status(201).json({ status: "ok", created: { ...collectionDoc, ...newData } })
    } else {
      //update existing collection
      let DocID = ""
      collection.forEach(doc => {
        DocID = doc.id
      });
      console.log({ ...newData })
      await db.collection("collections").doc(DocID).set({ ...newData }, { merge: true })
      return res.status(200).json({ status: "ok", updated: newData })
    }
  } catch (error) {
    next(error)
  }
}

exports.banCollection = async (req, res, next) => {
  try {
    const { chainId, address, message, signature } = req.body

    //message and signature for authentication
    if (!message || !signature) {
      return res.status(400).json({ message: "Message and signature are required for authentication." })
    }
    const recoveredAddress = recoverAddressFromMessageAndSignature(message, signature).toLowerCase()

    if (WHITELISTED_ADDRESSES.findIndex((item) => item.toLowerCase() === recoveredAddress) === -1) {
      return res.status(403).json({ message: "Access denied." })
    }

    if (!chainId || !address) {
      return res.status(400).json({ message: "Some required inputs missing." })
    }

    //validate valid wallet address
    if (!validator.isEthereumAddress(address)) {
      return res.status(400).json({ message: "Invalid wallet address." })
    }
    //validate that chain is supported
    if (!SUPPORTED_CHAINS.includes(Number(chainId))) {
      return res.status(400).json({ message: "Invalid chain or chain not supported." })
    }

    let collection = await db.collection("collections").where("address", "==", address).where("chainId", "==", chainId).get()

    if (collection.empty) {
      return res.status(404).json({ status: "ok", message: "Target collection does not exist." })
    }
    let DocID = ""
    collection.forEach(doc => {
      DocID = doc.id
    });
    collection = collection.docs.map(doc => ({ ...doc.data() }))
    if (collection.isBanned) {
      return res.status(400).json({ message: "Error. The collection is already banned." })
    }
    await db.collection("collections").doc(DocID).set({ isBanned: true }, { merge: true })
    return res.status(200).json({ message: "collection banned" })
  } catch (error) {
    next(error)
  }
}

exports.unBanCollection = async (req, res, next) => {
  try {
    const { chainId, address, message, signature } = req.body

    //message and signature for authentication
    if (!message || !signature) {
      return res.status(400).json({ message: "Message and signature are required for authentication." })
    }
    const recoveredAddress = recoverAddressFromMessageAndSignature(message, signature).toLowerCase()

    if (WHITELISTED_ADDRESSES.findIndex((item) => item.toLowerCase() === recoveredAddress) === -1) {
      return res.status(403).json({ message: "Access denied." })
    }

    //validate valid wallet address
    if (!validator.isEthereumAddress(address)) {
      return res.status(400).json({ message: "Invalid wallet address." })
    }
    //validate that chain is supported
    if (!SUPPORTED_CHAINS.includes(Number(chainId))) {
      return res.status(400).json({ message: "Invalid chain or chain not supported." })
    }

    const collection = await db.collection("collections").where("address", "==", address).where("chainId", "==", chainId).get()

    if (collection.empty) {
      return res.status(404).json({ message: "Target collection does not exist." })
    }
    let DocID = ""
    collection.forEach(doc => {
      DocID = doc.id
    });
    collection = collection.docs.map(doc => ({ ...doc.data() }))
    if (!collection.isBanned) {
      return res.status(400).json({ message: "Error. The collection is already not banned." })
    }
    await db.collection("collections").doc(DocID).set({ isBanned: false }, { merge: true })
    return res.status(200).json({ status: "ok", message: "collection unbanned" })
  } catch (error) {
    next(error)
  }
}