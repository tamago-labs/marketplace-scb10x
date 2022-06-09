const { db } = require("../../firebase")
const { ethers } = require("ethers");
require("dotenv").config();
const { getProvider } = require("..")
const { MARKETPLACES } = require("../../constants")
const { MARKETPLACE_ABI } = require("../../abi");
const { FieldValue } = require("firebase-admin/firestore");

const updateHistory = async () => {
  try {


    // check completed order entries in the system 
    console.log("get all orders...")
    const fulfilledOrders = await db.collection("orders").where('version', '==', 1).where('fulfilled', '==', true).get();

    const orders = fulfilledOrders.docs.map((doc) => ({
      DocID: doc.id,
      ...doc.data(),
    }))
    console.log("total orders to be checked : ", orders.length)

    for (const item of orders) {

      //COLLECTIONS
      //creating or updating collections data
      let collection = await db.collection("collections").where('address', '==', item.baseAssetAddress).where('chainId', '==', item.chainId).get()

      if (collection.empty) {
        //creating new firestore collection doc
        const collectionDoc = {
          address: item.baseAssetAddress,
          chainId: item.chainId,
          fulfilledOrders: [item.orderId]
        }
        await db.collection("collections").add(collectionDoc)
      } else {
        // updating existing collection doc
        collection = collection.docs.map((doc) => ({
          DocID: doc.id,
          ...doc.data(),
        }))[0]
        console.log(collection)
        await db.collection("collections").doc(collection.DocID).update({ fulfilledOrders: FieldValue.arrayUnion(item.orderId) })
      }

      //SELLERS

    }


  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  updateHistory
};