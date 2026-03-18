import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Box, Star, Eye, ShoppingBag, Palette, ThumbsUp, Layers, MousePointerClick, StarHalf, PlayCircle, Sparkles, Award, Mail } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import api from '../api';
import ProductCard from '../components/ui/ProductCard';

const BLOG_IMAGES = [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1599619351208-3e6c839d6828?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&q=80&w=800',
];

/* ─── Scroll Reveal Wrapper ─── */
function Reveal({ children, delay = 0 }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
            {children}
        </motion.div>
    );
}

/* ─── Main Home Component ─── */
export default function Home() {
    const [featured, setFeatured] = useState([]);
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        api.get('/products?featured=true&limit=8').then(r => setFeatured(r.data.products)).catch(() => { });
        api.get('/blogs?limit=3').then(r => setBlogs(r.data.blogs)).catch(() => { });
    }, []);

    // Fallback products if API returns empty during design verification
    const displayProducts = featured.length > 0 ? featured.slice(0, 4) : [
        { _id: 'p1', name: 'Minimalist Oak Chair', price: 149, rating: 5, category: { name: 'Seating' }, featured: true },
        { _id: 'p2', name: 'Modern Velvet Sofa', price: 899, rating: 5, reviewCount: 24, category: { name: 'Sofas' }, featured: true },
        { _id: 'p3', name: 'Ceramic Table Lamp', price: 89, rating: 4.8, reviewCount: 12, category: { name: 'Lighting' }, featured: true },
        { _id: 'p4', name: 'Walnut Dining Table', price: 649, rating: 5, reviewCount: 8, category: { name: 'Tables' }, featured: true },
    ];

    const displayBlogs = blogs.length > 0 ? blogs : [
        { _id: 'b1', title: '10 Minimalist Living Room Ideas for 2024', excerpt: 'Discover how to transform your living space into a serene, clutter-free haven with these modern minimalist design concepts.', author: { name: 'Sarah Jenkins' }, createdAt: new Date().toISOString(), slug: 'minimalist-living-room-ideas' },
        { _id: 'b2', title: 'The Ultimate Guide to Choosing the Perfect Sofa', excerpt: 'A comprehensive guide covering fabrics, dimensions, and seating comfort to help you find the ideal centerpiece for your home.', author: { name: 'David Lee' }, createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), slug: 'choosing-perfect-sofa' },
        { _id: 'b3', title: 'Integrating 3D Design in Modern Home Decor', excerpt: 'How virtual room planning is changing the way we shop for furniture and conceptualize our interior spaces before buying.', author: { name: 'Emily Chen' }, createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), slug: '3d-design-home-decor' },
    ];

    return (
        <div className="bg-[var(--bg-primary)]">
            {/* ═══════════════ HERO SECTION ═══════════════ */}
            <section className="relative min-h-screen flex items-center border-b border-[var(--border-color)] overflow-hidden" style={{ marginTop: '-90px', paddingTop: '90px' }}>
                {/* Immersive Background Image */}
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2560")' }}
                />
                
                {/* Dark Gradients for Text Legibility */}
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="absolute inset-0 z-10 bg-black/20" /> {/* Extra universal darkening */}

                <div className="container-centered relative z-20 w-full py-24 lg:py-32">
                    <div className="max-w-3xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                            className="font-display font-bold text-5xl sm:text-7xl mb-6 text-white leading-[1.1] tracking-tight"
                        >
                            Design Your <br />
                            Perfect Room
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                            className="mb-12 text-lg sm:text-2xl text-white/90 max-w-2xl leading-relaxed font-light"
                        >
                            Visualize premium furniture inside your home using our interactive 3D room designer.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-5 mt-6"
                        >
                            <Link to="/designer" className="inline-flex items-center justify-center gap-4 w-full sm:w-[300px] h-[76px] bg-white text-black font-semibold tracking-widest hover:bg-gray-100 active:scale-95 transition-all shadow-[0_8px_30px_rgba(255,255,255,0.15)] text-[15px] uppercase rounded-sm">
                                Start Room Designer <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                            <Link to="/shop" className="inline-flex items-center justify-center gap-4 w-full sm:w-[300px] h-[76px] bg-black/20 hover:bg-black/40 backdrop-blur-lg border border-white/50 text-white font-semibold tracking-widest active:scale-95 transition-all text-[15px] uppercase rounded-sm">
                                Browse Furniture
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════ FEATURE HIGHLIGHT SECTION ═══════════════ */}
            <section className="relative overflow-hidden" style={{ minHeight: '400px' }}>
                {/* Background Video */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    src="/furniture-bg.mp4"
                    poster="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=2560"
                />
                <div className="absolute inset-0 z-10 bg-black/60" />

                <div className="container-centered relative z-20 flex items-center" style={{ minHeight: '400px' }}>
                    <div className="grid-system grid p-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full" style={{ padding: '80px 0' }}>
                        {[
                            { icon: Box, title: '3D Visualization', desc: 'See true-to-scale models in your space.' },
                            { icon: MousePointerClick, title: 'Real-Time Placement', desc: 'Drag, drop, and rotate items instantly.' },
                            { icon: Award, title: 'Premium Quality', desc: 'Made from handcrafted, sustainable materials.' },
                            { icon: Layers, title: '500+ Products', desc: 'Explore a vast furniture collection.' },
                        ].map((f, i) => (
                            <Reveal key={i} delay={i * 0.1}>
                                <div className="flex flex-col items-center text-center group px-4">
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105 bg-white/10 backdrop-blur-md border border-white/20">
                                        <f.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 tracking-tight text-white">{f.title}</h3>
                                    <p className="text-sm leading-relaxed text-white/70">{f.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ FEATURED PRODUCTS SECTION ═══════════════ */}
            <section style={{ padding: '60px 0' }}>
                <div className="container-centered">
                    {/* Clean header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4" style={{ marginBottom: '45px' }}>
                        <Reveal>
                            <div>
                                <p className="text-[11px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: 'var(--accent)' }}>Curated Collection</p>
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Trending Pieces</h2>
                            </div>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <Link to="/shop" className="group inline-flex items-center gap-2 text-[14px] font-semibold hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text-secondary)' }}>
                                View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Reveal>
                    </div>

                    {/* Product Grid */}
                    <div className="grid-system grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {displayProducts.map((p, i) => (
                            <Reveal key={p._id} delay={i * 0.1}>
                                <ProductCard product={p} />
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ ROOM DESIGNER PROMOTION ═══════════════ */}
            <section className="relative overflow-hidden" style={{ minHeight: '500px' }}>
                {/* Full-width background image */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2560")' }}
                />
                <div className="absolute inset-0 z-10 bg-black/50" />

                <div className="container-centered relative z-20 flex items-center" style={{ minHeight: '500px' }}>
                    <Reveal>
                        <div className="max-w-xl text-center mx-auto" style={{ padding: '80px 0' }}>
                            <p className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/70 mb-6">Interactive Experience</p>
                            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
                                Design Your Room in 3D
                            </h2>
                            <p className="text-lg text-white/80 mb-10 leading-relaxed">
                                Place furniture, experiment with layouts, and visualize your dream space before you buy.
                            </p>
                            <Link to="/designer" className="inline-flex items-center justify-center gap-3 w-[280px] h-[64px] bg-white text-black font-semibold tracking-widest text-[14px] uppercase rounded-sm hover:bg-gray-100 active:scale-95 transition-all">
                                Open Room Designer <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ═══════════════ TESTIMONIAL SECTION ═══════════════ */}
            <section className="relative overflow-hidden" style={{ padding: '80px 0', background: '#111' }}>
                <div className="container-centered">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4" style={{ marginBottom: '50px' }}>
                        <Reveal>
                            <div>
                                <p className="text-[11px] uppercase tracking-[0.2em] font-bold mb-3 text-white/40">Testimonials</p>
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Loved by Customers</h2>
                            </div>
                        </Reveal>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Sarah M.', role: 'Interior Designer', text: 'The 3D room visualization tool completely changed how I shop for furniture. Seeing exact proportions in my space gave me confidence to buy.', rating: 5 },
                            { name: 'James L.', role: 'Homeowner', text: 'Absolutely stunning quality. The walnut dining table looks identical to the 3D model, down to the wood grain. Flawless delivery.', rating: 5 },
                            { name: 'Elena R.', role: 'Architect', text: 'An incredibly clean interface with a gorgeous selection. The AR/3D integration is the best I\'ve seen in e-commerce.', rating: 5 }
                        ].map((review, i) => (
                            <Reveal key={i} delay={i * 0.1}>
                                <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 flex flex-col h-full hover:bg-white/10 transition-all duration-300 hover:-translate-y-1" style={{ padding: '40px' }}>
                                    {/* Large decorative quote */}
                                    <span className="text-4xl font-serif text-white/20 leading-none mb-6">"</span>
                                    
                                    <p className="text-[16px] leading-[1.8] mb-10 flex-1 text-white/75 font-light">{review.text}</p>
                                    
                                    <div className="flex gap-1 mb-8">
                                        {[...Array(review.rating)].map((_, idx) => <Star key={idx} className="w-4 h-4 text-amber-500 fill-amber-500" />)}
                                    </div>
                                    
                                    <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base text-white" style={{ background: 'var(--accent)' }}>
                                            {review.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[15px] text-white">{review.name}</h4>
                                            <p className="text-[13px] text-white/40 mt-1">{review.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ BLOG SECTION ═══════════════ */}
            <section style={{ padding: '80px 0' }}>
                <div className="container-centered">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4" style={{ marginBottom: '60px' }}>
                        <Reveal>
                            <div>
                                <p className="text-[11px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: 'var(--accent)' }}>Editor's Picks</p>
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Design Inspiration</h2>
                            </div>
                        </Reveal>
                        <Reveal delay={0.1}>
                            <Link to="/blog" className="group inline-flex items-center gap-2 text-[14px] font-semibold hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text-secondary)' }}>
                                View All Articles <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Reveal>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {displayBlogs.map((blog, i) => (
                            <Reveal key={blog._id} delay={i * 0.1}>
                                <motion.div whileHover={{ y: -6 }} className="group flex flex-col h-full cursor-pointer">
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 relative">
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10" />
                                        <img 
                                            src={blog.coverImage || blog.image || BLOG_IMAGES[i % BLOG_IMAGES.length]}
                                            alt={blog.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex items-center gap-3 text-[12px] font-semibold tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
                                            <span style={{ color: 'var(--accent)' }}>{blog.category || 'Trends'}</span>
                                            <span className="w-1 h-1 rounded-full bg-current opacity-30" />
                                            <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--accent)] transition-colors leading-snug" style={{ color: 'var(--text-primary)' }}>
                                            {blog.title}
                                        </h3>
                                        <p className="text-[15px] leading-relaxed mb-6 flex-1 line-clamp-2 font-light" style={{ color: 'var(--text-secondary)' }}>
                                            {blog.excerpt}
                                        </p>
                                        <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest mt-auto group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                                            Read Article <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ NEWSLETTER SECTION ═══════════════ */}
            <section className="relative overflow-hidden" style={{ minHeight: '600px' }}>
                {/* Immersive Background Image */}
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=2560")' }}
                />
                {/* Dark Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 z-10 bg-black/60" />

                <div className="container-centered relative z-20 flex items-center justify-center" style={{ minHeight: '600px' }}>
                    <Reveal>
                        <div className="max-w-3xl text-center w-full mx-auto p-4">
                            <p className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/70 mb-6">Stay Connected</p>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                                Join Our Newsletter
                            </h2>
                            <p className="text-lg text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto font-light">
                                Get exclusive design tips, early access to new collections, and special offers delivered straight to your inbox.
                            </p>
                            
                            <form 
                                className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full mt-6" 
                                onSubmit={(e) => { e.preventDefault(); toast.success('Subscribed successfully!'); }}
                            >
                                <input
                                    type="email"
                                    placeholder="Your email address..."
                                    required
                                    className="w-full sm:w-[380px] h-[52px] bg-white/10 backdrop-blur-md border border-white/20 px-6 rounded-full outline-none text-[15px] text-white placeholder-white/60 focus:bg-[#ffffff25] transition-all duration-300 shadow-xl"
                                />
                                <button 
                                    type="submit" 
                                    className="w-full sm:w-[160px] h-[52px] flex items-center justify-center rounded-full bg-white font-bold text-black text-[13px] uppercase tracking-wider transition-transform hover:scale-[1.03] active:scale-95 shadow-xl shrink-0" 
                                >
                                    Subscribe
                                </button>
                            </form>
                            
                            <p className="text-[13px] mt-8 font-light text-white/50">
                                By subscribing, you agree to our Privacy Policy. You can unsubscribe at any time.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>
        </div>
    );
}
