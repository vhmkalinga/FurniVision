import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCart();
    const itemCount = items.reduce((s, i) => s + i.quantity, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[60]"
                        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
                        onClick={closeCart}
                    />

                    {/* Drawer */}
                    <motion.div
                        key="drawer"
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                        className="fixed top-0 right-0 bottom-0 z-[70] flex flex-col w-full max-w-[440px] shadow-2xl"
                        style={{ background: 'var(--bg-primary)', borderLeft: '1px solid var(--border-color)' }}
                    >
                        {/* ── Header ── */}
                        <div
                            className="flex items-center justify-between px-6 py-5 relative"
                            style={{ borderBottom: '1px solid var(--border-color)' }}
                        >
                            {/* Empty div for flex spacing balance */}
                            <div className="w-10 h-10"></div>
                            
                            {/* Centered Logo & Text */}
                            <div className="flex items-center justify-center gap-3 absolute left-1/2 -translate-x-1/2 w-max">
                                <ShoppingBag className="w-[18px] h-[18px]" style={{ color: 'var(--text-primary)' }} />
                                <span className="font-bold text-[15px]" style={{ color: 'var(--text-primary)' }}>
                                    Cart
                                </span>
                                {itemCount > 0 && (
                                    <span
                                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                                        style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}
                                    >
                                        {itemCount}
                                    </span>
                                )}
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={closeCart}
                                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors relative z-10"
                                style={{ color: 'var(--text-muted)' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* ── Items ── */}
                        <div className="flex-1 overflow-y-auto py-4 px-6 space-y-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4 py-20 text-center">
                                    <div
                                        className="w-20 h-20 rounded-2xl flex items-center justify-center"
                                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
                                    >
                                        <ShoppingBag className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Nothing here yet</p>
                                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Add items to get started</p>
                                    </div>
                                    <button
                                        onClick={closeCart}
                                        className="text-sm font-semibold transition-colors"
                                        style={{ color: 'var(--accent)' }}
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map(item => {
                                    const imgSrc = item.images?.[0]?.url || item.images?.[0] || null;
                                    return (
                                        <motion.div
                                            key={item._id}
                                            layout
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="flex gap-4 p-4 rounded-2xl shadow-sm"
                                            style={{
                                                background: 'var(--bg-secondary)',
                                                border: '1px solid var(--border-color)'
                                            }}
                                        >
                                            {/* Thumbnail */}
                                            <div
                                                className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center relative group"
                                                style={{ background: 'var(--bg-secondary)' }}
                                            >
                                                {imgSrc
                                                    ? <img src={imgSrc} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                                    : <Package className="w-6 h-6" style={{ color: 'var(--text-muted)' }} />
                                                }
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                                                <div className="flex-1">
                                                    <p className="text-[15px] font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                                                        {item.name}
                                                    </p>
                                                </div>
                                                
                                                {item.selectedColor && (
                                                    <p className="text-xs mb-3 font-medium" style={{ color: 'var(--text-muted)' }}>Color: {item.selectedColor}</p>
                                                )}

                                                <div className="flex items-end justify-between mt-auto">
                                                    <p className="text-base font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </p>

                                                    {/* Controls */}
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => { removeItem(item._id); toast.success('Removed'); }}
                                                            className="w-8 h-8 rounded-lg transition-all flex items-center justify-center shadow-sm shrink-0"
                                                            style={{ color: 'var(--text-muted)', background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}
                                                            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                                                            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'var(--bg-primary)'; }}
                                                        >
                                                            <Trash2 className="w-[15px] h-[15px]" />
                                                        </button>

                                                        {/* Qty */}
                                                        <div
                                                            className="flex items-center rounded-xl overflow-hidden shadow-sm shrink-0"
                                                            style={{ border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}
                                                        >
                                                        <button
                                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                            className="w-8 h-8 flex items-center justify-center transition-colors"
                                                            style={{ color: 'var(--text-secondary)' }}
                                                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                        >
                                                            <Minus className="w-3.5 h-3.5" />
                                                        </button>
                                                        <span
                                                            className="w-8 h-8 flex items-center justify-center text-[13px] font-bold select-none"
                                                            style={{
                                                                color: 'var(--text-primary)',
                                                                borderLeft: '1px solid var(--border-color)',
                                                                borderRight: '1px solid var(--border-color)'
                                                            }}
                                                        >
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                            className="w-8 h-8 flex items-center justify-center transition-colors"
                                                            style={{ color: 'var(--text-secondary)' }}
                                                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>

                        {/* ── Footer ── */}
                        {items.length > 0 && (
                            <div
                                className="px-6 py-6 space-y-4"
                                style={{ borderTop: '1px solid var(--border-color)' }}
                            >
                                {/* Subtotal */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                        Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})
                                    </span>
                                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                        ${total.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Shipping</span>
                                    <span className="text-sm font-semibold text-emerald-500">Free</span>
                                </div>

                                {/* Checkout CTA */}
                                <Link
                                    to="/cart"
                                    onClick={closeCart}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg text-[15px] font-semibold transition-all hover:bg-opacity-90 active:scale-[0.98] shadow-sm"
                                    style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}
                                >
                                    View Cart & Checkout
                                </Link>

                                <p className="text-center text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                    Free delivery on all orders
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
