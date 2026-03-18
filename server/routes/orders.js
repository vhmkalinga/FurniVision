const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

const router = express.Router();

// Get orders (all for admin, own for others)
router.get('/', requireAuth, orderController.getOrders);

// Create order (mock checkout)
router.post('/', requireAuth, orderController.createOrder);

// Update order status (admin)
router.put('/:id', requireAuth, requireRole('admin'), orderController.updateOrderStatus);

// Delete order (admin)
router.delete('/:id', requireAuth, requireRole('admin'), orderController.deleteOrder);

module.exports = router;
