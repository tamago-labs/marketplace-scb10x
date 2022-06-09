const express = require("express")
const router = express.Router();
const testController = require("../controllers/testController")


router.get("/test/get", testController.getTestJSON)
router.get("/test/ethers", testController.testEthers)
router.get("/test/moralisNFTMETADATA", testController.testMoralisNFTMetadata)


module.exports = router;