import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Search, Box, Star, Eye, ChevronLeft, ChevronRight, ShoppingBag, SlidersHorizontal, X } from 'lucide-react';
import api from '../api';
import ProductCard from '../components/ui/ProductCard';

function Reveal({ children, delay = 0 }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay }}>
            {children}
        </motion.div>
    );
}

export default function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [sortOpen, setSortOpen] = useState(false);

    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || '';
    const page = parseInt(searchParams.get('page') || '1');

    useEffect(() => {
        api.get('/categories').then(r => setCategories(r.data.categories)).catch(() => { });
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (sort) params.set('sort', sort);
        if (search) params.set('search', search);
        params.set('page', page);
        params.set('limit', 12);
        api.get(`/products?${params.toString()}`).then(r => {
            setProducts(r.data.products);
            setTotal(r.data.total);
            setPages(r.data.pages);
        }).catch(() => { }).finally(() => setLoading(false));
    }, [category, sort, page, search]);

    const updateFilter = (key, value) => {
        const p = new URLSearchParams(searchParams);
        if (value) p.set(key, value); else p.delete(key);
        p.set('page', '1'); // reset page when changing filters
        setSearchParams(p);
    };

    // Navigate to a specific page WITHOUT resetting it back to 1
    const goToPage = (newPage) => {
        const p = new URLSearchParams(searchParams);
        p.set('page', String(newPage));
        setSearchParams(p);
    };

    return (
        <div className="w-full pb-32 lg:pb-48">
            {/* Immersive Hero Header */}
            <div className="relative w-full h-100 sm:h-112.5 lg:h-125 mb-16 flex items-center justify-center overflow-hidden" style={{ marginTop: '-90px', paddingTop: '90px' }}>
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=2560")' }}
                />
                <div className="absolute inset-0 bg-black/60" />
                <Reveal delay={0.1}>
                    <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto">
                        <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-white/70 mb-6 block">Our Collection</span>
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight">Shop Premium Furniture</h1>
                        <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                            Discover hand-selected pieces designed to elevate your living spaces with timeless elegance and modern comfort.
                        </p>
                    </div>
                </Reveal>
            </div>

            <div className="container-centered max-w-7xl mx-auto px-6 lg:px-12">
                {/* Static spacer — gap must not depend on framer-motion y offset */}
                <div className="h-10" />

                {/* ── Filter bar ── */}
                <Reveal delay={0.15}>
                    <div className="flex flex-col gap-6 w-full mb-10">

                        {/* Category tabs — underline style */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            <button
                                onClick={() => updateFilter('category', '')}
                                className={`relative pb-1.5 text-[13px] font-semibold transition-all duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-300 ${!category
                                    ? 'text-(--text-primary) after:w-full after:bg-[var(--text-primary)]'
                                    : 'text-(--text-muted) hover:text-(--text-primary) after:w-0 hover:after:w-full after:bg-[var(--text-primary)]'}`}
                            >
                                All
                            </button>
                            {categories.map(c => (
                                <button
                                    key={c._id}
                                    onClick={() => updateFilter('category', c._id)}
                                    className={`relative pb-1.5 text-[13px] font-semibold transition-all duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-300 ${category === c._id
                                        ? 'text-(--text-primary) after:w-full after:bg-[var(--text-primary)]'
                                        : 'text-(--text-muted) hover:text-(--text-primary) after:w-0 hover:after:w-full after:bg-[var(--text-primary)]'}`}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>

                        {/* Result count + search + sort */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <p className="text-[13px] font-medium" style={{ color: 'var(--text-muted)' }}>
                                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{total}</span> products found
                            </p>

                            <div className="flex items-center gap-6">
                                {/* Search */}
                                <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-1 w-52 focus-within:border-[var(--text-primary)] transition-colors">
                                    <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="w-full bg-transparent border-none text-[14px] text-[var(--text-primary)] placeholder-[var(--text-muted)] p-0 m-0 focus:ring-0"
                                        style={{ boxShadow: 'none', outline: 'none' }}
                                    />
                                    {search && <button onClick={() => setSearch('')}><X className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} /></button>}
                                </div>

                                {/* Sort — custom modern dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setSortOpen(v => !v)}
                                        className="flex items-center gap-2 text-[13px] font-semibold transition-colors hover:text-[var(--text-primary)] group"
                                        style={{ color: sort ? 'var(--text-primary)' : 'var(--text-muted)' }}
                                    >
                                        <SlidersHorizontal className="w-4 h-4 flex-shrink-0" />
                                        <span>
                                            {sort === 'price_asc' ? 'Low → High' :
                                             sort === 'price_desc' ? 'High → Low' :
                                             sort === 'name' ? 'Name A–Z' :
                                             sort === 'rating' ? 'Top Rated' : 'Sort'}
                                        </span>
                                        <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${sortOpen ? 'rotate-90' : ''}`} />
                                    </button>

                                    {sortOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                                            <motion.ul
                                                initial={{ opacity: 0, scale: 0.96, y: -6 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                transition={{ duration: 0.15, ease: 'easeOut' }}
                                                className="absolute top-[calc(100%+8px)] right-0 w-48 z-50 rounded-xl overflow-hidden shadow-xl border border-[var(--border-color)] bg-[var(--bg-card)] py-1"
                                            >
                                                {[
                                                    { label: 'Default', value: '' },
                                                    { label: 'Price: Low → High', value: 'price_asc' },
                                                    { label: 'Price: High → Low', value: 'price_desc' },
                                                    { label: 'Name A–Z', value: 'name' },
                                                    { label: 'Top Rated', value: 'rating' },
                                                ].map(opt => (
                                                    <li key={opt.value}>
                                                        <button
                                                            onClick={() => { updateFilter('sort', opt.value); setSortOpen(false); }}
                                                            className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors flex items-center justify-between gap-3
                                                                hover:bg-[var(--bg-secondary)]
                                                                ${sort === opt.value ? 'font-bold text-[var(--text-primary)]' : 'font-medium text-[var(--text-secondary)]'}`}
                                                        >
                                                            {opt.label}
                                                            {sort === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />}
                                                        </button>
                                                    </li>
                                                ))}
                                            </motion.ul>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Thin divider */}
                        <div className="w-full h-px" style={{ background: 'var(--border-color)' }} />
                    </div>
                </Reveal>

                {/* Guaranteed Visual Spacer */}
                <div className="w-full h-[60px] sm:h-[80px] shrink-0 block" aria-hidden="true"></div>

                {/* Grid */}
                <div>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="card-flat">
                                    <div className="aspect-[4/3] skeleton rounded-2xl" />
                                    <div className="p-5 space-y-4">
                                        <div className="h-3 w-16 skeleton rounded-md" />
                                        <div className="h-4 w-3/4 skeleton rounded-md" />
                                        <div className="h-5 w-20 skeleton rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-32 flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-8">
                                <Box className="w-10 h-10 text-[var(--text-muted)]" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 tracking-tight" style={{ color: 'var(--text-primary)' }}>No pieces found</h3>
                            <p className="text-lg font-light text-[var(--text-secondary)] max-w-md">We couldn't find any designs matching your current filters. Try exploring other categories.</p>
                            <button onClick={() => { setSearch(''); updateFilter('category', ''); }} className="mt-8 px-8 py-4 rounded-full bg-[var(--accent)] text-white font-bold text-[13px] tracking-widest uppercase hover:scale-105 transition-transform shadow-lg">
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                                {products.map((p, i) => (
                                    <Reveal key={p._id} delay={i * 0.05}>
                                        <ProductCard product={p} />
                                    </Reveal>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pages > 1 && (
                                <>
                                    <div className="h-16" />
                                    <div className="flex items-center justify-center gap-4">
                                        <button onClick={() => goToPage(Math.max(1, page - 1))} disabled={page === 1} className="flex items-center gap-2 text-[13px] font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-30 hover:text-[var(--accent)]">
                                            <ChevronLeft className="w-4 h-4" /> Prev
                                        </button>
                                        <div className="flex gap-2">
                                            {[...Array(pages)].map((_, i) => (
                                                <button key={i} onClick={() => goToPage(i + 1)}
                                                    className="w-10 h-10 rounded-full text-[14px] font-bold transition-all duration-300 flex items-center justify-center"
                                                    style={{ 
                                                        color: page === i + 1 ? 'white' : 'var(--text-secondary)', 
                                                        background: page === i + 1 ? 'var(--accent)' : 'transparent',
                                                    }}>
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>
                                        <button onClick={() => goToPage(Math.min(pages, page + 1))} disabled={page === pages} className="flex items-center gap-2 text-[13px] font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-30 hover:text-[var(--accent)]">
                                            Next <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
                <div className="h-20 lg:h-28" />
            </div>
        </div>
    );
}
