const { db } = require("../firebase")
const { dbGetBannedCollections } = require("./collections")

exports.dbGetBannedOrderIds = async () => {
  try {
    //returns array of banned orderIds
    return (await dbGetBannedCollections()).reduce((result, collection) => [...result, ...collection.activeOrders], [])
  } catch (error) {
    console.log(error)
  }
}
