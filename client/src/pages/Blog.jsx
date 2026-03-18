import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import api from '../api';

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

function Reveal({ children, delay = 0 }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay }}>
            {children}
        </motion.div>
    );
}

export default function Blog() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const params = search ? `?search=${search}` : '';
        api.get(`/blogs${params}`).then(r => setBlogs(r.data.blogs)).catch(() => { }).finally(() => setLoading(false));
    }, [search]);

    return (
        <div className="w-full pb-16 lg:pb-24">
            {/* Immersive Hero Header */}
            <div className="relative w-full h-[400px] sm:h-[450px] lg:h-[500px] mb-0 flex items-center justify-center overflow-hidden" style={{ marginTop: '-90px', paddingTop: '90px' }}>
                <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-[20s] hover:scale-110"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80")' }}
                />
                <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[2px]" />
                
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
                    <Reveal delay={0.1}>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                            Design <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">Inspiration</span>
                        </h1>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
                            Discover the latest trends, styling tips, and behind-the-scenes stories from the world of premium furniture design.
                        </p>
                    </Reveal>
                </div>
            </div>

            {/* Static non-animated spacer – gap must not depend on framer-motion y offset */}
            <div className="w-full" style={{ height: '32px' }} />

            <div className="container-centered pb-0">
                {/* Search Area */}
                <Reveal delay={0.2}>
                    <div className="flex flex-col items-center justify-center w-full mb-20 md:mb-28">
                        <div className="relative w-full max-w-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/10 to-[var(--text-primary)]/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                            <div className="flex items-center w-full border border-[var(--border-color)] rounded-full hover:border-[var(--text-muted)] transition-all px-8 py-5 bg-[var(--bg-card)] relative z-20 shadow-lg hover:shadow-xl">
                                <Search className="w-6 h-6 text-[var(--text-muted)] mr-4 flex-shrink-0" />
                                <input 
                                    type="text" 
                                    placeholder="Search articles, guides, and inspiration..." 
                                    value={search} 
                                    onChange={e => setSearch(e.target.value)} 
                                    className="w-full bg-transparent border-none focus:ring-0 text-[16px] sm:text-[18px] text-[var(--text-primary)] placeholder-[var(--text-muted)] p-0 m-0" 
                                    style={{ boxShadow: 'none', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* Guaranteed Visual Spacer */}
                <div className="w-full h-[40px] sm:h-[60px] shrink-0 block" aria-hidden="true"></div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="card-flat">
                                <div className="aspect-[16/10] skeleton rounded-2xl" />
                                <div className="p-5 space-y-4">
                                    <div className="h-4 w-24 skeleton rounded-md" />
                                    <div className="h-6 w-3/4 skeleton rounded-md" />
                                    <div className="h-4 w-full skeleton rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
            ) : blogs.length === 0 ? (
                <div className="text-center py-24">
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No articles found</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Try a different search term.</p>
                </div>
            ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                        {blogs.map((blog, i) => (
                            <Reveal key={blog._id} delay={i * 0.08}>
                                <Link to={`/blog/${blog.slug}`} className="group block">
                                    {/* Image — full bleed, no card box */}
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-[var(--bg-secondary)]">
                                        <img
                                            src={blog.coverImage || BLOG_IMAGES[i % BLOG_IMAGES.length]}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                        />
                                    </div>

                                    {/* Meta */}
                                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--accent)' }}>
                                        <span>{blog.category || 'Design'}</span>
                                        <span className="opacity-30">·</span>
                                        <span style={{ color: 'var(--text-muted)' }}>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-[18px] font-bold leading-snug mb-3 transition-colors duration-200 group-hover:text-[var(--accent)]" style={{ color: 'var(--text-primary)' }}>
                                        {blog.title}
                                    </h2>

                                    {/* Excerpt */}
                                    <p className="text-[13px] leading-relaxed line-clamp-2 mb-5" style={{ color: 'var(--text-muted)' }}>
                                        {blog.excerpt}
                                    </p>

                                    {/* CTA */}
                                    <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors duration-200 group-hover:text-[var(--accent)]" style={{ color: 'var(--text-primary)' }}>
                                        Read Article
                                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                                    </div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                )}
            </div>
            <div className="h-16 lg:h-24" />
        </div>
    );
}
