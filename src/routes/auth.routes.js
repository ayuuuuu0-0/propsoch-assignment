// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /api/v1/auth/register  → create new account
router.post('/register', authController.register);

// POST /api/v1/auth/login     → login, returns user info
router.post('/login', authController.login);

module.exports = router;
