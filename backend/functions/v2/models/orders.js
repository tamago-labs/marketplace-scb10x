const axios = require("axios")

const { redisClient } = require("../../redis")
const { db } = require("../../firebase")


const getIpfsDataByCid = async (cid) => {
  const url = `https://${cid}.ipfs.infura-ipfs.io/`
  const res = await axios.get(url)
  console.log(res.data)
  return res.data
}


const getAllActiveOrders = async () => {
  try {
    await redisClient.connect()
    const orders = await redisClient.get("orders")

    if (orders === null) {
      //retrieve all orders
      console.log("No cache found, retrieving data from IPFS")
      // ! modification may be needed later
      const queryResult = await db.collection("orders-v2").where("canceled", "==", false).where("confirmed", "==", true).where("locked", "==", false).where("visible", "==", true).get()
      const activeOrderCids = (queryResult.docs.map(item => item.id))

      //requesting all orders in parallel

      const activeOrdersData = await Promise.all(activeOrderCids.map(cid => getIpfsDataByCid(cid)))
      activeOrdersData.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
      await redisClient.set("orders", JSON.stringify(activeOrdersData))
      return activeOrdersData

    } else {
      //sending the cache to frontend
      console.log("Cache found, sending data to frontend")
      return JSON.parse(orders)
    }

  } catch (error) {
    console.log(error)
  }
}

const getAllOrdersWithChainId = async (chainId) => {
  try {
    const allOrders = await getAllActiveOrders()
    const orders = allOrders.filter(item => Number(item.chainId) === Number(chainId))
    return orders
  } catch (error) {
    console.log(error)
  }
}


module.exports = {
  getAllActiveOrders,
  getAllOrdersWithChainId
}