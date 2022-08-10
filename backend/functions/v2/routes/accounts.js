const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accounts');

router.get('/account/:address', accountController.getAccount);
router.post('/account/update/:address', accountController.updateAccount);

module.exports = router;
