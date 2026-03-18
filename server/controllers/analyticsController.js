const User = require('../models/User');
const Product = require('../models/Product');
const Design = require('../models/Design');
const Order = require('../models/Order');
const Blog = require('../models/Blog');

// Dashboard analytics
exports.getDashboardAnalytics = async (req, res) => {
    try {
        const [userCount, productCount, designCount, orderCount, blogCount] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Design.countDocuments(),
            Order.countDocuments(),
            Blog.countDocuments()
        ]);

        const recentOrders = await Order.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5);

        const totalRevenue = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        res.json({
            stats: {
                users: userCount,
                products: productCount,
                designs: designCount,
                orders: orderCount,
                blogs: blogCount,
                revenue: totalRevenue[0]?.total || 0
            },
            recentOrders,
            recentUsers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
