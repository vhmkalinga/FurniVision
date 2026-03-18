import { Link } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
    const { addItem } = useCart();

    const handleAdd = (e) => {
        e.preventDefault();
        addItem(product);
        toast.success(`${product.name} added to cart!`);
    };

    const getFallbackImage = (catName) => {
        const name = (catName || '').toLowerCase();
        if (name.includes('sofa')) return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600';
        if (name.includes('chair') || name.includes('seating')) return 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600';
        if (name.includes('table')) return 'https://images.unsplash.com/photo-1577140917170-2856f6aa9ec5?auto=format&fit=crop&q=80&w=600';
        if (name.includes('bed')) return 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=600';
        if (name.includes('light')) return 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600';
        return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600';
    };

    const imageUrl = product.images?.[0]?.url || product.images?.[0] || getFallbackImage(product.category?.name);

    return (
        <Link to={`/product/${product._id}`} className="group block">
            {/* Image — borderless, full-width, zoom on hover */}
            <div className="aspect-[4/5] relative overflow-hidden rounded-2xl bg-[var(--bg-secondary)] mb-5">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />

                {product.featured && (
                    <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/90 text-black z-10">
                        Featured
                    </span>
                )}

                {/* Subtle bottom gradient for add-to-cart */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

                {/* Quick Add pill — slides up from bottom on hover */}
                <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <button
                        onClick={handleAdd}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-[13px] font-bold bg-white text-black hover:bg-gray-100 active:scale-95 transition-all shadow-lg"
                    >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Quick Add
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="px-1 space-y-2">
                {/* Category + Price row */}
                <div className="flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-[0.15em] font-bold" style={{ color: 'var(--accent)' }}>
                        {product.category?.name || 'Furniture'}
                    </p>
                    <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
                        ${(product.price || 0).toLocaleString()}
                    </p>
                </div>

                {/* Name */}
                <h3 className="text-[15px] font-semibold leading-snug line-clamp-1 transition-colors duration-200 group-hover:text-[var(--accent)]" style={{ color: 'var(--text-primary)' }}>
                    {product.name}
                </h3>

                {/* Rating */}
                {(product.rating || product.reviewCount > 0) && (
                    <div className="flex items-center gap-1.5">
                        <div className="flex text-amber-500">
                            {[...Array(5)].map((_, idx) => (
                                <Star
                                    key={idx}
                                    className={`w-[10px] h-[10px] ${idx < Math.floor(product.rating || 5) ? 'fill-current' : ''}`}
                                    style={{ color: idx >= Math.floor(product.rating || 5) ? 'var(--border-color)' : '' }}
                                />
                            ))}
                        </div>
                        {product.reviewCount > 0 && (
                            <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                                ({product.reviewCount})
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
}
