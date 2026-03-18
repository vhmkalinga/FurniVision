const express = require('express');
const { requireAuth } = require('../middleware/auth');
const designController = require('../controllers/designController');

const router = express.Router();

// Get designs (all for admin/staff, own for customer)
router.get('/', requireAuth, designController.getDesigns);

// Get templates (public)
router.get('/templates', designController.getTemplates);

// Get single design
router.get('/:id', requireAuth, designController.getDesignById);

// Create design
router.post('/', requireAuth, designController.createDesign);

// Update design
router.put('/:id', requireAuth, designController.updateDesign);

// Delete design
router.delete('/:id', requireAuth, designController.deleteDesign);

module.exports = router;
