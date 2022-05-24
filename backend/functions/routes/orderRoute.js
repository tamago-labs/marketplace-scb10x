const express = require("express")
const router = express.Router();
const orderController = require("../controllers/orderController")


router.get("/orders", orderController.getAllOrders)
router.post("/orders", orderController.createOrder)
router.post("/orders/confirm", orderController.confirmOrder)
router.post("/orders/cancel", orderController.cancelOrder)
router.get("/orders/:proxy", orderController.getOrder)



module.exports = router;