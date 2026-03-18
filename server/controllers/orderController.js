const Order = require('../models/Order');

// Get orders (all for admin, own for others)
exports.getOrders = async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { userId: req.user._id };
        const orders = await Order.find(query)
            .populate('userId', 'name email')
            .populate('items.product', 'name images price')
            .sort({ createdAt: -1 });
        res.json({ orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create order (mock checkout)
exports.createOrder = async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const order = await Order.create({
            userId: req.user._id,
            items,
            total,
            shippingAddress,
            status: 'confirmed'
        });

        res.status(201).json({ order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json({ order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete order (admin)
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
