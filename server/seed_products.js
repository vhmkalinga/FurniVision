require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

const PRODUCTS = [
    // ---- SOFAS & SEATING ----
    { name: 'Beige Linen Sofa', category: 'Sofas', price: 1299, description: 'Elegant beige linen sofa with clean lines and plush cushions, perfect for modern living rooms.', image: '/products/Beige_Linen_Sofa.webp', model: '/models/Beige_Linen_Sofa.glb', modelType: 'sofa', dimensions: { width: 2.0, height: 0.85, depth: 0.9 }, featured: true, rating: 4.8, reviewCount: 42 },
    { name: 'Tufted Beige Armchair', category: 'Chairs', price: 599, description: 'Classic tufted armchair in warm beige fabric. Ideal accent piece for any room.', image: '/products/Tufted_Beige_Arm_Chair.webp', model: '/models/Tufted_Beige_Arm_Chair.glb', modelType: 'chair', dimensions: { width: 0.75, height: 0.85, depth: 0.7 }, featured: true, rating: 4.7, reviewCount: 28 },
    { name: 'White & Tan Leather Sofa', category: 'Sofas', price: 1899, description: 'Premium two-tone leather sofa combining white and tan leather for a sophisticated look.', image: '/products/White and tan leather.webp', model: '/models/White and tan leather.glb', modelType: 'sofa', dimensions: { width: 2.2, height: 0.85, depth: 0.95 }, featured: true, rating: 4.9, reviewCount: 35 },
    { name: 'Ladder Back Wooden Chair', category: 'Chairs', price: 249, description: 'Traditional ladder-back chair crafted from solid wood. Timeless design for dining areas.', image: '/products/Ladder_Back_Wooden_Chair.webp', model: '/models/Ladder_Back_Wooden_Chair.glb', modelType: 'chair', dimensions: { width: 0.5, height: 0.9, depth: 0.5 }, rating: 4.5, reviewCount: 19 },

    // ---- TABLES ----
    { name: 'Natural Wood Table', category: 'Tables', price: 799, description: 'Beautiful natural wood dining table with organic grain patterns and warm finish.', image: '/products/Natural_Wood_Table.webp', model: '/models/Natural_Wood_Table.glb', modelType: 'table', dimensions: { width: 1.6, height: 0.76, depth: 0.9 }, featured: true, rating: 4.8, reviewCount: 31 },
    { name: 'Oak Dining Table', category: 'Tables', price: 1099, description: 'Sturdy oak dining table with a rich honey finish. Seats 6 comfortably.', image: '/products/Oak dining table.jpeg', model: '/models/Oak dining table.glb', modelType: 'table', dimensions: { width: 1.8, height: 0.76, depth: 0.9 }, rating: 4.6, reviewCount: 22 },
    { name: 'Round Oak Coffee Table', category: 'Tables', price: 449, description: 'Elegant round coffee table made from premium oak with a smooth matte finish.', image: '/products/Round_Oak_Coffee_Table.jpg', model: '/models/Round_Oak_Coffee_Table.glb', modelType: 'table', dimensions: { width: 0.8, height: 0.45, depth: 0.8 }, rating: 4.7, reviewCount: 26 },
    { name: 'Two-Tone Wood Coffee Table', category: 'Tables', price: 549, description: 'Modern two-tone coffee table blending light and dark wood for a contemporary aesthetic.', image: '/products/Two_Tone_Wood_Coffee__Table.webp', model: '/models/Two_Tone_Wood_Coffee__Table.glb', modelType: 'table', dimensions: { width: 1.0, height: 0.45, depth: 0.6 }, rating: 4.5, reviewCount: 18 },
    { name: 'Round Side Table', category: 'Tables', price: 299, description: 'Compact round side table. Perfect next to a sofa or as a bedside companion.', image: '/products/Round side.jpeg', model: '/models/Round side.glb', modelType: 'table', dimensions: { width: 0.5, height: 0.55, depth: 0.5 }, rating: 4.4, reviewCount: 15 },
    { name: 'Lockable Wooden Table', category: 'Tables', price: 699, description: 'Versatile wooden table with lockable drawer storage. Combines function and style.', image: '/products/Lockable_Wooden_Table.jpg', model: '/models/Lockable_Wooden_Table.glb', modelType: 'desk', dimensions: { width: 1.2, height: 0.75, depth: 0.6 }, rating: 4.3, reviewCount: 12 },

    // ---- BEDS ----
    { name: 'Natural Wood Bed', category: 'Beds', price: 1499, description: 'Solid natural wood bed frame with a minimalist headboard. Queen size.', image: '/products/Natural_Wood_Bed.webp', model: '/models/Natural_Wood_Bed.glb', modelType: 'bed', dimensions: { width: 1.6, height: 0.5, depth: 2.0 }, featured: true, rating: 4.9, reviewCount: 47 },
    { name: 'Oak Storage Platform Bed', category: 'Beds', price: 1799, description: 'Modern oak platform bed with built-in under-bed storage drawers. Queen size.', image: '/products/Oak_Storage_Platform__Bed.webp', model: '/models/Oak_Storage_Platform__Bed.glb', modelType: 'bed', dimensions: { width: 1.7, height: 0.55, depth: 2.1 }, featured: true, rating: 4.8, reviewCount: 38 },

    // ---- BOOKSHELVES & STORAGE ----
    { name: 'Geometric Wooden Bookshelf', category: 'Storage', price: 699, description: 'Unique geometric bookshelf with asymmetric compartments for a modern display.', image: '/products/Geometric_Wooden_Book_Shelf.png', model: '/models/Geometric_Wooden_Book_Shelf.glb', modelType: 'bookshelf', dimensions: { width: 1.0, height: 1.8, depth: 0.35 }, rating: 4.6, reviewCount: 21 },
    { name: 'Tall Wooden Bookshelf', category: 'Storage', price: 599, description: 'Classic tall bookshelf with multiple shelves. Solid wood construction.', image: '/products/Tall_Wooden_Bookshelf.jpg', model: '/models/Tall_Wooden_Bookshelf.glb', modelType: 'bookshelf', dimensions: { width: 0.8, height: 2.0, depth: 0.35 }, rating: 4.5, reviewCount: 17 },
    { name: 'Wooden Five-Shelf Book Rack', category: 'Storage', price: 449, description: 'Five-shelf book rack with warm wood tones. Open-back design for easy access.', image: '/products/Wooden_Five_Shelf_Book.jpg', model: '/models/Wooden_Five_Shelf_Book.glb', modelType: 'bookshelf', dimensions: { width: 0.8, height: 1.6, depth: 0.3 }, rating: 4.4, reviewCount: 14 },
    { name: 'Pine Wardrobe', category: 'Storage', price: 999, description: 'Spacious pine wardrobe with double doors and interior shelving. Natural finish.', image: '/products/Pine wardrobe.jpeg', model: '/models/Pine wardrobe.glb', modelType: 'cabinet', dimensions: { width: 1.2, height: 2.0, depth: 0.6 }, rating: 4.6, reviewCount: 24 },

    // ---- LIGHTING ----
    { name: 'Golden Floor Lamp', category: 'Lighting', price: 349, description: 'Statement golden floor lamp with an adjustable shade. Adds warmth to any corner.', image: '/products/Golden_Floor_Lamp.webp', model: '/models/Golden_Floor_Lamp.glb', modelType: 'lamp', dimensions: { width: 0.35, height: 1.6, depth: 0.35 }, featured: true, rating: 4.7, reviewCount: 33 },
    { name: 'Onyx Table Lamp', category: 'Lighting', price: 199, description: 'Sophisticated table lamp with onyx-inspired base. Warm ambient lighting.', image: '/products/Onyx_Table_Lamp.webp', model: '/models/Onyx_Table_Lamp.glb', modelType: 'lamp', dimensions: { width: 0.25, height: 0.5, depth: 0.25 }, rating: 4.5, reviewCount: 20 },

    // ---- DOORS ----
    { name: 'Carved Wooden Door', category: 'Doors & Windows', price: 899, description: 'Handcrafted carved wooden door with intricate traditional patterns.', image: '/products/carved wooden door.jpg', model: '/models/carved wooden door.glb', modelType: 'door', dimensions: { width: 0.9, height: 2.1, depth: 0.05 }, rating: 4.8, reviewCount: 11 },
    { name: 'Five Panel Wooden Door', category: 'Doors & Windows', price: 549, description: 'Classic five-panel wooden door in a neutral finish. Fits standard frames.', image: '/products/Five panel wooden door.webp', model: '/models/Five panel wooden door.glb', modelType: 'door', dimensions: { width: 0.9, height: 2.1, depth: 0.05 }, rating: 4.4, reviewCount: 9 },
    { name: 'Six Panel Wooden Door', category: 'Doors & Windows', price: 579, description: 'Traditional six-panel door with rich wood grain. Timeless elegance.', image: '/products/Six panel wooden door.jpg', model: '/models/Six panel wooden door.glb', modelType: 'door', dimensions: { width: 0.9, height: 2.1, depth: 0.05 }, rating: 4.5, reviewCount: 13 },
    { name: 'Double French Doors', category: 'Doors & Windows', price: 1299, description: 'Elegant double French doors with glass panes. Let natural light flow between rooms.', image: '/products/Double french door.webp', model: '/models/Double French Doors.glb', modelType: 'door', dimensions: { width: 1.6, height: 2.1, depth: 0.06 }, rating: 4.9, reviewCount: 16 },

    // ---- WINDOWS ----
    { name: 'Black Framed Double Window', category: 'Doors & Windows', price: 699, description: 'Modern black-framed double window unit with sleek industrial styling.', image: '/products/Black_Framed_Double_Window.jpg', model: '/models/Black_Framed_Double_Window.glb', modelType: 'window', dimensions: { width: 1.2, height: 1.2, depth: 0.1 }, rating: 4.6, reviewCount: 10 },
    { name: 'Pair of Six-Pane Windows', category: 'Doors & Windows', price: 799, description: 'Classic pair of six-pane windows with traditional divided light styling.', image: '/products/Pair_Of_Six_Pane_Window.jpg', model: '/models/Pair_Of_Six_Pane_Window.glb', modelType: 'window', dimensions: { width: 1.4, height: 1.2, depth: 0.1 }, rating: 4.5, reviewCount: 8 },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Create categories
        const categoryNames = [...new Set(PRODUCTS.map(p => p.category))];
        const categoryMap = {};
        for (const name of categoryNames) {
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            let cat = await Category.findOneAndUpdate(
                { $or: [{ name }, { slug }] },
                { name, slug, description: `${name} collection` },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`  📂 Category ready: ${name}`);
            categoryMap[name] = cat._id;
        }

        // Clear existing products (optional — comment out if you want to keep old ones)
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');

        // Insert products
        for (const p of PRODUCTS) {
            await Product.create({
                name: p.name,
                description: p.description,
                price: p.price,
                category: categoryMap[p.category],
                images: [p.image],
                dimensions: p.dimensions,
                modelType: p.modelType,
                material: 'wood',
                inStock: true,
                featured: p.featured || false,
                rating: p.rating || 4.5,
                reviewCount: p.reviewCount || 0,
            });
            console.log(`  ✅ ${p.name}`);
        }

        console.log(`\n🎉 Seeded ${PRODUCTS.length} products across ${categoryNames.length} categories!`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
}

seed();
