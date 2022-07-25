const { db } = require("../../../firebase")
const { Moralis, MoralisOptions } = require("../../../moralis")
const { btoa } = require("../../../utils")
const { NFTStorage } = require('nft.storage')
//Blob is included in node version 15 or higher (Node version 16 recommended)
const { Blob } = require("buffer");

//The function below resets DB migration to IPFS, it deletes all data from "orders-v2" collection, Do not Invoke 
exports.resetMigration = async () => {

  try {

    console.log("resetting migration status and clearing CID for new migration")

    //resetting migration status and clearing CID for new migration

    const a = (await db.collection("orders").get()).docs.map(doc => { doc.ref.update({ isMigrated: false, "CID-v2": "" }) })

    //quell orders V2  
    const b = (await db.collection("orders-v2").get()).docs.map(doc => { doc.ref.delete() })

  } catch (error) {
    console.log(error)
  }

}


//The Migration Program starts here

exports.migrateOrdersToIPFS = async () => {
  try {

    const orders = (await db.collection("orders").where("isMigrated", "==", false).get()).docs.map(doc => ({ ...doc.data(), docId: doc.id }))

    //TODO switch to NFT.storage
    const nftStorage = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY })

    for (let order of orders) {
      const newData = {
        category: order.category,
        timestamp: order.timestamp,
        chainId: order.chainId,
        ownerAddress: order.ownerAddress,
        baseAssetAddress: order.baseAssetAddress,
        baseAssetTokenIdOrAmount: order.baseAssetTokenId,
        baseAssetTokenType: order.baseAssetIs1155 ? 2 : 1,
        barterList: order.barterList,
        title: order.title,
      }

      //In case of IPFS, file name has no effect
      const blob = new Blob([JSON.stringify(newData)])
      const CID = await nftStorage.storeBlob(blob)


      await db.collection("orders-v2").doc(CID).set({
        visible: order.visible,
        locked: order.locked,
        slug: order.slug,
        canceled: order.canceled,
        confirmed: order.confirmed,
        crosschain: order.crosschain,
      })

      await db.collection("orders").doc(order.docId).update({ "isMigrated": true, "CID-v2": CID })
    }
  } catch (error) {
    console.log(error)
  }
}
