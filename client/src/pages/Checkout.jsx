import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ArrowRight, Check, Lock, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

/* ─── Underline Input ─── */
function Field({ label, name, type = 'text', placeholder, value, onChange, required, children }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: 'var(--text-muted)' }}>{label}</span>
            <div className="border-b pb-2 transition-colors duration-300 focus-within:border-(--text-primary)" style={{ borderColor: 'var(--border-color)' }}>
                {children ?? (
                    <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} required={required}
                        className="w-full bg-transparent border-none p-0 text-[15px] focus:outline-none focus:ring-0 placeholder:opacity-30"
                        style={{ color: 'var(--text-primary)', boxShadow: 'none' }} />
                )}
            </div>
        </div>
    );
}

/* ─── Collapsed step pill ─── */
function DoneStep({ num, title, summary, onEdit }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-start justify-between py-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-start gap-5">
                <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'var(--accent)' }}>
                    <Check className="w-3.5 h-3.5 text-white" />
                </span>
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>{num} — {title}</p>
                    <p className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>{summary}</p>
                </div>
            </div>
            <button onClick={onEdit} className="text-[11px] font-bold uppercase tracking-widest transition-colors hover:opacity-70" style={{ color: 'var(--accent)' }}>Edit</button>
        </motion.div>
    );
}

