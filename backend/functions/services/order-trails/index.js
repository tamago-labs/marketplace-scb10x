const { ethers } = require("ethers");
require("dotenv").config();

const { db } = require("../../firebase")
const { getProvider } = require("../")
const { MARKETPLACES, supportedChains, CLIENT_BASE } = require("../../constants")
const { MARKETPLACE_ABI } = require("../../abi")
const { sgMail, msg } = require("../../sendgrid")
const { getRpcUrl, convertDecimalToHexadecimal } = require("../../utils")
const { composeOrderCancel, composeOrderFulfill } = require("../../utils/emailComposer")

const orderTrails = async () => {
  try {
    // check order entries in the system
    console.log("get all orders...")
    const allOrders = await db.collection("orders").where('version', '==', 1).get();
    const orders = allOrders.docs.map((doc) => ({
      DocID: doc.id,
      ...doc.data(),
    })).filter(doc => doc.visible && doc.confirmed && !doc.fulfilled && !doc.canceled && !doc.crosschain && !doc.locked);

    console.log("total orders to be checked : ", orders.length)
    const updated = []
    for (let order of orders) {

      const { chainId, orderId, DocID, ownerAddress, baseAssetAddress, baseAssetTokenId } = order


      if (supportedChains.indexOf(chainId) !== -1) {

        let rpcUrl = getRpcUrl(chainId)

        // console.log({ rpcUrl })
        const provider = getProvider(rpcUrl)
        // console.log(MARKETPLACE_ABI)
        const { contractAddress } = MARKETPLACES.find(item => item.chainId === chainId)

        // console.log([{ chainId }, { contractAddress }])

        const contract = new ethers.Contract(contractAddress, MARKETPLACE_ABI, provider)

        // console.log({ contract })
        const payload = await contract.orders(orderId)
        // console.log({ payload })

        if (payload["ended"] === true && payload["canceled"] === false) {
          // update order status - fulfilled

          console.log('This order has been fulfilled orderId:', orderId)
          updated.push({ orderId, DocID })

          await db.collection("orders").doc(DocID).set({ fulfilled: true, }, { merge: true })

          console.log("Order ID : ", orderId, " updated as fulfilled")

          //SEND EMAIL UPON ORDER FULFILLMENT
          let account = await db.collection("accounts").where("address", "==", ownerAddress).get()
          if (!account.empty) {
            account = account.docs.map((doc) => ({
              ...doc.data(),
            }))[0]
            if (
              account.email
            ) {
              msg.to = account.email
              msg.subject = `Order ID:${orderId} was fulfilled`
              let nickname
              if (account.nickname === "Unknown" || !account.nickname) {
                nickname = account.email.split('@')[0]
              } else {
                nickname = account.nickname
              }
              let nft = await db.collection("nfts").where("address", "==", baseAssetAddress).where("chain", "==", convertDecimalToHexadecimal(chainId)).where("id", "==", baseAssetTokenId).get()
              if (!nft.empty) {
                nft = nft.docs.map((doc) => ({ ...doc.data() }))[0]
                console.log(nft)
              }
              msg.html = await composeOrderFulfill(nickname || account.email, orderId, nft?.metadata?.image || "", `${CLIENT_BASE}/order/${orderId}`)
              await sgMail.send(msg)
            }
          }

        } else if (payload["ended"] === true && payload["canceled"] === true) {
          //update order status - cancelled
          console.log('This order has been canceled orderId:', orderId)
          updated.push({ orderId, DocID })

          await db.collection("orders").doc(DocID).set({ canceled: true, visible: false }, { merge: true })
          console.log("Order ID : ", orderId, " updated as canceled")
          // SEND EMAIL UPON ORDER CANCELLATION
          let account = await db.collection("accounts").where("address", "==", ownerAddress).get()
          if (!account.empty) {
            account = account.docs.map((doc) => ({
              ...doc.data(),
            }))[0]
            if (
              account.email
            ) {
              msg.to = account.email
              msg.subject = `Order ID:${orderId} was cancelled`
              let nickname
              if (account.nickname === "Unknown" || !account.nickname) {
                nickname = account.email.split('@')[0]
              } else {
                nickname = account.nickname
              }
              let nft = await db.collection("nfts").where("address", "==", baseAssetAddress).where("chain", "==", convertDecimalToHexadecimal(chainId)).where("id", "==", baseAssetTokenId).get()
              if (!nft.empty) {
                nft = nft.docs.map((doc) => ({ ...doc.data() }))[0]
                console.log(nft)
              }
              msg.html = await composeOrderCancel(nickname || account.email, orderId, nft?.metadata?.image || "", `${CLIENT_BASE}/order/${orderId}`)
              // console.log(msg)
              await sgMail.send(msg)
            }
          }
        }

      }

    }

    console.log(updated.length ? { updated } : "No updates during this period.")
  }
  catch (error) {
    console.log(error)
  }
}



module.exports = {
  orderTrails
};