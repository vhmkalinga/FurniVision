const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
    approved: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
