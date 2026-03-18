import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Sun, Moon, User, Search, ChevronDown, ChevronRight, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { dark, toggle } = useTheme();
    const { count } = useCart();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [userMenu, setUserMenu] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const onScroll = () => {
            const currentScrollY = window.scrollY;
            setScrolled(currentScrollY > 20);

            // Hide on scroll down, show on scroll up
            if (currentScrollY > lastScrollY.current && currentScrollY > 72) {
                setHidden(true); // Scrolling down
            } else {
                setHidden(false); // Scrolling up
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { setOpen(false); setUserMenu(false); setSearchOpen(false); }, [location]);

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/shop', label: 'Shop' },
        { to: '/designer', label: 'Room Designer' },
        { to: '/blog', label: 'Blog' },
        { to: '/about', label: 'About' },
        { to: '/contact', label: 'Contact' },
    ];

    const getDashboardPath = () => {
        if (!user) return '/login';
        if (user.role === 'admin') return '/dashboard/admin';
        if (user.role === 'staff') return '/dashboard/staff';
        return '/dashboard';
    };

    const isActive = (path) => location.pathname === path;
    const isTransparent = location.pathname === '/' || location.pathname === '/shop' || location.pathname === '/blog' || location.pathname === '/about' || location.pathname === '/contact';
    const navTextColor = (!scrolled && isTransparent) ? '#fff' : 'var(--text-primary)';
    const navMutedColor = (!scrolled && isTransparent) ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)';

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass shadow-sm' : ''}`}
            style={{
                background: scrolled ? undefined : 'transparent',
                borderBottom: `1px solid ${scrolled ? 'var(--border-color)' : 'transparent'}`,
                transform: hidden ? 'translateY(-100%)' : 'translateY(0)'
            }}
        >
            <div className="container-centered">
                <div className="flex items-center justify-between h-[72px]">
                    {/* Logo (Left) */}
                    <Link to="/" className="flex items-center flex-shrink-0 group">
                        <img
                            src="/logo.png"
                            alt="FurniVision"
                            style={{ height: '4.5rem', width: 'auto', objectFit: 'contain', transition: 'transform 0.2s' }}
                            onError={e => e.currentTarget.style.display = 'none'}
                            className="group-hover:scale-105"
                        />
                    </Link>

                    {/* Desktop Nav (Center) */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="relative text-[14px] font-medium transition-colors duration-300 group py-2"
                                style={{ color: isActive(link.to) ? 'var(--accent)' : navTextColor }}
                            >
                                {link.label}
                                {/* Hover Underline Animation */}
                                <span className="absolute left-0 right-0 bottom-0 h-[2px] rounded-full origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100" style={{ background: 'var(--accent)' }} />
                            </Link>
                        ))}
                    </div>

                    {/* Icons (Right) */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* Search */}
                        <button onClick={() => setSearchOpen(!searchOpen)} className="p-2.5 rounded-xl transition-colors hover:bg-surface-100 dark:hover:bg-surface-800" aria-label="Search">
                            <Search className="w-5 h-5" style={{ color: navTextColor }} />
                        </button>

                        {/* User Account */}
                        {user ? (
                            <div className="relative">
                                <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 p-2 rounded-xl transition-colors hover:bg-surface-100 dark:hover:bg-surface-800" aria-label="User menu">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-sm" style={{ background: 'var(--accent)' }}>
                                        {user.name[0]}
                                    </div>
                                    <ChevronDown className="w-4 h-4 hidden sm:block" style={{ color: navMutedColor }} />
                                </button>

                                <AnimatePresence>
                                    {userMenu && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                                style={{ position: 'absolute', right: 0, marginTop: '1rem', width: '320px', borderRadius: '1.5rem', zIndex: 50, overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                                            >
                                                {/* User Info Header */}
                                                <div style={{ padding: '1.75rem', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: '900', color: '#000', flexShrink: 0 }}>
                                                        {user.name[0]}
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p style={{ fontWeight: '800', fontSize: '1.125rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>{user.name}</p>
                                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                                                    </div>
                                                </div>

                                                {/* Role Badge */}
                                                <div style={{ padding: '0.75rem 1.75rem' }}>
                                                    <span style={{ display: 'inline-block', padding: '0.375rem 1rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', backgroundColor: 'var(--accent)', color: '#000' }}>{user.role}</span>
                                                </div>

                                                {/* Menu Items */}
                                                <div style={{ padding: '0.5rem 0.75rem 1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                    <Link to={getDashboardPath()} onClick={() => setUserMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', borderRadius: '1rem', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.9rem', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                                        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                            <LayoutDashboard style={{ width: '1.125rem', height: '1.125rem', color: 'var(--text-muted)' }} />
                                                        </div>
                                                        <span>Dashboard</span>
                                                    </Link>
                                                    <button onClick={() => { setUserMenu(false); logout(); }} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem', borderRadius: '1rem', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', backgroundColor: 'transparent', color: '#EF4444', fontWeight: '700', fontSize: '0.9rem', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEF2F2'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                                        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                            <LogOut style={{ width: '1.125rem', height: '1.125rem' }} />
                                                        </div>
                                                        <span>Sign Out</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/login" className="p-2.5 rounded-xl transition-colors hover:bg-surface-100 dark:hover:bg-surface-800" aria-label="Sign in">
                                <User className="w-5 h-5" style={{ color: navTextColor }} />
                            </Link>
                        )}

                        {/* Cart */}
                        <Link to="/cart" className="p-2.5 rounded-xl transition-colors hover:bg-surface-100 dark:hover:bg-surface-800 relative" aria-label="Cart">
                            <ShoppingBag className="w-5 h-5" style={{ color: navTextColor }} />
                            {count > 0 && (
                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 text-[11px] rounded-full flex items-center justify-center font-bold text-white shadow-sm" style={{ background: 'var(--accent)' }}>
                                    {count}
                                </motion.span>
                            )}
                        </Link>

                        {/* Theme Toggle */}
                        <button onClick={toggle} className="p-2.5 rounded-xl transition-colors hover:bg-surface-100 dark:hover:bg-surface-800" aria-label="Toggle theme">
                            <motion.div key={dark ? 'dark' : 'light'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
                                {dark ? <Sun className="w-5 h-5" style={{ color: navTextColor }} /> : <Moon className="w-5 h-5" style={{ color: navTextColor }} />}
                            </motion.div>
                        </button>

                        {/* Mobile toggle */}
                        <button onClick={() => setOpen(!open)} className="lg:hidden p-2.5 rounded-xl transition-colors hover:bg-surface-100 dark:hover:bg-surface-800" aria-label="Menu">
                            {open ? <X className="w-6 h-6" style={{ color: navTextColor }} /> : <Menu className="w-6 h-6" style={{ color: navTextColor }} />}
                        </button>
                    </div>
                </div>

                {/* Search bar drop-down */}
                <AnimatePresence>
                    {searchOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="pb-4 pt-2">
                                <input type="text" placeholder="Search products, blog posts, categories..." className="input-field shadow-sm" autoFocus onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile menu drop-down */}
                <AnimatePresence>
                    {open && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden">
                            <div className="pb-6 pt-2 space-y-1">
                                {navLinks.map(link => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className="block px-4 py-3.5 rounded-xl text-sm font-medium transition-all"
                                        style={{
                                            color: isActive(link.to) ? 'var(--accent)' : 'var(--text-primary)',
                                            background: isActive(link.to) ? 'var(--accent-soft)' : 'transparent'
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                {!user && (
                                    <Link to="/login" className="block px-4 py-3.5 mt-2 rounded-xl text-sm font-semibold text-center text-white" style={{ background: 'var(--accent)' }}>
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
