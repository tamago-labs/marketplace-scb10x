const express = require("express")
const router = express.Router();
const collectionController = require("../controllers/collectionController")



router.get("/collections/", collectionController.getCollections)
router.get("/collections/search", collectionController.searchByCollections)
router.get("/collections/:address/:chainId", collectionController.getCollectionByAddress)
router.post("/collections/update/", collectionController.updateCollection)
router.post("/collections/ban", collectionController.banCollection)
router.post("/collections/un-ban", collectionController.unBanCollection)



module.exports = router;