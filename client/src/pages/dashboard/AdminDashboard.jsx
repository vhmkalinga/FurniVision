import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import {
    Users, Package, FileText, Trash2, Edit, Plus, Save, X, PenTool,
    LogOut, ChevronRight, LayoutDashboard, Sun, Moon, Search, Bell, Monitor, CheckCircle2, Calendar, Clock, TrendingUp,
    Settings, ShoppingBag, ChevronDown, Ruler
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api';

export default function AdminDashboard() {
    const { user, logout, updateProfile, uploadAvatar } = useAuth();
    const { dark, toggle } = useTheme();
    const navigate = useNavigate();
    const [tab, setTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [designs, setDesigns] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({ name: '', description: '', price: '', category: '', modelType: 'box', featured: false });
    const [showBlogForm, setShowBlogForm] = useState(false);
    const [blogForm, setBlogForm] = useState({ title: '', content: '', tags: '', published: true });
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);
    const [pendingRoles, setPendingRoles] = useState({});

    useEffect(() => {
        if (!user || user.role !== 'admin') { navigate('/login'); return; }
        loadAll();
    }, [user]);

    const loadAll = async () => {
        try {
            const [aRes, uRes, pRes, dRes, bRes, cRes, oRes] = await Promise.all([
                api.get('/analytics'), api.get('/users'), api.get('/products?limit=100'),
                api.get('/designs'), api.get('/blogs/all'), api.get('/categories'), api.get('/orders')
            ]);
            setStats(aRes.data.stats); setUsers(uRes.data.users); setProducts(pRes.data.products);
            setDesigns(dRes.data.designs); setBlogs(bRes.data.blogs); setCategories(cRes.data.categories);
            setOrders(oRes.data.orders || []);
        } catch (err) { } finally { setLoading(false); }
    };

    const deleteDesign = async (id) => {
        try { await api.delete(`/designs/${id}`); setDesigns(designs.filter(d => d._id !== id)); toast.success('Deleted'); }
        catch (err) { toast.error('Failed'); }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}`, { status });
            setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
            toast.success('Order status updated');
        } catch (err) { toast.error('Failed'); }
    };

    const updateUserRole = async (id, role) => {
        try { await api.put(`/users/${id}`, { role }); setUsers(users.map(u => u._id === id ? { ...u, role } : u)); setPendingRoles(p => { const n = { ...p }; delete n[id]; return n; }); toast.success('Role updated'); }
        catch (err) { toast.error('Failed'); }
    };
    const deleteUser = async (id) => {
        try { await api.delete(`/users/${id}`); setUsers(users.filter(u => u._id !== id)); toast.success('Deleted'); }
        catch (err) { toast.error('Failed'); }
    };
    const deleteOrder = async (id) => {
        if (!window.confirm('Delete this order permanently?')) return;
        try { await api.delete(`/orders/${id}`); setOrders(orders.filter(o => o._id !== id)); toast.success('Order deleted'); }
        catch (err) { toast.error('Failed to delete order'); }
    };
    const saveProduct = async () => {
        try {
            const data = { ...productForm, price: parseFloat(productForm.price) };
            if (editingProduct) {
                const res = await api.put(`/products/${editingProduct._id}`, data);
                setProducts(products.map(p => p._id === editingProduct._id ? res.data.product : p));
            } else {
                const res = await api.post('/products', data);
                setProducts([res.data.product, ...products]);
            }
            toast.success('Saved'); setShowProductForm(false); setEditingProduct(null);
        } catch (err) { toast.error('Failed'); }
    };
    const deleteProduct = async (id) => {
        try { await api.delete(`/products/${id}`); setProducts(products.filter(p => p._id !== id)); toast.success('Deleted'); }
        catch (err) { toast.error('Failed'); }
    };
    const saveBlog = async () => {
        try {
            const data = { ...blogForm, tags: blogForm.tags.split(',').map(t => t.trim()).filter(Boolean) };
            const res = await api.post('/blogs', data);
            setBlogs([res.data.blog, ...blogs]); toast.success('Published');
            setShowBlogForm(false); setBlogForm({ title: '', content: '', tags: '', published: true });
        } catch (err) { toast.error('Failed'); }
    };
    const deleteBlog = async (id) => {
        try { await api.delete(`/blogs/${id}`); setBlogs(blogs.filter(b => b._id !== id)); toast.success('Deleted'); }
        catch (err) { toast.error('Failed'); }
    };

    const saveProfile = async () => {
        try {
            await updateProfile(profile);
            toast.success('Profile updated');
        } catch (err) { toast.error('Update failed'); }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
            <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const roleBadge = (role) => {
        const styles = {
            admin: { bg: '#D4F670', color: '#000' },
            staff: { bg: '#DBEAFE', color: '#1E40AF' },
            customer: { bg: '#F3F4F6', color: '#374151' },
        };
        const s = styles[role] || styles.customer;
        return <span style={{ backgroundColor: s.bg, color: s.color, padding: '0.375rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{role}</span>;
    };

    const InputField = ({ label, ...props }) => (
        <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{label}</label>
            <input {...props} style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: '1rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontSize: '0.875rem', color: 'var(--text-primary)', outline: 'none' }} />
        </div>
    );

    return (
        <div style={{ height: '100vh', backgroundColor: 'var(--bg-primary)', padding: '2rem', display: 'flex', gap: '2rem', fontFamily: 'system-ui, sans-serif', color: 'var(--text-primary)', boxSizing: 'border-box', overflow: 'hidden' }}>
            
            {/* LEFT SIDEBAR */}
            <aside style={{ width: '320px', backgroundColor: 'var(--bg-card)', borderRadius: '2rem', padding: '2rem', display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem', textDecoration: 'none' }}>
                    <img src="/logo.png" alt="FurniVision" style={{ height: '4.5rem', width: 'auto', objectFit: 'contain', maxWidth: '100%' }} onError={e => e.currentTarget.style.display = 'none'} />
                </Link>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ width: '6rem', height: '6rem', borderRadius: '2rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                        {user?.name?.[0]}
                    </div>
                    <h3 style={{ fontWeight: 'bold', fontSize: '1.25rem', margin: 0 }}>{user?.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Administrator</p>
                </div>

                <nav style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                        { id: 'users', label: 'Users', icon: Users },
                        { id: 'products', label: 'Products', icon: Package },
                        { id: 'designs', label: 'Designs', icon: PenTool },
                        { id: 'orders', label: 'Orders', icon: ShoppingBag },
                        { id: 'blogs', label: 'Blog', icon: FileText },
                        { id: 'profile', label: 'Profile', icon: Settings },
                    ].map(n => {
                        const active = tab === n.id;
                        return (
                            <button
                                key={n.id}
                                onClick={() => setTab(n.id)}
                                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', borderRadius: '1rem', fontWeight: 'bold', fontSize: '0.875rem', cursor: 'pointer', border: 'none', width: '100%', textAlign: 'left', backgroundColor: active ? '#D4F670' : 'transparent', color: active ? '#111827' : '#6B7280', transition: 'all 0.2s' }}
                            >
                                <n.icon style={{ width: '1.25rem', height: '1.25rem', color: active ? '#111827' : '#9CA3AF' }} />
                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.label}</span>
                                {n.id === 'users' && <span style={{ width: '1.5rem', height: '1.5rem', borderRadius: '9999px', backgroundColor: '#FFF7ED', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem' }}>{users.length}</span>}
                                {n.id === 'orders' && <span style={{ width: '1.5rem', height: '1.5rem', borderRadius: '9999px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem' }}>{orders.length}</span>}
                            </button>
                        );
                    })}
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: '100%', backgroundColor: '#1A1A1A', borderRadius: '1.5rem', padding: '1.5rem', textAlign: 'center', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <h4 style={{ fontSize: '1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Help Center</h4>
                   <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>Have a problem? Reach out to our support team.</p>
                   <button onClick={logout} style={{ width: '100%', fontSize: '0.875rem', backgroundColor: 'var(--bg-card)', color: '#000', padding: '0.875rem', borderRadius: '0.75rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                       <LogOut style={{ width: '1rem', height: '1rem' }}/> Logout
                   </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main style={{ flex: 1, minWidth: 0, backgroundColor: 'var(--bg-card)', borderRadius: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                
                <header style={{ padding: '2.5rem 3rem 1.5rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-card)', zIndex: 20, gap: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: 'var(--bg-secondary)', padding: '0.625rem 1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>
                            <span style={{ width: '0.625rem', height: '0.625rem', borderRadius: '9999px', backgroundColor: '#22C55E' }}></span> Live System
                        </span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', minWidth: '240px' }}>
                            <Search style={{ width: '1rem', height: '1rem', color: 'var(--text-muted)' }}/>
                            <input type="text" placeholder="Search entries..." style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '0.875rem' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'var(--bg-secondary)', padding: '0.375rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                            <button onClick={!dark ? undefined : toggle} style={{ backgroundColor: !dark ? 'var(--bg-card)' : 'transparent', color: !dark ? '#000' : 'var(--text-muted)', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: !dark ? '0 1px 2px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}><Sun style={{ width: '1rem', height: '1rem' }}/> Light</button>
                            <button onClick={dark ? undefined : toggle} style={{ backgroundColor: dark ? 'var(--bg-card)' : 'transparent', color: dark ? 'var(--text-primary)' : 'var(--text-muted)', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: dark ? '0 1px 2px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}><Moon style={{ width: '1rem', height: '1rem' }}/> Dark</button>
                        </div>
                        <button style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <Bell style={{ width: '1.25rem', height: '1.25rem' }} />
                        </button>
                        <Link
                            to="/designer"
                            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', padding: '0.875rem 1.5rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 'bold', border: '1px solid var(--border-color)', cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Ruler style={{ width: '1rem', height: '1rem' }} /> Room Designer
                        </Link>
                        <button style={{ backgroundColor: '#1A1A1A', color: '#fff', padding: '0.875rem 1.5rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                            Add record
                        </button>
                    </div>
                </header>

                <div style={{ flex: 1, overflowY: 'auto', padding: '0 3rem 3rem 3rem' }}>
                    
                    {/* OVERVIEW TAB */}
                    {tab === 'overview' && stats && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            
                            {/* Hero Section */}
                            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-end', width: '100%' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1.15, letterSpacing: '-0.025em', margin: '0 0 1.5rem 0' }}>
                                        Hi, Admin! <span>👋</span><br/>
                                        What do you want to <span style={{ color: '#E8943B' }}>manage</span> today?
                                    </h1>
                                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '28rem', lineHeight: 1.6 }}>
                                        Monitor your platform's health, user activity, and latest content across the board.
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '1.25rem' }}>
                                    {[
                                        { label: 'Products', value: stats.products, icon: Package, bg: '#F2FCE4', border: '#E2F5CA', iconColor: '#4D7C0F' },
                                        { label: 'Designs', value: stats.designs, icon: PenTool, bg: '#FFF7E3', border: '#FFECC0', iconColor: '#EA580C' },
                                        { label: 'Blog', value: stats.blogs, icon: FileText, bg: '#F3E8FF', border: '#E9D5FF', iconColor: '#7E22CE', id: 'blogs' },
                                    ].map((s, i) => (
                                        <div key={i} onClick={() => setTab(s.id || s.label.toLowerCase())} style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '1.5rem', border: '1px solid var(--border-color)', padding: '1.5rem', width: '10rem', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'rgba(0,0,0,0.05) 0px 4px 12px' }} onMouseEnter={e => e.currentTarget.style.backgroundColor='#fff'} onMouseLeave={e => e.currentTarget.style.backgroundColor='#F9FAFB'}>
                                            <div style={{ height: '6rem', width: '100%', backgroundColor: s.bg, border: `2px solid ${s.border}`, borderRadius: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <s.icon style={{ width: '2.5rem', height: '2.5rem', color: s.iconColor }} />
                                            </div>
                                            <p style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1rem', margin: '0 0 0.25rem 0' }}>{s.label}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>{s.value} active rows</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* KPI Section */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.5rem' }}>
                                {[
                                    { label: 'Total Revenue', value: `$${stats.revenue?.toFixed(0) || 0}`, sub1: 'Growth +12.5%', sub2: 'All targets met!', progress: 90, color: '#D4F670' },
                                    { label: 'Total Orders', value: stats.orders, sub1: 'Growth +8.2%', sub2: '2 missing orders', progress: 60, color: '#FCD34D' },
                                    { label: 'Active Users', value: stats.users, sub1: 'Growth +24.1%', sub2: '4 users onboarding', progress: 30, color: '#C084FC' },
                                ].map((s, i) => (
                                    <div key={i} style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '2rem', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                            <div style={{ position: 'relative', width: '5rem', height: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-card)', borderRadius: '9999px', flexShrink: 0 }}>
                                                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                                    <circle cx="40" cy="40" r="34" stroke="#f3f4f6" strokeWidth="6" fill="none" />
                                                    <circle cx="40" cy="40" r="34" stroke={s.color} strokeWidth="6" fill="none" strokeDasharray="213" strokeDashoffset={213 - (213 * s.progress / 100)} strokeLinecap="round" />
                                                </svg>
                                                <span style={{ fontSize: '0.875rem', fontWeight: '900', color: 'var(--text-primary)', position: 'absolute' }}>{s.progress}%</span>
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <span style={{ fontSize: '0.625rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>{s.label}</span>
                                                <h3 style={{ color: 'var(--text-primary)', fontWeight: '900', fontSize: '2.25rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.value}</h3>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto', gap: '1rem' }}>
                                            <div style={{ minWidth: 0 }}>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 'bold', margin: '0 0 0.25rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.sub1}</p>
                                                <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>· {s.sub2}</p>
                                            </div>
                                            <button style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '0.75rem', padding: '0.625rem 1.25rem', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', flexShrink: 0 }}>Details</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tables Section */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', minWidth: 0 }}>
                                    {/* Recent Users */}
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                                                Recent Users <span style={{ width: '0.625rem', height: '0.625rem', borderRadius: '9999px', backgroundColor: '#D4F670' }}></span>
                                            </h3>
                                            <button onClick={() => setTab('users')} style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Edit style={{ width: '1rem', height: '1rem' }} /> Go to directory
                                            </button>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1.5rem', minWidth: 0 }}>
                                            {users.slice(0, 2).map((u, i) => (
                                                <div key={u._id} style={{ borderRadius: '2rem', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px', backgroundColor: i === 0 ? '#1A1A1A' : '#F8FAFC', color: i === 0 ? '#fff' : '#111827', border: i === 0 ? 'none' : '1px solid #F3F4F6' }}>
                                                    <div style={{ minWidth: 0, marginBottom: '1.5rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', minWidth: 0, gap: '1rem' }}>
                                                            <p style={{ fontSize: '0.625rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: i === 0 ? '#9CA3AF' : '#6B7280', margin: 0, flexShrink: 0 }}>New Customer</p>
                                                            {roleBadge(u.role)}
                                                        </div>
                                                        <h4 style={{ fontWeight: '900', fontSize: '1.875rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '1rem' }}>{u.name}</h4>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', gap: '1rem', minWidth: 0 }}>
                                                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '0.625rem 1rem', borderRadius: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', backgroundColor: i === 0 ? '#fff' : '#fff', color: i === 0 ? '#000' : '#1F2937', border: i === 0 ? 'none' : '1px solid #E5E7EB' }}>
                                                            {u.email}
                                                        </span>
                                                        <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.125rem', flexShrink: 0, backgroundColor: i === 0 ? '#2A2A2A' : '#F3F4F6', color: i === 0 ? '#fff' : '#9CA3AF', border: i === 0 ? '1px solid #374151' : '1px solid #E5E7EB' }}>
                                                            {u.name[0]}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* System Logs */}
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>System Events</h3>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {[1, 2].map(n => (
                                                <div key={n} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '1.5rem', border: '1px solid var(--border-color)', gap: '1.5rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', minWidth: 0 }}>
                                                        <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0 }}>
                                                            <CheckCircle2 style={{ width: '1.25rem', height: '1.25rem' }}/>
                                                        </div>
                                                        <div style={{ minWidth: 0 }}>
                                                            <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '0 0 0.375rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Database automated backup completed</p>
                                                            <p style={{ fontSize: '0.6875rem', fontWeight: '500', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                Time elapsed <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>02h 45m</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0, backgroundColor: 'var(--bg-card)', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                                                        <div style={{ width: '6rem', height: '0.375rem', backgroundColor: 'var(--bg-primary)', borderRadius: '9999px', overflow: 'hidden' }}>
                                                            <div style={{ width: '100%', height: '100%', backgroundColor: '#10B981' }}></div>
                                                        </div>
                                                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>SUCCESS</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right sidebar items */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', minWidth: 0 }}>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>Recent Posts</h3>
                                            <button onClick={() => setTab('blogs')} style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                All Posts
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {blogs.slice(0, 2).map(b => (
                                                <div key={b._id} style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '1.5rem', padding: '1.5rem', position: 'relative' }}>
                                                    <h4 style={{ fontWeight: 'bold', fontSize: '0.875rem', color: 'var(--text-primary)', margin: '0 0 0.5rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '2.5rem' }}>{b.title}</h4>
                                                    <p style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-secondary)', margin: '0 0 1.5rem 0' }}>{b.published ? 'Published' : 'Draft'} • {b.views || 0} views</p>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.6875rem', fontWeight: 'bold', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-card)', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                                                            <Calendar style={{ width: '0.875rem', height: '0.875rem' }}/>
                                                            {new Date(b.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>Today / March 24</h3>
                                        </div>
                                        <div style={{ backgroundColor: '#1A1A1A', color: '#fff', borderRadius: '2rem', padding: '2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                                <div style={{ width: '0.625rem', height: '0.625rem', borderRadius: '9999px', backgroundColor: '#D4F670', boxShadow: '0 0 10px #D4F670' }}></div>
                                                <p style={{ fontSize: '0.625rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>4:00 PM - 5:00 PM</p>
                                            </div>
                                            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#fff', margin: '0 0 2rem 0', lineHeight: 1.6 }}>
                                                Meeting with the executive board to discuss the new platform redesign and deployment operations.
                                            </p>
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <button style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #374151', fontSize: '0.75rem', fontWeight: 'bold', color: '#D1D5DB', backgroundColor: 'transparent', cursor: 'pointer' }}>Reschedule</button>
                                                <button style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', backgroundColor: '#D4F670', fontSize: '0.75rem', fontWeight: 'bold', color: '#000', border: 'none', cursor: 'pointer' }}>Accept</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* USERS TAB */}
                    {tab === 'users' && (
                        <div style={{ padding: '2rem 0' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '2rem' }}>User Management</h2>
                            <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '2rem', overflow: 'hidden' }}>
                                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>User</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>Role</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>Joined</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold', textAlign: 'right' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ divideY: '1px solid #F3F4F6' }}>
                                        {users.map(u => (
                                            <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', backgroundColor: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                                                        {u.name[0]}
                                                    </div>
                                                    <div>
                                                        <p style={{ fontWeight: 'bold', color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>{u.name}</p>
                                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>{u.email}</p>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.5rem' }}>
                                                    <select
                                                        value={pendingRoles[u._id] ?? u.role}
                                                        onChange={(e) => setPendingRoles(p => ({ ...p, [u._id]: e.target.value }))}
                                                        style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', fontSize: '0.875rem', outline: 'none', cursor: 'pointer' }}
                                                    >
                                                        <option value="customer">Customer</option>
                                                        <option value="staff">Staff</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td style={{ padding: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </td>
                                                <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                                                    {user._id !== u._id && (
                                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                            {pendingRoles[u._id] && pendingRoles[u._id] !== u.role && (
                                                                <button onClick={() => updateUserRole(u._id, pendingRoles[u._id])} style={{ padding: '0.5rem 1rem', color: '#16A34A', backgroundColor: '#DCFCE7', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                                    <CheckCircle2 style={{ width: '0.875rem', height: '0.875rem' }} /> Update
                                                                </button>
                                                            )}
                                                            <button onClick={() => deleteUser(u._id)} style={{ padding: '0.5rem', color: '#EF4444', backgroundColor: '#FEF2F2', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
                                                                <Trash2 style={{ width: '1rem', height: '1rem' }} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* PRODUCTS TAB */}
                    {tab === 'products' && (
                        <div style={{ padding: '2rem 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', flex: 1, margin: 0 }}>Products</h2>
                                <button onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: '', category: '', modelType: 'box', featured: false }); setShowProductForm(true); }} style={{ backgroundColor: '#111827', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '1rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Plus style={{ width: '1rem', height: '1rem' }} /> Add Product
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                {products.map(p => (
                                    <div key={p._id} style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '2rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ height: '160px', backgroundColor: 'var(--border-color)', backgroundImage: `url(${p.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                                            <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => { setEditingProduct(p); setProductForm(p); setShowProductForm(true); }} style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', backgroundColor: 'var(--bg-card)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#3B82F6' }}><Edit style={{ width: '1rem', height: '1rem' }}/></button>
                                                <button onClick={() => deleteProduct(p._id)} style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', backgroundColor: 'var(--bg-card)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#EF4444' }}><Trash2 style={{ width: '1rem', height: '1rem' }}/></button>
                                            </div>
                                        </div>
                                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0, flex: 1, paddingRight: '1rem' }}>{p.name}</h3>
                                                <span style={{ fontSize: '1rem', fontWeight: '900', color: '#16A34A', flexShrink: 0 }}>${p.price?.toFixed(2)}</span>
                                            </div>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
                                            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                <span style={{ backgroundColor: 'var(--border-color)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', color: '#374151' }}>{p.category?.name || p.category || 'Uncategorized'}</span>
                                                <span style={{ backgroundColor: p.featured ? '#FEF3C7' : '#F3F4F6', color: p.featured ? '#D97706' : '#9CA3AF', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold' }}>{p.featured ? 'Featured' : 'Standard'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* DESIGNS TAB */}
                    {tab === 'designs' && (
                        <div style={{ padding: '2rem 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', flex: 1, margin: 0 }}>Community Designs</h2>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{designs.length} total</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                {designs.map(d => (
                                    <div key={d._id} style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '2rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ height: '160px', backgroundColor: 'var(--border-color)', backgroundImage: `url(${d.thumbnail || 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a'})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                                            <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                                                <Link to={`/designer?load=${d._id}`} style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', backgroundColor: 'var(--bg-card)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#3B82F6', textDecoration: 'none' }}><Edit style={{ width: '1rem', height: '1rem' }}/></Link>
                                                <button onClick={() => deleteDesign(d._id)} style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', backgroundColor: 'var(--bg-card)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#EF4444' }}><Trash2 style={{ width: '1rem', height: '1rem' }}/></button>
                                            </div>
                                        </div>
                                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>{d.name}</h3>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>By: {d.userId?.name || 'Unknown'} · <span style={{ color: d.userId?.role === 'customer' ? '#7C3AED' : d.userId?.role === 'staff' ? '#2563EB' : '#D97706' }}>{d.userId?.role || '—'}</span></p>
                                            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                <span style={{ backgroundColor: d.isTemplate ? '#FEF3C7' : '#E5E7EB', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', color: d.isTemplate ? '#D97706' : '#374151' }}>{d.isTemplate ? 'Template' : 'User Design'}</span>
                                                <span style={{ backgroundColor: '#F0F9FF', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', color: '#0369A1' }}>{d.furniture?.length || 0} items</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ORDERS TAB */}
                    {tab === 'orders' && (
                        <div style={{ padding: '2rem 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', flex: 1, margin: 0 }}>Orders</h2>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{orders.length} total orders</span>
                            </div>
                            <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '2rem', overflow: 'hidden' }}>
                                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>Order</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>Customer</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>Items</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>Total</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>Date</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.length === 0 && (
                                            <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No orders yet.</td></tr>
                                        )}
                                        {orders.map(o => {
                                            const statusColors = {
                                                confirmed: { bg: '#DCFCE7', color: '#16A34A' },
                                                pending:   { bg: '#FEF9C3', color: '#CA8A04' },
                                                shipped:   { bg: '#DBEAFE', color: '#2563EB' },
                                                delivered: { bg: '#F3E8FF', color: '#7E22CE' },
                                                cancelled: { bg: '#FEE2E2', color: '#DC2626' },
                                            };
                                            const sc = statusColors[o.status] || { bg: '#F3F4F6', color: '#6B7280' };
                                            return (
                                                <tr key={o._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                                        <p style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--text-primary)', margin: '0 0 0.25rem 0', fontFamily: 'monospace' }}>#{o._id.slice(-8).toUpperCase()}</p>
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                                        <p style={{ fontWeight: 'bold', color: 'var(--text-primary)', margin: '0 0 0.2rem 0', fontSize: '0.875rem' }}>{o.userId?.name || 'Unknown'}</p>
                                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>{o.userId?.email || ''}</p>
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                        {o.items?.length} item{o.items?.length !== 1 ? 's' : ''}
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                                        <span style={{ fontWeight: '900', color: '#16A34A', fontSize: '0.9rem' }}>${o.total?.toFixed(2)}</span>
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                        {new Date(o.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                                        <select
                                                            value={o.status}
                                                            onChange={e => updateOrderStatus(o._id, e.target.value)}
                                                            style={{ padding: '0.5rem 0.75rem', borderRadius: '0.75rem', border: `1.5px solid ${sc.bg}`, backgroundColor: sc.bg, color: sc.color, fontSize: '0.75rem', fontWeight: 'bold', outline: 'none', cursor: 'pointer' }}
                                                        >
                                                            {['confirmed','pending','shipped','delivered','cancelled'].map(s => (
                                                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                                        <button onClick={() => deleteOrder(o._id)} style={{ padding: '0.5rem', color: '#EF4444', backgroundColor: '#FEF2F2', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
                                                            <Trash2 style={{ width: '1rem', height: '1rem' }} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* BLOGS TAB */}
                    {tab === 'blogs' && (
                        <div style={{ padding: '2rem 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', flex: 1, margin: 0 }}>Blog Posts</h2>
                                <button onClick={() => setShowBlogForm(true)} style={{ backgroundColor: '#111827', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '1rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Plus style={{ width: '1rem', height: '1rem' }} /> Create Post
                                </button>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {blogs.map(b => (
                                    <div key={b._id} style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '1.5rem', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ flex: 1, minWidth: 0, paddingRight: '2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.title}</h3>
                                                <span style={{ backgroundColor: b.published ? '#D4F670' : '#E5E7EB', color: b.published ? '#4D7C0F' : '#6B7280', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold' }}>{b.published ? 'Published' : 'Draft'}</span>
                                            </div>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.content.replace(/<[^>]*>?/gm, '').substring(0, 100)}...</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                                            <button onClick={() => deleteBlog(b._id)} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', backgroundColor: '#FEF2F2', border: 'none', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                                <Trash2 style={{ width: '1.25rem', height: '1.25rem' }} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* MODALS */}
                    {showProductForm && (
                        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '2rem', padding: '3rem', width: '100%', maxWidth: '32rem', maxHeight: '90vh', overflowY: 'auto' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                                    <button onClick={() => setShowProductForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                                </div>
                                <InputField label="Product Name" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} placeholder="E.g., Nordic Relax Chair" />
                                <InputField label="Price ($)" type="number" step="0.01" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} placeholder="199.99" />
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Description</label>
                                    <textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} rows="4" style={{ width: '100%', padding: '1rem', borderRadius: '1rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontSize: '0.875rem', color: 'var(--text-primary)', outline: 'none' }} />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Category</label>
                                    <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} style={{ width: '100%', padding: '1rem', borderRadius: '1rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontSize: '0.875rem', outline: 'none' }}>
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                                <button onClick={saveProduct} style={{ width: '100%', padding: '1rem', backgroundColor: '#D4F670', color: '#000', borderRadius: '1rem', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                    <Save style={{ width: '1.25rem', height: '1.25rem' }}/> Save Product
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {showBlogForm && (
                        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '2rem', padding: '3rem', width: '100%', maxWidth: '32rem', maxHeight: '90vh', overflowY: 'auto' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Create Blog Post</h2>
                                    <button onClick={() => setShowBlogForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                                </div>
                                <InputField label="Title" value={blogForm.title} onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} />
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Content</label>
                                    <textarea value={blogForm.content} onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} rows="6" style={{ width: '100%', padding: '1rem', borderRadius: '1rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontSize: '0.875rem', color: 'var(--text-primary)', outline: 'none' }} />
                                </div>
                                <InputField label="Tags (comma separated)" value={blogForm.tags} onChange={e => setBlogForm({ ...blogForm, tags: e.target.value })} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                                    <input type="checkbox" id="published" checked={blogForm.published} onChange={e => setBlogForm({ ...blogForm, published: e.target.checked })} />
                                    <label htmlFor="published" style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Publish immediately</label>
                                </div>
                                <button onClick={saveBlog} style={{ width: '100%', padding: '1rem', backgroundColor: '#111827', color: '#fff', borderRadius: '1rem', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                    <FileText style={{ width: '1.25rem', height: '1.25rem' }}/> Publish Blog
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PROFILE TAB */}
                    {tab === 'profile' && (
                        <div style={{ padding: '2rem 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', flex: 1, margin: 0 }}>Profile Settings</h2>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem' }}>
                                {/* Avatar Column */}
                                <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '2rem', padding: '2.5rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                                        <div style={{ width: '8rem', height: '8rem', borderRadius: '2rem', overflow: 'hidden', border: '3px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {user?.avatar ? (
                                                <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <span style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-muted)' }}>{user?.name?.[0]}</span>
                                            )}
                                        </div>
                                        <label htmlFor="avatar-upload" style={{ position: 'absolute', bottom: '-0.5rem', right: '-0.5rem', width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', backgroundColor: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                        </label>
                                        <input id="avatar-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            try {
                                                await uploadAvatar(file);
                                                toast.success('Profile picture updated!');
                                            } catch (err) { toast.error('Upload failed'); }
                                        }} />
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>{user?.name}</h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>{user?.email}</p>
                                    <span style={{ display: 'inline-block', padding: '0.375rem 1rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', backgroundColor: 'var(--accent)', color: '#000' }}>{user?.role}</span>
                                </div>

                                {/* Info Column */}
                                <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '2rem', padding: '2.5rem', border: '1px solid var(--border-color)' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '2rem' }}>Personal Information</h3>
                                    
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Full Name</label>
                                        <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: '1rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }} />
                                    </div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Email Address</label>
                                        <input value={user?.email} disabled style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: '1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--text-muted)', outline: 'none', opacity: 0.7, boxSizing: 'border-box' }} />
                                    </div>
                                    <div style={{ marginBottom: '2rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Phone Number</label>
                                        <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="Your phone number" style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: '1rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }} />
                                    </div>
                                    
                                    <button onClick={saveProfile} style={{ width: '100%', backgroundColor: '#D4F670', color: '#000', padding: '1rem 1.5rem', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
