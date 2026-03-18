const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const blogController = require('../controllers/blogController');

const router = express.Router();

// Get published blogs (public)
router.get('/', blogController.getPublishedBlogs);

// Get all blogs (admin)
router.get('/all', requireAuth, requireRole('admin'), blogController.getAllBlogs);

// Get single blog by slug
router.get('/:slug', blogController.getBlogBySlug);

// Create blog
router.post('/', requireAuth, requireRole('admin', 'staff'), blogController.createBlog);

// Update blog
router.put('/:id', requireAuth, requireRole('admin', 'staff'), blogController.updateBlog);

// Delete blog
router.delete('/:id', requireAuth, requireRole('admin'), blogController.deleteBlog);

// Add comment
router.post('/:id/comments', requireAuth, blogController.addComment);

// Delete comment (admin or owner)
router.delete('/comments/:id', requireAuth, blogController.deleteComment);

module.exports = router;
