const express = require("express")
const router = express.Router();
const userController = require("../controllers/userController")



router.get("/users/", userController.getUsers)
router.get("/users/:address", userController.getUserByAddress)



module.exports = router;