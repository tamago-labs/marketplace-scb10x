const express = require("express")
const router = express.Router();
const proofController = require("../controllers/proofController")


router.post("/proof/swap/", proofController.generateSwapProof)
router.post("/proof/partial-swap", proofController.generatePartialSwapProof)
router.post("/proof/claim", proofController.generateClaimProof)
router.get("/proof/relay-messages", proofController.generateRelayMessages)
router.get("/proof/validator-messages", proofController.generateValidatorMessages)


module.exports = router;