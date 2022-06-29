const express = require("express")
const router = express.Router();
const collectionController = require("../controllers/collectionController")



router.get("/collections/", collectionController.getCollections)
router.get("/collections/search", collectionController.searchByCollections)
router.get("/collections/:address", collectionController.getCollectionByAddress)
router.post("/collections/update/", collectionController.updateCollection)



module.exports = router;