const Design = require('../models/Design');

// Get designs (all for admin/staff, own for customer)
exports.getDesigns = async (req, res) => {
    try {
        const isPrivileged = req.user.role === 'admin' || req.user.role === 'staff';
        const query = isPrivileged
            ? {}
            : { $or: [{ userId: req.user._id }, { sharedWith: req.user._id }] };

        const designs = await Design.find(query)
            .populate('userId', 'name email role')
            .sort({ updatedAt: -1 });
        res.json({ designs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get templates (public)
exports.getTemplates = async (req, res) => {
    try {
        const designs = await Design.find({ isTemplate: true })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });
        res.json({ designs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single design
exports.getDesignById = async (req, res) => {
    try {
        const design = await Design.findById(req.params.id).populate('userId', 'name email');
        if (!design) return res.status(404).json({ message: 'Design not found' });

        const isOwner = design.userId._id.toString() === req.user._id.toString();
        const isShared = design.sharedWith.some(id => id.toString() === req.user._id.toString());
        const isAdmin = req.user.role === 'admin';
        const isStaff = req.user.role === 'staff';

        if (!isOwner && !isShared && !isAdmin && !isStaff) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json({ design });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create design
exports.createDesign = async (req, res) => {
    try {
        const design = await Design.create({ ...req.body, userId: req.user._id });
        res.status(201).json({ design });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update design
exports.updateDesign = async (req, res) => {
    try {
        const design = await Design.findById(req.params.id);
        if (!design) return res.status(404).json({ message: 'Design not found' });

        const isOwner = design.userId.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        const isStaff = req.user.role === 'staff';

        if (!isOwner && !isAdmin && !isStaff) {
            return res.status(403).json({ message: 'Access denied' });
        }

        Object.assign(design, req.body);
        await design.save();
        res.json({ design });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete design
exports.deleteDesign = async (req, res) => {
    try {
        const design = await Design.findById(req.params.id);
        if (!design) return res.status(404).json({ message: 'Design not found' });

        const isOwner = design.userId.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await Design.findByIdAndDelete(req.params.id);
        res.json({ message: 'Design deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
