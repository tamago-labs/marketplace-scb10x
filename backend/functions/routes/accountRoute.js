const express = require("express")
const router = express.Router();
const accountController = require("../controllers/accountController")



router.get("/account/:address", accountController.getAccount)
router.post("/account/", accountController.createAccountWithSigning)



module.exports = router;