import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ArrowLeft, Package, Tag, Truck, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

export default function Cart() {
    const { items, removeItem, updateQuantity, clearCart, total } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const itemCount = items.reduce((s, i) => s + i.quantity, 0);

    const handleCheckout = () => {
        if (!user) { navigate('/login'); return; }
        navigate('/checkout');
    };

    /* ── Empty state ── */
    if (items.length === 0) {
        return (
            <div className="min-h-[85vh] flex flex-col items-center justify-center bg-[var(--bg-primary)] px-6 py-32">
                <div className="flex flex-col items-center gap-12 text-center max-w-2xl mx-auto">
                    <div
                        className="w-40 h-40 rounded-full flex items-center justify-center mb-6 shadow-sm"
                        style={{ background: 'var(--bg-secondary)' }}
                    >
                        <ShoppingBag className="w-16 h-16" style={{ color: 'var(--text-muted)' }} />
                    </div>
                    
                    <div className="space-y-6">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                            Your cart is empty.
                        </h2>
                        <p className="text-lg md:text-xl leading-relaxed font-medium max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
                            You haven't added anything yet. Browse our curated collection to find the perfect piece for your space.
                        </p>
                    </div>

                    <Link
                        to="/shop"
                        className="group mt-8 inline-flex items-center gap-4 px-12 py-5 rounded-full text-[15px] font-bold uppercase tracking-[0.2em] transition-all duration-300 text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)]"
                        style={{ border: '1px solid var(--border-color)' }}
                    >
                        Start Browsing
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
            <div className="container-centered pt-32 pb-28">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 w-full">
                    <div>
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest mb-4 transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
                        </Link>
                        <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                            Your Cart
                        </h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                            {itemCount} item{itemCount !== 1 ? 's' : ''} selected
                        </p>
                    </div>
                    <button
                        onClick={() => { clearCart(); toast.success('Cart cleared'); }}
                        className="text-xs font-semibold uppercase tracking-widest transition-colors self-start sm:self-auto"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                        Clear All
                    </button>
                </div>

                {/* ── Main grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-16">

                    {/* ── Left: Cart Items ── */}
                    <div className="space-y-8">
                        {items.map((item, index) => {
                            const imgSrc = item.images?.[0]?.url || item.images?.[0] || null;
                            return (
                                <div
                                    key={item._id}
                                    className="group flex flex-col sm:flex-row gap-8 sm:gap-12 py-10 transition-all border-b border-[var(--border-color)] last:border-0"
                                    style={{ animationDelay: `${index * 60}ms` }}
                                >
                                    {/* Thumbnail */}
                                    <div
                                        className="w-full sm:w-48 h-48 rounded-[1.5rem] overflow-hidden flex-shrink-0 flex items-center justify-center relative bg-[var(--bg-primary)] shadow-sm"
                                    >
                                        {imgSrc
                                            ? <img src={imgSrc} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            : <Package className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
                                        }
                                    </div>

                                    {/* Details */}
                                    <div className="flex flex-1 flex-col py-1">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                {item.category?.name && (
                                                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>
                                                        {item.category.name}
                                                    </p>
                                                )}
                                                <h3 className="text-xl md:text-2xl font-bold leading-tight mb-2 pr-4" style={{ color: 'var(--text-primary)' }}>
                                                    {item.name}
                                                </h3>
                                                {item.selectedColor && (
                                                    <p className="text-sm mb-4 font-medium" style={{ color: 'var(--text-muted)' }}>
                                                        Color: {item.selectedColor}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-auto pt-6 gap-6">
                                            <div className="flex flex-col gap-1.5">
                                                <p className="text-sm font-semibold text-[var(--text-muted)]">
                                                    ${item.price.toFixed(2)} each
                                                </p>
                                                <p className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>

                                            {/* Controls */}
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => { removeItem(item._id); toast.success('Removed'); }}
                                                    className="w-12 h-12 rounded-[1rem] transition-all flex items-center justify-center shadow-sm shrink-0"
                                                    style={{ color: 'var(--text-muted)', background: 'var(--bg-primary)' }}
                                                    onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'var(--bg-card)'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'var(--bg-primary)'; }}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>

                                                {/* Qty stepper */}
                                                <div
                                                    className="flex items-center rounded-full overflow-hidden shadow-sm shrink-0 h-10 border border-[var(--border-color)]"
                                                    style={{ background: 'var(--bg-card)' }}
                                                >
                                                    <button
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    className="w-10 h-10 flex items-center justify-center transition-colors"
                                                    style={{ color: 'var(--text-secondary)' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span
                                                    className="w-12 h-10 flex items-center justify-center text-[15px] font-bold select-none"
                                                    style={{ color: 'var(--text-primary)' }}
                                                >
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    className="w-10 h-10 flex items-center justify-center transition-colors"
                                                    style={{ color: 'var(--text-secondary)' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ── Right: Order Summary ── */}
                    <div className="lg:sticky lg:top-28 h-fit">
                        <div className="py-2">
                            <h2 className="font-bold text-3xl mb-10 tracking-tight" style={{ color: 'var(--text-primary)' }}>Order Summary</h2>

                            <div className="space-y-6 mb-8">
                                <div className="flex justify-between items-center text-[15px]">
                                    <span style={{ color: 'var(--text-muted)' }}>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[15px]">
                                    <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                                    <span className="font-semibold text-emerald-500">Free</span>
                                </div>
                                <div className="flex justify-between items-center text-[15px]">
                                    <span style={{ color: 'var(--text-muted)' }}>Estimated Tax</span>
                                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>—</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end pt-8 mb-10">
                                <span className="text-lg font-semibold" style={{ color: 'var(--text-muted)' }}>Total</span>
                                <span className="text-5xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>${total.toFixed(2)}</span>
                            </div>

                            <div className="space-y-4 mb-12">
                                <button
                                    onClick={handleCheckout}
                                    className="w-full flex items-center justify-center py-4 rounded-xl text-[15px] font-semibold transition-all hover:opacity-90 active:scale-[0.98] shadow-sm"
                                    style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                                >
                                    Proceed to Checkout
                                </button>
                                <Link
                                    to="/shop"
                                    className="w-full flex items-center justify-center py-4 rounded-xl text-[15px] font-semibold transition-all"
                                    style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
