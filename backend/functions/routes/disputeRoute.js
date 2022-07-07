const express = require("express")
const router = express.Router();
const disputeController = require("../controllers/disputeController")


router.get("/disputes/", disputeController.getDisputes)
router.get("/disputes/address/:address", disputeController.getDisputeByAddress)
router.get("/disputes/:id", disputeController.getDisputeById)
router.post("/disputes/", disputeController.createDispute)
router.post("/disputes/update/:id", disputeController.updateDispute)

module.exports = router;