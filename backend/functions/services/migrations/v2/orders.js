const { db } = require("../../../firebase")
const { Moralis, MoralisOptions } = require("../../../moralis")
const { btoa } = require("../../../utils")

//The function below resets DB migration to IPFS, Do not Invoke 
const resetMigration = async () => {

  try {
    console.log("resetting migration status and clearing CID for new migration")
      //resetting migration status and clearing CID for new migration
      (await db.collection("orders").get()).docs.map(doc => { doc.ref.update({ isMigrated: false, "CID-v2": "" }) })

      //quell orders V2  
      (await db.collection("orders-V2").get())
      .docs.map(doc => { doc.ref.delete() })

  } catch (error) {
    console.log(error)
  }

}
// resetMigration()

//The Migration Program starts here

exports.migrateOrdersToIPFS = async () => {
  try {

    const orders = (await db.collection("orders").where("isMigrated", "==", false).get()).docs.map(doc => ({ ...doc.data(), docId: doc.id }))

    console.log(orders[orders.length - 1])

    await Moralis.start({ ...MoralisOptions })

    for (let order of orders) {
      const newData = {
        baseAssetTokenId: order.baseAssetTokenId,
        chainId: order.chainId,
        baseAssetAddress: order.baseAssetAddress,
        title: order.title,
        category: order.category,
        timestamp: order.timestamp,
        baseAssetIs1155: order.baseAssetIs1155,
        slug: order.slug,
        barterList: order.barterList,
        ownerAddress: order.ownerAddress,
        crosschain: order.crosschain,
        version: 2
      }
      // console.log(order)
      // console.log(newData)

      //In case of IPFS, file name has no effect
      const file = new Moralis.File("order.json", {
        base64: btoa(JSON.stringify(newData))
      })
      const res = await file.saveIPFS({ useMasterKey: true })

      //saving CID to v2 database
      const CID = res.hash()
      await db.collection("orders-v2").doc(CID).set({
        visible: order.visible,
        locked: order.locked,
        canceled: order.canceled,
        confirmed: order.confirmed,
      })

      await db.collection("orders").doc(order.docId).update({ "isMigrated": true, "CID-v2": CID })
    }
  } catch (error) {
    console.log(error)
  }
}
