const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accounts');
const verifyRecoveredAddress = require('../middlewares/verifyRecoveredAddress');

router.get('/account/:address', accountController.getAccount);
router.post(
  '/account/update/',
  verifyRecoveredAddress,
  accountController.updateAccount
);

module.exports = router;
