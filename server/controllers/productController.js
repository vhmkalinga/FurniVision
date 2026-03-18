const Product = require('../models/Product');

// Get all products (public)
exports.getProducts = async (req, res) => {
    try {
        const { category, search, sort, featured, page = 1, limit = 12, minPrice, maxPrice } = req.query;
        const query = {};

        if (category) query.category = category;
        if (featured === 'true') query.featured = true;
        if (search) query.name = { $regex: search, $options: 'i' };
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'price_asc') sortOption = { price: 1 };
        if (sort === 'price_desc') sortOption = { price: -1 };
        if (sort === 'name') sortOption = { name: 1 };
        if (sort === 'rating') sortOption = { rating: -1 };

        const products = await Product.find(query)
            .populate('category', 'name slug')
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await Product.countDocuments(query);

        res.json({ products, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single product
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name slug');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create product (admin)
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Upload product image
exports.uploadProductImage = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        product.images.push(`/uploads/${req.file.filename}`);
        await product.save();
        res.json({ product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
