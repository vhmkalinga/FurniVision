import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

// Defined OUTSIDE the component so React never sees it as a new type on re-render
function InputField({ label, showToggle, onToggleShow, showPass, ...props }) {
    return (
        <div style={{ marginBottom: '1.75rem' }}>
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

export default function Login() {
    const { login } = useAuth();
    const { dark, toggle } = useTheme();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const data = await login(form.email, form.password);
            toast.success(`Welcome back, ${data.user.name}!`);
            if (data.user.role === 'admin') navigate('/dashboard/admin');
            else if (data.user.role === 'staff') navigate('/dashboard/staff');
            else navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally { setLoading(false); }
    };

    const handleDemoLogin = async (email, password) => {
        setForm({ email, password });
        setLoading(true);
        try {
            const data = await login(email, password);
            toast.success(`Demo Access: Using ${data.user.role} account`);
            if (data.user.role === 'admin') navigate('/dashboard/admin');
            else navigate('/dashboard');
        } catch (err) {
            toast.error('Demo login failed. Server might be down.');
        } finally { setLoading(false); }
    };


    return (
        <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-primary)', fontFamily: 'system-ui, sans-serif' }}>
            {/* Left Panel — Hero Image */}
            <div style={{ display: 'none', width: '50%', position: 'relative', overflow: 'hidden' }} className="lg:flex!">
                <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
                    alt="Luxury Interior"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3))' }} />
                <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem', width: '100%', height: '100%', textAlign: 'center' }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1 }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', lineHeight: 1.15, letterSpacing: '-0.03em', margin: '0 0 1.5rem 0' }}>
                            Design the space<br/>you've always imagined.
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
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', textDecoration: 'none' }}>
                            <img
                                src="/logo.png"
                                alt="FurniVision"
                                style={{ height: '4.5rem', width: 'auto', objectFit: 'contain' }}
                                onError={e => e.currentTarget.style.display = 'none'}
                            />
                        </Link>

                        <div style={{ marginBottom: '3rem' }}>
                            <h1 style={{ fontSize: '2.75rem', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 0.75rem 0' }}>Welcome back</h1>
                            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: 0, fontWeight: '400' }}>Sign in to your creative workspace</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <InputField label="Email Address" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="design@furnivision.com" />
                            <InputField label="Password" type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" showToggle showPass={showPass} onToggleShow={() => setShowPass(!showPass)} />

                            <div style={{ marginTop: '0.5rem' }}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    onClick={(e) => { e.preventDefault(); handleSubmit(); }}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', backgroundColor: '#1A1A1A', color: '#fff', padding: '1.125rem 2rem', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: '700', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s', opacity: loading ? 0.6 : 1, letterSpacing: '0.02em' }}
                                    onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = 'var(--accent)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#1A1A1A'; }}
                                >
                                    {loading ? 'Authenticating...' : 'Sign In'}
                                    {!loading && <ArrowRight style={{ width: '1rem', height: '1rem' }} />}
                                </button>
                            </div>
                        </form>

                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2.5rem 0' }}>
                            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
                            <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Quick Access</span>
                            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
                        </div>

                        {/* Demo Login Buttons */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <button onClick={() => handleDemoLogin('admin@furnivision.com', 'admin123')} style={{ padding: '1rem', borderRadius: '1rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                                <p style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>Administrator</p>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>admin@furnivision.com</p>
                            </button>
                            <button onClick={() => handleDemoLogin('customer@furnivision.com', 'customer123')} style={{ padding: '1rem', borderRadius: '1rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                                <p style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>Customer</p>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>customer@furnivision.com</p>
                            </button>
                        </div>

                        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                                Don't have an account?{' '}
                                <Link to="/register" style={{ color: 'var(--accent)', fontWeight: '700', textDecoration: 'none' }}>Register now</Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
