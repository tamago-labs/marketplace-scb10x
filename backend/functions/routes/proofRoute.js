const express = require("express")
const router = express.Router();
const proofController = require("../controllers/proofController")


router.post("/proof/swap/", proofController.generateSwapProof)
router.post("/proof/partial-swap", proofController.generatePartialSwapProof)
router.post("/proof/claim", proofController.generateClaimProof)


module.exports = router;