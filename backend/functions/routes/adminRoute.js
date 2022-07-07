const express = require("express")
const router = express.Router();
const adminController = require("../controllers/adminController")



router.get("/admin/is-admin/:address", adminController.getIsAdmin)




module.exports = router;