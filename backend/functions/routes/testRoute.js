const express = require("express")
const router = express.Router();
const testController = require("../controllers/testController")


router.get("/test/get", testController.getTestJSON)
router.post("/test/createMock", testController.createMockData)

module.exports = router;