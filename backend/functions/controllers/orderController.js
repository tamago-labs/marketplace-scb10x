const { db } = require("../firebase")
const { ethers } = require("ethers");

exports.getAllOrders = async (req, res, next) => {
  console.log("get all orders...")
  try {
    const chainQuery = req.query.chain
    let allOrders
    // console.log(queries)
    if (chainQuery) {
      // console.log(chainQuery)
      const chains = chainQuery.split(',')
      // console.log(chains)
      chains.map((chain, index) => {
        chains[index] = +chain
      })
      // console.log(chains)
      allOrders = await db.collection("orders").where("chainId", "in", chains).where('version', '==', 1).get();

    } else {
      allOrders = await db.collection("orders").where('version', '==', 1).get();
    }
    const result = allOrders.docs.map((doc) => ({
      ...doc.data(),
    })).filter(doc => doc.visible);
    console.log(result)
    res.status(200).json({ status: "ok", orders: result })
  } catch (error) {
    next(error)
  }
}

exports.getOrder = async (req, res, next) => {
  try {
    if (!req || !req.params) {
      return res.status(400).json({ message: "missing query params" })
    }
    const { id } = req.params
    console.log("getting order with ID: ", id)
    const order = await db.collection('orders').where('orderId', '==', Number(id)).where('version', '==', 1).get()
    if (order.empty) {
      return res.status(400).json({ message: "order with this ID does not exist" })
    }
    let result = []
    order.forEach(doc => {
      result.push(doc.data())
    });

    res.status(200).json({ status: "ok", order: result[0] })
  } catch (error) {
    next(error)
  }
}

exports.createOrder = async (req, res, next) => {
  console.log("Creating a new order")
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: " req.body missing " })
    }
    console.log(req.body)

    //getting all orders
    const allOrders = await db.collection("orders").get();
    const result = allOrders.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    //assigning orderId
    const orderId = result.reduce((result, item) => {
      if (Number(item.orderId) > result) {
        result = Number(item.orderId)
      }
      return result
    }, 0) + 1
    console.log("Creating order with ID:", orderId)

    const orderItem = {
      ...req.body,
      "version": 1,
      "orderId": orderId,
      "confirmed": false,
      "visible": false,
      "canceled": false,
      "locked": false,
      "timestamp": Math.floor(new Date().valueOf() / 1000)
    }

    console.log(orderItem)

    await db.collection('orders').add(orderItem)

    res.status(200).json({ status: "ok", body: req.body, orderId })
  } catch (error) {
    next(error)
  }
}

exports.confirmOrder = async (req, res, next) => {
  console.log("Confirming an order")
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: " req.body missing " })
    }
    console.log(req.body)
    const { orderId, message, signature } = req.body
    if (!orderId || !message || !signature) {
      return res.status(400).json({ message: "some or all required fields are missing" })
    }
    const order = await db.collection('orders').where('orderId', '==', Number(orderId)).where('version', '==', 1).get()
    if (order.empty) {
      return res.status(400).json({ message: "order with this ID does not exist" })
    }
    let Item = {}
    let DocID = ""
    order.forEach(doc => {
      Item = doc.data()
      DocID = doc.id
    });
    console.log({ Item })
    const ownerAddress = Item.ownerAddress
    const recoveredAddress = ethers.utils.verifyMessage(message, signature)
    console.log("Verifying order's owner address :  ", ownerAddress)
    console.log("Recovered address : ", recoveredAddress)

    if (recoveredAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
      return res.status(400).json({ message: "You are not authorized to confirm the order" })
    }
    console.log("Saving: \n", Item)
    await db.collection("orders").doc(DocID).set({ confirmed: true, visible: true }, { merge: true })

    res.status(200).json({ status: "ok", orderId })
  } catch (error) {
    next(error)
  }
}

exports.cancelOrder = async (req, res, next) => {
  console.log("Cancelling an order")
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: " req.body missing " })
    }
    console.log(req.body)
    const { orderId, message, signature } = req.body
    if (!orderId || !message || !signature) {
      return res.status(400).json({ message: "some or all required fields are missing" })
    }
    const order = await db.collection('orders').where('orderId', '==', Number(orderId)).where('version', '==', 1).get()
    if (order.empty) {
      return res.status(400).json({ message: "order with this ID does not exist" })
    }
    let Item = {}
    let DocID = ""
    order.forEach(doc => {
      Item = doc.data()
      DocID = doc.id
    });
    console.log({ Item })
    const ownerAddress = Item.ownerAddress
    const recoveredAddress = ethers.utils.verifyMessage(message, signature)
    console.log("Verifying order's owner address :  ", ownerAddress)
    console.log("Recovered address : ", recoveredAddress)

    if (recoveredAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
      return res.status(400).json({ message: "You are not authorized to cancel the order" })
    }
    console.log("Saving: \n", Item)
    await db.collection("orders").doc(DocID).set({ cancelled: true }, { merge: true })

    res.status(200).json({ status: "ok", orderId })
  } catch (error) {
    next(error)
  }
}

exports.getOrdersByCollection = async (req, res, next) => {
  console.log("getting orders by collection...")
  try {
    if (!req || !req.params) {
      return res.status(400).json({ message: "missing query params" })
    }
    const { address } = req.params
    const orders = await db.collection("orders")
      .where('version', '==', 1)
      .where('visible', '==', true)
      .get()
    let result = orders.docs.map((doc) => ({
      ...doc.data(),
    })).filter(doc => doc.barterList.filter(item => item.assetAddress === address).length !== 0);
    console.log(result)

    if (!result.length) {
      return res.status(400).json({ message: "orders with this collection address does not exist" })
    }


    res.status(200).json({ status: "ok", orders: result })


  } catch (error) {
    next(error)
  }
}

exports.getOrdersByOwner = async (req, res, next) => {
  console.log("getting orders by owner...")
  try {
    if (!req || !req.params) {
      return res.status(400).json({ message: "missing query params" })
    }
    // console.log(req.params)
    const { owner } = req.params
    const orders = await db.collection("orders")
      .where('version', '==', 1)
      .where('visible', '==', true)
      .where("ownerAddress", "==", owner)
      .get()

    if (orders.empty) {
      return res.status(400).json({ message: "orders with this creator address does not exist" })
    }
    const result = orders.docs.map((doc) => ({
      ...doc.data(),
    }))
    console.log(result)
    res.status(200).json({ status: "ok", orders: result })

  } catch (error) {
    next(error)
  }
}