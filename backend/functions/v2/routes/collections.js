const express = require("express")
const router = express.Router();
const collectionController = require("../controllers/collections")



router.get("/collection/:chain/:contractAddress", collectionController.getCOllectionByChainAndAddress)
// router.get("/collection/slug/:slug", collectionController.getCollectionBySlug)




module.exports = router;