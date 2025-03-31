const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all user routes
router.use(authMiddleware.isAuthenticated);

// File upload routes
router.get('/upload-serials', userController.showUploadForm);
router.post('/upload-serials', userController.handleUserUpload);

// Status view
router.get('/status', userController.viewUploadStatus);

module.exports = router;