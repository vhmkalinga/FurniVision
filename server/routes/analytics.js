const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

// Dashboard analytics
router.get('/', requireAuth, requireRole('admin'), analyticsController.getDashboardAnalytics);

module.exports = router;
