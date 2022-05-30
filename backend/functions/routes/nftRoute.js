const express = require("express")
const router = express.Router();
const nftController = require("../controllers/nftController")



router.get("/nft/metadata/:address/:id/:chain", nftController.getMetadata)



module.exports = router;