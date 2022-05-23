const { db } = require("../firebase")


exports.getAllOrders = async (req, res, next) => {
  console.log("get all orders...")
  try {
    const allOrders = await db.collection("orders").get();
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
    const order = await db.collection('orders').where('orderId', '==', Number(id)).get()
    let result = []
    order.forEach(doc => {
      result.push(doc.data())
    });
    if (order.empty) {
      return res.status(400).json({ message: "order with this ID does not exist" })
    }
    res.status(200).json({ status: "ok", order: result })
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
  try {
    res.status(200).json({ message: "WIP confirmOrder" })
  } catch (error) {
    next(error)
  }
}

exports.cancelOrder = async (req, res, next) => {
  try {
    res.status(200).json({ message: "WIP cancelOrder" })
  } catch (error) {
    next(error)
  }
}
