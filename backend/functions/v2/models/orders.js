const axios = require("axios")

const { redisClient } = require("../../redis")
const { db } = require("../../firebase")

// ! Redis connection required to use caches

const getIpfsDataByCid = async (cid) => {
  const url = `https://${cid}.ipfs.infura-ipfs.io/`
  const res = await axios.get(url)
  // console.log(res.data)
  return res.data
}

const refreshOrderCache = async () => {
  // ! modification may be needed later
  const queryResult = await db.collection("orders-v2").get()
  const activeOrderCids = (queryResult.docs.map(item => item.id))

  //requesting all orders in parallel

  const ordersData = await Promise.allSettled(activeOrderCids.map(cid => getIpfsDataByCid(cid)))


  ordersData.sort((a, b) => Number(b.value.timestamp) - Number(a.value.timestamp))

  flattenedOrderData = ordersData.map(item => item.value)

  console.log(flattenedOrderData.length)

  await redisClient.set("orders", JSON.stringify(flattenedOrderData))

  return ordersData
}


const getAllActiveOrders = async () => {
  try {
    const orders = await redisClient.get("orders")

    if (orders === null) {
      //retrieve all orders
      // console.log("No cache found, retrieving data from IPFS")
      const activeOrdersData = await refreshOrderCache()
      return activeOrdersData

    } else {
      //sending the cache to frontend
      // console.log("Cache found, sending data to frontend")
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
  getAllOrdersWithChainId,
  refreshOrderCache,
}