const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all admin routes
router.use(authMiddleware.isAdmin);

// Admin dashboard
router.get('/dashboard', adminController.dashboard);

// File upload routes
router.get('/upload-main', adminController.showUploadForm);
router.post('/upload-main', adminController.handleMainUpload);

// Automation trigger
router.post('/trigger-automation', adminController.triggerAutomation);

module.exports = router;