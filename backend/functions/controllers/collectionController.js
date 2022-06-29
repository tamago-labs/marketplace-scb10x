const validator = require("validator")

const { db } = require("../firebase")
const { algoliaClient } = require("../services/algolia")
const { supportedChains } = require("../constants")

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

    const totalCollections = await db.collection("collections").where("chainId", "in", chains).get()
    const totalCount = totalCollections.size
    // console.log(totalCollections.size)

    let collections = await db.collection("collections").where("chainId", "in", chains).orderBy("activeCount", "desc").limit(+limit || 10).offset(+offset || 0).get()

    if (collections.empty) {
      return res.status(204).json({ message: "empty query return" })
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
    const { address } = req.params
    if (!address) {
      return res.status(400).json({ message: "address is required" })
    }
    let collection = await db.collection("collections").where("address", "==", address).get()
    if (collection.empty) {
      return res.status(200).json({ message: "could not find collection with the given address" })
    }
    collection = collection.docs.map((doc) => ({
      ...doc.data(),
    }))[0]

    res.status(200).json({ status: "ok", collection })
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
      const orderIds = searchResults.hits.reduce((acc, result) => {
        console.log({ acc })
        return [...acc, ...result.activeOrders]
      }, [])

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

exports.updateCollection = async (req, res) => {
  try {
    const { address, chainId, collectionName, slug, description, websiteLink, discordLink, instagramLink, mediumLink, telegramLink } = req.body

    //validates missing inputs
    if (!address || !chainId) {
      return res.status(400).json({ message: "One or more required inputs are missing." })
    }
    //validate valid wallet address
    if (!validator.isEthereumAddress(address)) {
      return res.status(400).json({ message: "Invalid wallet address." })
    }
    //validate that chain is supported
    if (!supportedChains.includes(Number(chainId))) {
      return res.status(400).json({ message: "Invalid chain or chain not supported." })
    }
    const newData = {}
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
        fulfilledCount: 0
      }
      console.log({ ...collectionDoc, ...newData })
      await db.collection("collections").add({ ...collectionDoc, ...newData, })
      return res.status(201).json({ status: "ok", message: "New collection added to database" })
    } else {
      //update existing collection
      let DocID = ""
      collection.forEach(doc => {
        DocID = doc.id
      });
      console.log({ ...newData })
      await db.collection("collections").doc(DocID).set({ ...newData }, { merge: true })
      return res.status(200).json({ status: "ok", message: "Data updated" })
    }
  } catch (error) {
    next(error)
  }
}