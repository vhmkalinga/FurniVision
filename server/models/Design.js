const mongoose = require('mongoose');

const furnitureItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    modelType: { type: String, default: 'box' },
    position: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 0 }
    },
    rotation: { type: Number, default: 0 },
    scale: {
        x: { type: Number, default: 1 },
        y: { type: Number, default: 1 },
        z: { type: Number, default: 1 }
    },
    color: { type: String, default: '#8B4513' },
    dimensions: {
        width: { type: Number, default: 1 },
        height: { type: Number, default: 1 },
        depth: { type: Number, default: 1 }
    }
}, { _id: true });

const designSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, default: 'Untitled Design' },
    roomWidth: { type: Number, required: true, default: 5 },
    roomLength: { type: Number, required: true, default: 5 },
    roomHeight: { type: Number, default: 3 },
    roomShape: { type: String, default: 'rectangular' },
    wallColor: { type: String, default: '#F5F5DC' },
    floorColor: { type: String, default: '#DEB887' },
    furniture: [furnitureItemSchema],
    thumbnail: { type: String, default: '' },
    isTemplate: { type: Boolean, default: false },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Design', designSchema);
