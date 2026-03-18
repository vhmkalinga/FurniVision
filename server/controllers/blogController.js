const Blog = require('../models/Blog');
const Comment = require('../models/Comment');

// Get published blogs (public)
exports.getPublishedBlogs = async (req, res) => {
    try {
        const { tag, search, page = 1, limit = 9 } = req.query;
        const query = { published: true };
        if (tag) query.tags = tag;
        if (search) query.title = { $regex: search, $options: 'i' };

        const blogs = await Blog.find(query)
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await Blog.countDocuments(query);

        res.json({ blogs, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all blogs (admin)
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate('author', 'name')
            .sort({ createdAt: -1 });
        res.json({ blogs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single blog by slug
exports.getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug }).populate('author', 'name avatar');
        if (!blog) return res.status(404).json({ message: 'Blog post not found' });

        blog.views += 1;
        await blog.save();

        const comments = await Comment.find({ blogId: blog._id, approved: true })
            .populate('userId', 'name avatar')
            .sort({ createdAt: -1 });

        res.json({ blog, comments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create blog
exports.createBlog = async (req, res) => {
    try {
        const blog = await Blog.create({ ...req.body, author: req.user._id });
        res.status(201).json({ blog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update blog
exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json({ blog });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        await Comment.deleteMany({ blogId: req.params.id });
        res.json({ message: 'Blog deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add comment
exports.addComment = async (req, res) => {
    try {
        const comment = await Comment.create({
            blogId: req.params.id,
            userId: req.user._id,
            content: req.body.content
        });
        const populated = await comment.populate('userId', 'name avatar');
        res.status(201).json({ comment: populated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete comment (admin or owner)
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        const isOwner = comment.userId.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Access denied' });

        await Comment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
