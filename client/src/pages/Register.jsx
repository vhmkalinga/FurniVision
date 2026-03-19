import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, Sun, Moon, Check } from 'lucide-react';
import toast from 'react-hot-toast';

// Defined OUTSIDE the component so React never sees it as a new type on re-render
function InputField({ label, showToggle, onToggleShow, showPass, ...props }) {
    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-secondary)' }}>{label}</label>
                {showToggle && (
                    <button type="button" onClick={onToggleShow} style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        {showPass ? 'Hide' : 'Show'}
                    </button>
                )}
            </div>
            <input {...props} style={{ width: '100%', padding: '1.125rem 1.5rem', borderRadius: '1rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontSize: '0.95rem', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.3s', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = 'var(--accent)'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
        </div>
    );
}

export default function Register() {
    const { register } = useAuth();
    const { dark, toggle } = useTheme();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
        if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally { setLoading(false); }
    };


    const passwordStrength = form.password.length >= 6;
    const passwordsMatch = form.password && form.confirmPassword && form.password === form.confirmPassword;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-primary)', fontFamily: 'system-ui, sans-serif' }}>
            {/* Left Panel — Hero Image */}
            <div style={{ display: 'none', width: '50%', position: 'relative', overflow: 'hidden' }} className="lg:!flex">
                <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000&auto=format&fit=crop"
                    alt="Artistic Living Space"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3))' }} />
                <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem', width: '100%', height: '100%', textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', lineHeight: 1.15, letterSpacing: '-0.03em', margin: '0 0 1.5rem 0' }}>
                            Join the community<br/>of elite designers.
                        </h2>
                        <div style={{ width: '4rem', height: '4px', backgroundColor: '#FB923C', borderRadius: '9999px' }}></div>
                    </motion.div>
                </div>
            </div>

            {/* Right Panel — Form */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', position: 'relative' }}>
                {/* Theme Toggle */}
                <button onClick={toggle} style={{ position: 'absolute', top: '2rem', right: '2rem', width: '3rem', height: '3rem', borderRadius: '1rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s' }}>
                    {dark ? <Sun style={{ width: '1.25rem', height: '1.25rem' }} /> : <Moon style={{ width: '1.25rem', height: '1.25rem' }} />}
                </button>

                <div style={{ width: '100%', maxWidth: '440px' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        {/* Brand Logo — shown on all screen sizes */}
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', textDecoration: 'none' }}>
                            <img
                                src="/logo.png"
                                alt="FurniVision"
                                style={{ height: '4.5rem', width: 'auto', objectFit: 'contain' }}
                                onError={e => e.currentTarget.style.display = 'none'}
                            />
                        </Link>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <h1 style={{ fontSize: '2.75rem', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 0.75rem 0' }}>Create Account</h1>
                            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: 0, fontWeight: '400' }}>Start your interior design journey today</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <InputField label="Full Name" type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
                            <InputField label="Email Address" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="hello@example.com" />
                            <InputField label="Password" type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min. 6 characters" showToggle showPass={showPass} onToggleShow={() => setShowPass(!showPass)} />
                            <InputField label="Confirm Password" type="password" required value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Re-enter your password" />

                            {/* Password checks */}
                            {form.password && (
                                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '1.25rem', height: '1.25rem', borderRadius: '9999px', backgroundColor: passwordStrength ? '#D4F670' : 'var(--bg-secondary)', border: passwordStrength ? 'none' : '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                                            {passwordStrength && <Check style={{ width: '0.75rem', height: '0.75rem', color: '#000' }} />}
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: passwordStrength ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: '600' }}>6+ characters</span>
                                    </div>
                                    {form.confirmPassword && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '1.25rem', height: '1.25rem', borderRadius: '9999px', backgroundColor: passwordsMatch ? '#D4F670' : '#FEF2F2', border: passwordsMatch ? 'none' : '1px solid #FECACA', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                                                {passwordsMatch && <Check style={{ width: '0.75rem', height: '0.75rem', color: '#000' }} />}
                                            </div>
                                            <span style={{ fontSize: '0.75rem', color: passwordsMatch ? 'var(--text-primary)' : '#EF4444', fontWeight: '600' }}>{passwordsMatch ? 'Passwords match' : 'Not matching'}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div style={{ marginTop: '0.5rem' }}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', backgroundColor: '#1A1A1A', color: '#fff', padding: '1.125rem 2rem', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: '700', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s', opacity: loading ? 0.6 : 1, letterSpacing: '0.02em' }}
                                    onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = 'var(--accent)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#1A1A1A'; }}
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                    {!loading && <ArrowRight style={{ width: '1rem', height: '1rem' }} />}
                                </button>
                            </div>
                        </form>

                        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                                Already have an account?{' '}
                                <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '700', textDecoration: 'none' }}>Sign in</Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
