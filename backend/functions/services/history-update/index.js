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
    let orders = await db.collection("orders").where('version', '==', 1).get();

    orders = orders.docs.map((doc) => ({
      DocID: doc.id,
      ...doc.data(),
    }))
    console.log("total orders to be checked : ", orders.length)

    for (const order of orders) {

      //COLLECTIONS
      //creating or updating collection doc
      console.log(order)
      let collection = await db.collection("collections").where('address', '==', order.baseAssetAddress).where('chainId', '==', order.chainId).get()

      if (collection.empty) {
        //creating new firestore collection doc
        const collectionDoc = {
          address: order.baseAssetAddress,
          chainId: order.chainId,
          activeOrders: [],
          fulfilledOrders: []
        }
        if (order.fulfilled) {
          collectionDoc.fulfilledOrders.push(order.orderId)
        }
        else if (order.visible && !order.cancelled) {
          collectionDoc.activeOrders.push(order.orderId)
        }
        await db.collection("collections").add(collectionDoc)
      } else {
        // updating existing collection doc
        collection = collection.docs.map((doc) => ({
          DocID: doc.id,
          ...doc.data(),
        }))[0]
        console.log(collection)
        if (order.fulfilled) {
          await db.collection("collections").doc(collection.DocID).update({ fulfilledOrders: FieldValue.arrayUnion(order.orderId) })
          await db.collection("collections").doc(collection.DocID).update({ activeOrders: FieldValue.arrayRemove(order.orderId) })

        } else if (order.visible && !order.cancelled) {
          await db.collection("collections").doc(collection.DocID).update({ activeOrders: FieldValue.arrayUnion(order.orderId) })
        }
      }

      //SELLERS
      //creating or updating user doc
      // let user = await db.collection("users").where('address','==',order.)
    }


  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  updateHistory
};