export default function Checkout() {
    const { items, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep]       = useState(0);
    const [loading, setLoading] = useState(false);

    const [ship, setShip] = useState({
        firstName: '', lastName: '', email: user?.email || '',
        phone: '', street: '', city: '', state: '', zip: '', country: 'US',
    });
    const [pay, setPay] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '' });

    const upd = (setter) => (e) => setter(p => ({ ...p, [e.target.name]: e.target.value }));
    const fmtCard   = (v) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    const fmtExpiry = (v) => v.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5);

    const shippingCost = total >= 500 ? 0 : 29;
    const tax          = +(total * 0.08).toFixed(2);
    const grand        = +(total + shippingCost + tax).toFixed(2);

    const placeOrder = async () => {
        setLoading(true);
        try {
            await api.post('/orders', {
                items: items.map(i => ({ product: i._id, name: i.name, price: i.price, quantity: i.quantity })),
                shippingAddress: { street: ship.street, city: ship.city, state: ship.state, zip: ship.zip, country: ship.country },
            });
            clearCart();
            toast.success('Order placed! 🎉');
            navigate('/dashboard');
        } catch { toast.error('Something went wrong. Please try again.'); }
        finally { setLoading(false); }
    };

    if (items.length === 0) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32, padding: '0 24px' }}>
                <ShoppingBag style={{ width: 52, height: 52, color: 'var(--text-muted)' }} />
                <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>Your cart is empty</h2>
                <Link to="/shop" className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-[12px] uppercase tracking-widest border transition-all duration-300 hover:opacity-80" style={{ borderColor: 'var(--text-primary)', color: 'var(--text-primary)' }}>
                    Browse Collection <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* ── Top bar ── */}
            <div style={{ width: '100%', maxWidth: 680, borderBottom: '1px solid var(--border-color)', padding: '1.1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link to="/cart" className="flex items-center gap-2 transition-opacity hover:opacity-60" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', textDecoration: 'none' }}>
                    <ArrowLeft className="w-3.5 h-3.5" /> Cart
                </Link>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Checkout</span>
                <span className="flex items-center gap-1" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    <Lock className="w-3 h-3" /> SSL Secured
                </span>
            </div>

            {/* ── Main content ── */}
            <div style={{ width: '100%', maxWidth: 680, padding: '3rem 1.5rem 7rem' }}>

                {/* ── Order items (collapsed list) ── */}
                <div style={{ marginBottom: '3rem' }}>
                    <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                        Your Order — {items.reduce((s, i) => s + i.quantity, 0)} items
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {items.map((item) => (
                            <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', background: 'var(--bg-secondary)', flexShrink: 0 }}>
                                    {item.images?.[0] && <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                </div>
                                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {item.name} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>×{item.quantity}</span>
                                </span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', flexShrink: 0 }}>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[
                            ['Subtotal', `$${total.toFixed(2)}`],
                            ['Shipping', shippingCost === 0 ? '✦ Free' : `$${shippingCost}`],
                            ['Tax (8%)', `$${tax}`],
                        ].map(([label, val]) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
                                <span style={{ fontSize: 13, color: shippingCost === 0 && label === 'Shipping' ? '#10b981' : 'var(--text-secondary)', fontWeight: label === 'Shipping' && shippingCost === 0 ? 600 : 400 }}>{val}</span>
                            </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border-color)', marginTop: 4 }}>
                            <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>Total</span>
                            <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>${grand}</span>
                        </div>
                    </div>
                </div>

                {/* ── Divider ── */}
                <div style={{ height: 1, background: 'var(--border-color)', marginBottom: '3rem' }} />

                {/* ── Completed steps (collapsed) ── */}
                {step > 0 && (
                    <DoneStep num="01" title="Shipping" onEdit={() => setStep(0)}
                        summary={`${ship.firstName} ${ship.lastName} · ${ship.street}, ${ship.city}`} />
                )}
                {step > 1 && (
                    <DoneStep num="02" title="Payment" onEdit={() => setStep(1)}
                        summary={`${pay.cardName} · •••• ${pay.cardNumber.replace(/\s/g,'').slice(-4)}`} />
                )}

                <AnimatePresence mode="wait">

                    {/* ── STEP 0: Shipping ── */}
                    {step === 0 && (
                        <motion.form key="ship" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
                            onSubmit={(e) => { e.preventDefault(); setStep(1); }}>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: '2.5rem', marginTop: step > 0 ? '2rem' : 0 }}>
                                <span style={{ fontSize: 48, fontWeight: 900, lineHeight: 1, color: 'var(--border-color)', fontVariantNumeric: 'tabular-nums' }}>01</span>
                                <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Shipping</h2>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem 2rem' }}>
                                <Field label="First Name" name="firstName" placeholder="John" value={ship.firstName} onChange={upd(setShip)} required />
                                <Field label="Last Name"  name="lastName"  placeholder="Doe"  value={ship.lastName}  onChange={upd(setShip)} required />
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <Field label="Email" name="email" type="email" placeholder="john@example.com" value={ship.email} onChange={upd(setShip)} required />
                                </div>
                                <Field label="Phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" value={ship.phone} onChange={upd(setShip)} />
                                <Field label="Country" name="country" placeholder="US" value={ship.country} onChange={upd(setShip)} required />
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <Field label="Street Address" name="street" placeholder="123 Main Street" value={ship.street} onChange={upd(setShip)} required />
                                </div>
                                <Field label="City"  name="city"  placeholder="New York" value={ship.city}  onChange={upd(setShip)} required />
                                <Field label="State" name="state" placeholder="NY"       value={ship.state} onChange={upd(setShip)} required />
                                <Field label="ZIP"   name="zip"   placeholder="10001"    value={ship.zip}   onChange={upd(setShip)} required />
                            </div>

                            <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="submit" className="group inline-flex items-center gap-3 rounded-full font-bold uppercase transition-all duration-300 hover:opacity-80"
                                    style={{ padding: '0.9rem 2.5rem', fontSize: 11, letterSpacing: '0.25em', background: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                                    Continue to Payment <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </motion.form>
                    )}

                    {/* ── STEP 1: Payment ── */}
                    {step === 1 && (
                        <motion.form key="pay" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
                            onSubmit={(e) => { e.preventDefault(); setStep(2); }}>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: '2.5rem', marginTop: '2rem' }}>
                                <span style={{ fontSize: 48, fontWeight: 900, lineHeight: 1, color: 'var(--border-color)' }}>02</span>
                                <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Payment</h2>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <Field label="Name on Card" name="cardName" placeholder="John Doe" value={pay.cardName} onChange={upd(setPay)} required />
                                <Field label="Card Number">
                                    <input type="text" inputMode="numeric" placeholder="1234 5678 9012 3456" maxLength={19}
                                        value={pay.cardNumber} onChange={e => setPay(p => ({ ...p, cardNumber: fmtCard(e.target.value) }))} required
                                        className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 placeholder:opacity-30"
                                        style={{ fontSize: 15, color: 'var(--text-primary)', boxShadow: 'none' }} />
                                </Field>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <Field label="Expiry">
                                        <input type="text" inputMode="numeric" placeholder="MM/YY" maxLength={5}
                                            value={pay.expiry} onChange={e => setPay(p => ({ ...p, expiry: fmtExpiry(e.target.value) }))} required
                                            className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 placeholder:opacity-30"
                                            style={{ fontSize: 15, color: 'var(--text-primary)', boxShadow: 'none' }} />
                                    </Field>
                                    <Field label="CVV">
                                        <input type="text" inputMode="numeric" placeholder="•••" maxLength={4}
                                            value={pay.cvv} onChange={e => setPay(p => ({ ...p, cvv: e.target.value.replace(/\D/g,'').slice(0,4) }))} required
                                            className="w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 placeholder:opacity-30"
                                            style={{ fontSize: 15, color: 'var(--text-primary)', boxShadow: 'none' }} />
                                    </Field>
                                </div>
                            </div>

                            <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <button type="button" onClick={() => setStep(0)}
                                    className="inline-flex items-center gap-2 transition-opacity hover:opacity-50"
                                    style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                                </button>
                                <button type="submit" className="group inline-flex items-center gap-3 rounded-full font-bold uppercase transition-all duration-300 hover:opacity-80"
                                    style={{ padding: '0.9rem 2.5rem', fontSize: 11, letterSpacing: '0.25em', background: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                                    Review Order <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </motion.form>
                    )}

                    {/* ── STEP 2: Review & Confirm ── */}
                    {step === 2 && (
                        <motion.div key="review" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: '2.5rem', marginTop: '2rem' }}>
                                <span style={{ fontSize: 48, fontWeight: 900, lineHeight: 1, color: 'var(--border-color)' }}>03</span>
                                <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Confirm</h2>
                            </div>

                            <p style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                                Everything looks good? Click <strong style={{ color: 'var(--text-primary)' }}>Place Order</strong> and we'll get it moving.
                            </p>

                            <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <button type="button" onClick={() => setStep(1)}
                                    className="inline-flex items-center gap-2 transition-opacity hover:opacity-50"
                                    style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                                </button>
                                <button onClick={placeOrder} disabled={loading}
                                    className="group inline-flex items-center gap-3 rounded-full font-bold uppercase transition-all duration-300 hover:opacity-80 disabled:opacity-40"
                                    style={{ padding: '0.9rem 2.5rem', fontSize: 11, letterSpacing: '0.25em', background: 'var(--accent)', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
                                    {loading ? 'Placing…' : 'Place Order'}
                                    {!loading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
