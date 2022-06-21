const express = require("express")
const router = express.Router();
const collectionController = require("../controllers/collectionController")



router.get("/collections/", collectionController.getCollections)
router.get("/collections/search", collectionController.searchCollections)
router.get("/collections/:address", collectionController.getCollectionByAddress)



module.exports = router;