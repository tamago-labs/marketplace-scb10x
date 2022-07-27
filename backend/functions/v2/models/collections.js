
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


module.exports = {
  getCollectionByChainAndAddress
}