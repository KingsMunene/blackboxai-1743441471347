const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login routes
router.get('/login', authController.showLoginForm);
router.post('/login', authController.handleLogin);

// Registration routes
router.get('/register', authController.showRegisterForm);
router.post('/register', authController.handleRegistration);

// Logout
router.get('/logout', authController.handleLogout);

module.exports = router;