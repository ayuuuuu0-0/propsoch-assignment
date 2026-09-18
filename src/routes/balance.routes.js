const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balance.controller');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', balanceController.getBalances);

module.exports = router;
