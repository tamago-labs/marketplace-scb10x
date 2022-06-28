const { db } = require("../../firebase")
const { ethers } = require("ethers");
require("dotenv").config();

const { getProvider } = require("../")
const { MARKETPLACES } = require("../../constants")
const { MARKETPLACE_ABI } = require("../../abi")
const { supportedChains } = require("../../constants")
const { sgMail, msg } = require("../../sendgrid")

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

      const { chainId, orderId, DocID, ownerAddress } = order


      if (supportedChains.indexOf(chainId) !== -1) {

        let rpcUrl

        switch (chainId) {
          case 1:
            rpcUrl = process.env.MAINNET_RPC_SERVER
            break;
          case 42:
            rpcUrl = process.env.KOVAN_RPC_SERVER
            break;
          case 56:
            rpcUrl = process.env.BNB_RPC_SERVER
            break;
          case 97:
            rpcUrl = process.env.BNB_TESTNET_RPC_SERVER
            break;
          case 137:
            rpcUrl = process.env.POLYGON_RPC_SERVER
            break;
          case 43113:
            rpcUrl = process.env.FUJI_RPC_SERVER
            break;
          case 43114:
            rpcUrl = process.env.AVALANCHE_C_CHAIN_RPC
            break;
          case 80001:
            rpcUrl = process.env.MUMBAI_RPC_SERVER
            break;
          default:
            break;
        }
        // console.log({ rpcUrl })
        const provider = getProvider(rpcUrl)
        // console.log(MARKETPLACE_ABI)
        const { contractAddress } = MARKETPLACES.find(item => item.chainId === chainId)

        // console.log([{ chainId }, { contractAddress }])

        const contract = new ethers.Contract(contractAddress, MARKETPLACE_ABI, provider)

        // console.log({ contract })
        const payload = await contract.orders(orderId)

        // console.log({ payload })

        // update order status
        if (payload["ended"] === true) {

          console.log('This order has ended orderId:', orderId)
          updated.push({ orderId, DocID })

          await db.collection("orders").doc(DocID).set({ fulfilled: true, }, { merge: true })

          console.log("Order ID : ", orderId, " updated successfully")

          //SEND EMAIL UPON ORDER FULFILLMENT
          let account = await db.collection("accounts").where("address", "==", ownerAddress).get()
          if (!account.empty) {
            account = account.docs.map((doc) => ({
              ...doc.data(),
            }))[0]
            if (
              account.email === "pongzthor@gmail.com" // TODO: Important! this needs to be changed!
            ) {
              msg.to = account.email
              msg.subject = "Your order was fulfilled"
              msg.html = `<p>Congratulations! Your order with Id: ${order.orderId} was fulfilled.</p><br><strong>Tamago Team</strong>`
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