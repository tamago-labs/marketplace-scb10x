const { db } = require("../firebase")


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
      return res.status(204).json({ message: "empty query return" })
    }
    collection = collection.docs.map((doc) => ({
      ...doc.data(),
    }))[0]

    res.status(200).json({ status: "ok", collection })
  } catch (error) {
    next(error)
  }
}