const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// Get all categories (public)
router.get('/', categoryController.getCategories);

// Create category
router.post('/', requireAuth, requireRole('admin'), categoryController.createCategory);

// Update category
router.put('/:id', requireAuth, requireRole('admin'), categoryController.updateCategory);

// Delete category
router.delete('/:id', requireAuth, requireRole('admin'), categoryController.deleteCategory);

module.exports = router;
