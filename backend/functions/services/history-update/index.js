const { db } = require("../../firebase")
require("dotenv").config();
// const { ethers } = require("ethers");
// const { getProvider } = require("..")
// const { MARKETPLACES } = require("../../constants")
// const { MARKETPLACE_ABI } = require("../../abi");
const { FieldValue } = require("firebase-admin/firestore");
const { getOwnerName } = require("../../utils")

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
      // console.log(order)
      let collection = await db.collection("collections").where('address', '==', order.baseAssetAddress).where('chainId', '==', order.chainId).get()

      if (collection.empty) {
        //creating new firestore collection doc
        const collectionDoc = {
          address: order.baseAssetAddress,
          chainId: order.chainId,
          name: 'Unknown',
          activeOrders: [],
          activeCount: 0,
          fulfilledOrders: [],
          fulfilledCount: 0
        }

        let nft = await db.collection("nfts").where('address', '==', order.baseAssetAddress).get()
        nft = nft.docs.map((doc) => ({
          DocID: doc.id,
          ...doc.data(),
        }))[0]
        if (nft) {
          console.log(nft.metadata.name)
          collectionDoc.name = nft.metadata.name
        }

        if (order.fulfilled) {
          collectionDoc.fulfilledOrders.push(order.orderId)
          collectionDoc.fulfilledCount = 1
        }
        else if (order.visible && !order.cancelled) {
          collectionDoc.activeOrders.push(order.orderId)
          collectionDoc.activeCount = 1
        }
        await db.collection("collections").add(collectionDoc)
      } else {
        // updating existing collection doc
        collection = collection.docs.map((doc) => ({
          DocID: doc.id,
          ...doc.data(),
        }))[0]
        // console.log(collection)

        // UPDATING COLLECTION NAME, not required in most cases
        // let nft = await db.collection("nfts").where('address', '==', order.baseAssetAddress).get()
        // nft = nft.docs.map((doc) => ({
        //   DocID: doc.id,
        //   ...doc.data(),
        // }))[0]
        // if (nft && collection.name !== nft.metadata.name) {
        //   console.log(nft.metadata.name)
        //   await db.collection("collections").doc(collection.DocID).update({ name: nft.metadata.name })
        // }

        if (order.fulfilled) {
          await db.collection("collections").doc(collection.DocID).update({ fulfilledOrders: FieldValue.arrayUnion(order.orderId), fulfilledCount: collection.fulfilledOrders.length })
          await db.collection("collections").doc(collection.DocID).update({ activeOrders: FieldValue.arrayRemove(order.orderId), activeCount: collection.activeOrders.length })

        } else if (order.visible && !order.cancelled) {
          await db.collection("collections").doc(collection.DocID).update({ activeOrders: FieldValue.arrayUnion(order.orderId), activeCount: collection.activeOrders.length })
        }
      }

      //SELLERS
      //creating or updating user doc
      let user = await db.collection("users").where('address', '==', order.ownerAddress).get()

      if (user.empty) {
        const name = await getOwnerName(order.ownerAddress)
        console.log(name)
        //creating new firestore collection doc
        const collectionDoc = {
          address: order.ownerAddress,
          activeSells: [],
          activeSellCount: 0,
          sold: [],
          soldCount: 0,
          name: name,
          // bought: [],
          // boughtCount: 0
        }
        if (order.fulfilled) {
          collectionDoc.sold.push(order.orderId)
          collectionDoc.soldCount = 1
        }
        else if (order.visible && !order.cancelled) {
          collectionDoc.activeSells.push(order.orderId)
          collectionDoc.activeSellCount = 1
        }
        await db.collection("users").add(collectionDoc)
      } else {

        user = user.docs.map((doc) => ({
          DocID: doc.id,
          ...doc.data(),
        }))[0]

        // UPDATING USER'S NAME, not required in most cases
        // const name = await getOwnerName(order.ownerAddress)
        // console.log(name)
        // if (!user.name || user.name !== name) {
        //   await db.collection("users").doc(user.DocID).update({ name: name })
        // }

        // updating existing collection doc
        if (order.fulfilled) {
          await db.collection("users").doc(user.DocID).update({ sold: FieldValue.arrayUnion(order.orderId), soldCount: user.sold.length })
          await db.collection("users").doc(user.DocID).update({ activeSells: FieldValue.arrayRemove(order.orderId), activeSellCount: user.activeSells.length })
        }
        else if (order.visible && !order.cancelled) {
          await db.collection("users").doc(user.DocID).update({ activeSells: FieldValue.arrayUnion(order.orderId), activeSellCount: user.activeSells.length })
        }
      }
    }


  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  updateHistory
};