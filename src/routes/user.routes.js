const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);
router.delete('/me', userController.deleteAccount);

module.exports = router;
