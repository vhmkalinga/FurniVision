require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Blog = require('./models/Blog');

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Category.deleteMany({}),
            Product.deleteMany({}),
            Blog.deleteMany({})
        ]);

        // Create users
        const users = await User.create([
            { name: 'Admin User', email: 'admin@furnivision.com', password: 'admin123', role: 'admin' },
            { name: 'Sarah Designer', email: 'staff@furnivision.com', password: 'staff123', role: 'staff' },
            { name: 'John Customer', email: 'customer@furnivision.com', password: 'customer123', role: 'customer' }
        ]);
        console.log('✅ Users seeded');

        // Create categories
        const categories = await Category.create([
            { name: 'Sofas & Couches', slug: 'sofas', description: 'Comfortable seating for your living room' },
            { name: 'Tables', slug: 'tables', description: 'Dining tables, coffee tables, and more' },
            { name: 'Chairs', slug: 'chairs', description: 'Dining chairs, office chairs, and accent chairs' },
            { name: 'Beds', slug: 'beds', description: 'Beds and bedroom furniture' },
            { name: 'Storage', slug: 'storage', description: 'Bookshelves, cabinets, and storage solutions' },
            { name: 'Lighting', slug: 'lighting', description: 'Lamps, pendants, and lighting fixtures' },
            { name: 'Desks', slug: 'desks', description: 'Work desks and study tables' },
            { name: 'Outdoor', slug: 'outdoor', description: 'Outdoor and patio furniture' }
        ]);
        console.log('✅ Categories seeded');

        // Create products
        const products = await Product.create([
            {
                name: 'Modern Cloud Sofa',
                description: 'A luxurious cloud-like sofa with premium fabric upholstery and deep cushions. Perfect for modern living rooms with its clean lines and inviting comfort.',
                price: 1299,
                category: categories[0]._id,
                dimensions: { width: 2.2, height: 0.85, depth: 0.95 },
                colors: [{ name: 'Charcoal', hex: '#36454F' }, { name: 'Cream', hex: '#FFFDD0' }, { name: 'Navy', hex: '#000080' }],
                modelType: 'sofa',
                material: 'fabric',
                featured: true,
                rating: 4.8,
                reviewCount: 124
            },
            {
                name: 'Scandinavian Coffee Table',
                description: 'Minimalist Scandinavian-inspired coffee table crafted from solid oak with tapered legs. The perfect centerpiece for any contemporary living space.',
                price: 449,
                category: categories[1]._id,
                dimensions: { width: 1.2, height: 0.45, depth: 0.6 },
                colors: [{ name: 'Natural Oak', hex: '#C8A96E' }, { name: 'Walnut', hex: '#5C4033' }],
                modelType: 'table',
                material: 'wood',
                featured: true,
                rating: 4.6,
                reviewCount: 89
            },
            {
                name: 'Ergonomic Office Chair',
                description: 'High-performance ergonomic office chair with adjustable lumbar support, breathable mesh back, and premium cushioning for all-day comfort.',
                price: 699,
                category: categories[2]._id,
                dimensions: { width: 0.65, height: 1.2, depth: 0.65 },
                colors: [{ name: 'Black', hex: '#1A1A1A' }, { name: 'Gray', hex: '#808080' }],
                modelType: 'chair',
                material: 'mesh',
                featured: true,
                rating: 4.9,
                reviewCount: 256
            },
            {
                name: 'Platform Bed Frame',
                description: 'Contemporary platform bed frame with integrated headboard and hidden storage compartments. Built from solid hardwood with a premium matte finish.',
                price: 899,
                category: categories[3]._id,
                dimensions: { width: 1.6, height: 1.1, depth: 2.1 },
                colors: [{ name: 'Espresso', hex: '#3C1414' }, { name: 'White', hex: '#FAFAFA' }],
                modelType: 'bed',
                material: 'wood',
                featured: true,
                rating: 4.7,
                reviewCount: 167
            },
            {
                name: 'Modular Bookshelf',
                description: 'Versatile modular bookshelf system that adapts to your space. Each unit can be configured independently for a custom storage solution.',
                price: 349,
                category: categories[4]._id,
                dimensions: { width: 0.8, height: 1.8, depth: 0.35 },
                colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Oak', hex: '#C8A96E' }],
                modelType: 'bookshelf',
                material: 'wood',
                featured: false,
                rating: 4.5,
                reviewCount: 73
            },
            {
                name: 'Arc Floor Lamp',
                description: 'Elegant arc floor lamp with a brushed brass finish and linen shade. Provides warm ambient lighting perfect for reading corners.',
                price: 279,
                category: categories[5]._id,
                dimensions: { width: 0.4, height: 1.8, depth: 0.4 },
                colors: [{ name: 'Brass', hex: '#B5A642' }, { name: 'Black', hex: '#1A1A1A' }],
                modelType: 'lamp',
                material: 'metal',
                featured: true,
                rating: 4.4,
                reviewCount: 92
            },
            {
                name: 'Executive Standing Desk',
                description: 'Electric height-adjustable standing desk with solid bamboo top and dual motor system. Smoothly transitions between sitting and standing positions.',
                price: 799,
                category: categories[6]._id,
                dimensions: { width: 1.5, height: 0.75, depth: 0.7 },
                colors: [{ name: 'Bamboo', hex: '#D4B896' }, { name: 'White', hex: '#FAFAFA' }],
                modelType: 'desk',
                material: 'bamboo',
                featured: false,
                rating: 4.8,
                reviewCount: 198
            },
            {
                name: 'Velvet Accent Chair',
                description: 'Stunning velvet accent chair with gold-finished legs. The sculpted silhouette and rich fabric make this a statement piece for any room.',
                price: 549,
                category: categories[2]._id,
                dimensions: { width: 0.75, height: 0.85, depth: 0.7 },
                colors: [{ name: 'Emerald', hex: '#50C878' }, { name: 'Blush', hex: '#DE5D83' }, { name: 'Mustard', hex: '#FFDB58' }],
                modelType: 'chair',
                material: 'velvet',
                featured: true,
                rating: 4.6,
                reviewCount: 84
            },
            {
                name: 'Dining Table Set',
                description: 'Elegant dining table crafted from solid walnut with a live edge design. Seats 6 comfortably and becomes the focal point of your dining room.',
                price: 1599,
                category: categories[1]._id,
                dimensions: { width: 1.8, height: 0.76, depth: 0.9 },
                colors: [{ name: 'Walnut', hex: '#5C4033' }, { name: 'Natural', hex: '#DEB887' }],
                modelType: 'table',
                material: 'wood',
                featured: false,
                rating: 4.7,
                reviewCount: 61
            },
            {
                name: 'Minimalist TV Console',
                description: 'Sleek TV console with cable management system and soft-close drawers. The floating design with hidden wall mount creates a clean, modern look.',
                price: 599,
                category: categories[4]._id,
                dimensions: { width: 1.8, height: 0.5, depth: 0.4 },
                colors: [{ name: 'Matte White', hex: '#F0F0F0' }, { name: 'Charcoal', hex: '#36454F' }],
                modelType: 'cabinet',
                material: 'wood',
                featured: false,
                rating: 4.5,
                reviewCount: 108
            },
            {
                name: 'L-Shaped Sectional',
                description: 'Spacious L-shaped sectional sofa with reversible chaise lounge. Features stain-resistant fabric and high-density foam for lasting comfort.',
                price: 1899,
                category: categories[0]._id,
                dimensions: { width: 2.8, height: 0.88, depth: 1.8 },
                colors: [{ name: 'Gray', hex: '#808080' }, { name: 'Beige', hex: '#F5F5DC' }],
                modelType: 'sofa',
                material: 'fabric',
                featured: false,
                rating: 4.8,
                reviewCount: 203
            },
            {
                name: 'Nightstand with Wireless Charging',
                description: 'Modern nightstand with built-in wireless charging pad and USB ports. Features a soft-close drawer and premium wood grain finish.',
                price: 249,
                category: categories[3]._id,
                dimensions: { width: 0.5, height: 0.55, depth: 0.4 },
                colors: [{ name: 'Oak', hex: '#C8A96E' }, { name: 'White', hex: '#FAFAFA' }],
                modelType: 'nightstand',
                material: 'wood',
                featured: false,
                rating: 4.3,
                reviewCount: 67
            }
        ]);
        console.log('✅ Products seeded (' + products.length + ' items)');

        // Create blog posts
        await Blog.create([
            {
                title: '10 Tips for Designing a Modern Living Room',
                content: `Creating a modern living room that feels both stylish and inviting requires careful planning. Here are our top 10 tips:\n\n**1. Start with a Neutral Base**\nBegin with neutral walls and large furniture pieces. This creates a versatile foundation that allows you to experiment with accent colors through accessories.\n\n**2. Invest in Statement Furniture**\nChoose one or two statement pieces that define the room's character. A sculptural coffee table or a bold accent chair can anchor the entire space.\n\n**3. Layer Your Lighting**\nCombine ambient, task, and accent lighting to create depth. Floor lamps, pendant lights, and table lamps each serve different purposes.\n\n**4. Embrace Negative Space**\nDon't feel compelled to fill every corner. Breathing room makes a space feel larger and more sophisticated.\n\n**5. Mix Textures**\nCombine smooth, rough, soft, and hard textures to create visual interest. Think velvet cushions on a leather sofa, or a woven rug on polished concrete.\n\n**6. Use the 60-30-10 Color Rule**\n60% dominant color, 30% secondary color, 10% accent color. This creates a balanced and harmonious palette.\n\n**7. Consider the Flow**\nArrange furniture to facilitate easy movement and conversation. Leave clear pathways and ensure seating areas feel connected.\n\n**8. Add Greenery**\nPlants bring life and color to any space. Choose low-maintenance varieties for easy upkeep.\n\n**9. Personalize Thoughtfully**\nDisplay meaningful art and objects, but curate carefully. Less is more when it comes to accessories.\n\n**10. Use Technology Wisely**\nIntegrate smart home features seamlessly. Hide cords, choose discreet speakers, and use the FurniVision room designer to plan your layout before purchasing.`,
                excerpt: 'Transform your living space with these expert tips for creating a modern, inviting living room that balances style and comfort.',
                author: users[1]._id,
                tags: ['living-room', 'design-tips', 'modern-style'],
                published: true
            },
            {
                title: 'The Ultimate Guide to Choosing the Right Sofa',
                content: `Your sofa is arguably the most important furniture purchase you'll make. Here's everything you need to know:\n\n**Understanding Sofa Types**\n\nFrom sectionals to loveseats, the right sofa depends on your space and lifestyle. Consider how many people will use it regularly, whether you need a sleeper function, and how it fits your room dimensions.\n\n**Fabric vs Leather**\n\nFabric sofas offer more color options and tend to be more affordable, while leather develops character over time and is easier to clean. Both can be excellent choices depending on your preferences.\n\n**Testing Comfort**\n\nThe ideal seat depth is 20-24 inches for most people. The cushion fill affects both comfort and maintenance — foam is supportive, down is soft, and a combination offers the best of both.\n\n**Measuring for Your Space**\n\nAlways measure your room and plan the layout. Use the FurniVision 3D room designer to visualize how different sofa sizes will look in your actual space before committing.`,
                excerpt: 'Navigate the world of sofas with confidence using our comprehensive guide to choosing the perfect sofa for your space.',
                author: users[1]._id,
                tags: ['sofa', 'buying-guide', 'furniture'],
                published: true
            },
            {
                title: 'Small Space Solutions: Maximizing Every Square Foot',
                content: `Living in a small space doesn't mean sacrificing style or functionality. With clever design strategies, you can make any space feel larger and work harder.\n\n**Multi-Functional Furniture**\n\nInvest in pieces that serve double duty: ottoman with storage, a dining table that doubles as a desk, or a sofa bed for guests.\n\n**Vertical Thinking**\n\nUse wall-mounted shelves, tall bookcases, and hanging organizers to take advantage of vertical space. This frees up valuable floor area.\n\n**Light and Color**\n\nLight colors make spaces feel larger. Mirrors amplify natural light and create the illusion of depth. Choose furniture with exposed legs to maintain visual openness.\n\n**Smart Layout Planning**\n\nBefore buying anything, use our room designer to experiment with different layouts. Finding the optimal arrangement can make a 400-square-foot apartment feel twice its size.`,
                excerpt: 'Discover creative strategies to make the most of small living spaces without compromising on style or comfort.',
                author: users[0]._id,
                tags: ['small-spaces', 'design-tips', 'organization'],
                published: true
            }
        ]);
        console.log('✅ Blog posts seeded');

        console.log('\n📧 Login credentials:');
        console.log('  Admin:    admin@furnivision.com / admin123');
        console.log('  Staff:    staff@furnivision.com / staff123');
        console.log('  Customer: customer@furnivision.com / customer123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
};

seed();
