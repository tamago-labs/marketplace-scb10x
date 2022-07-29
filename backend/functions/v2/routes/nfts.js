const express = require("express")
const router = express.Router();
const nftController = require("../controllers/nfts")



router.get("/nft/refresh/:chain/:contractAddress/:tokenId", nftController.refreshMetadata)





module.exports = router;