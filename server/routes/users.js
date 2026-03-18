const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

// Get all users (admin only)
router.get('/', requireAuth, requireRole('admin'), userController.getUsers);

// Get single user
router.get('/:id', requireAuth, requireRole('admin'), userController.getUserById);

// Update user role (admin only)
router.put('/:id', requireAuth, requireRole('admin'), userController.updateUser);

// Delete user (admin only)
router.delete('/:id', requireAuth, requireRole('admin'), userController.deleteUser);

module.exports = router;
