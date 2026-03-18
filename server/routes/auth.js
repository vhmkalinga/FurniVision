const express = require('express');
const { requireAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const authController = require('../controllers/authController');

const router = express.Router();

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Get current user
router.get('/me', requireAuth, authController.getMe);

// Update profile
router.put('/profile', requireAuth, authController.updateProfile);

// Upload avatar
router.post('/avatar', requireAuth, upload.single('avatar'), authController.uploadAvatar);

module.exports = router;
