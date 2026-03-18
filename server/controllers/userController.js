const User = require('../models/User');

// Get all users (admin only)
exports.getUsers = async (req, res) => {
    try {
        const { role, search, page = 1, limit = 20 } = req.query;
        const query = {};
        if (role) query.role = role;
        if (search) query.name = { $regex: search, $options: 'i' };

        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await User.countDocuments(query);

        res.json({ users, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single user
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user role (admin only)
exports.updateUser = async (req, res) => {
    try {
        const { role, name, email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role, name, email },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
