const express = require("express")
const router = express.Router();
const orderController = require("../controllers/orders")



router.get("/orders/", orderController.getAllOrders)
router.get("/orders/chain/:chainId", orderController.getOrdersByChain)
// router.get("/orders/refresh-cache", orderController.refreshOrderCache)




module.exports = router;