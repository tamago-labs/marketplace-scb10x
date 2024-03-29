const { db } = require("../../firebase");
const { getTotalOwners, getTotalSupply } = require("../../v2/models/collections");

const updateCollections = async () => {
  try {
    const result = await db.collection("collections-v2").get()
    const collections = result.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    for (let collection of collections) {
      // 259200000 === THREE DAYS
      if (!collection.lastSyncTimestamp || Date.now() - collection.lastSyncTimestamp > 259200000) {
        //updateTotalOwnersAndItemsCount
        console.log(collection.id)
        const newData = {
          lastSyncTimestamp: Date.now(),
          totalOwners: await getTotalOwners(collection.chainId, collection.assetAddress),
          totalSupply: await getTotalSupply(collection.chainId, collection.assetAddress),
        }
        await db.collection("collections-v2").doc(collection.id).set({ ...newData }, { merge: true })
      }
    }
  } catch (error) {
    console.log(error)
  }

}
module.exports = {
  updateCollections
}