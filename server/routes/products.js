const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const productController = require('../controllers/productController');

const router = express.Router();

// Get all products (public)
router.get('/', productController.getProducts);

// Get single product
router.get('/:id', productController.getProductById);

// Create product (admin)
router.post('/', requireAuth, requireRole('admin', 'staff'), productController.createProduct);

// Update product
router.put('/:id', requireAuth, requireRole('admin', 'staff'), productController.updateProduct);

// Delete product
router.delete('/:id', requireAuth, requireRole('admin'), productController.deleteProduct);

// Upload product image
router.post('/:id/image', requireAuth, requireRole('admin', 'staff'), upload.single('image'), productController.uploadProductImage);

module.exports = router;
