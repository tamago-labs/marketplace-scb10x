const express = require("express")
const router = express.Router();
const orderController = require("../controllers/orderController")


router.get("/orders", orderController.getOrders)
router.post("/orders", orderController.createOrder)
router.post("/orders/confirm", orderController.confirmOrder)
router.post("/orders/cancel", orderController.cancelOrder)
router.get("/orders/collection/:address", orderController.getOrdersByCollection)
router.get("/orders/owner/:owner", orderController.getOrdersByOwner)
router.get("/orders/:id", orderController.getOrder)




module.exports = router;