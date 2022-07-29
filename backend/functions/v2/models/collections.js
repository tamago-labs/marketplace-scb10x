
const { db } = require("../../firebase")





const getCollectionByChainAndAddress = async (chainId, address) => {
  try {
    const result = await db.collection("collections-v2").doc(`${chainId}.${address}`).get()
    const collection = result.data()
    return collection
  } catch (error) {
    console.log(error)
  }
}

const getCollectionsByChain = async (chainId) => {
  const result = await db.collection("collections-v2").where("chainId", "==", Number(chainId)).get()
  if (result.empty) {

    return []
  } else {
    return result.docs.map(doc => doc.data())
  }
}

module.exports = {
  getCollectionByChainAndAddress,
  getCollectionsByChain
}