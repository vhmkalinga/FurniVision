import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import {
    Package, Settings, PenTool, LayoutDashboard, Search, Sun, Moon, Bell, LogOut, Trash2, Edit, Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api';

export default function CustomerDashboard() {
    const { user, logout, updateProfile, uploadAvatar } = useAuth();
    const { dark, toggle } = useTheme();
    const navigate = useNavigate();
    const [tab, setTab] = useState('overview');
    const [designs, setDesigns] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        loadData();
    }, [user]);

    const loadData = async () => {
        try {
            const [dRes, oRes] = await Promise.all([api.get('/designs'), api.get('/orders')]);
            setDesigns(dRes.data.designs);
            setOrders(oRes.data.orders);
        } catch (err) { } finally { setLoading(false); }
    };

    const deleteDesign = async (id) => {
        try {
            await api.delete(`/designs/${id}`);
            setDesigns(designs.filter(d => d._id !== id));
            toast.success('Design deleted');
        } catch (err) { toast.error('Failed to delete'); }
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
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Customer Area</p>
                </div>

                <nav style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                        { id: 'designs', label: 'My Designs', icon: PenTool },
                        { id: 'orders', label: 'Orders', icon: Package },
                        { id: 'profile', label: 'Profile', icon: Settings },
                    ].map(n => {
                        const active = tab === n.id;
                        return (
                            <button
                                key={n.id}
                                onClick={() => setTab(n.id)}
                                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', borderRadius: '1rem', fontWeight: 'bold', fontSize: '0.875rem', cursor: 'pointer', border: 'none', width: '100%', textAlign: 'left', backgroundColor: active ? '#D4F670' : 'transparent', color: active ? 'var(--text-primary)' : 'var(--text-secondary)', transition: 'all 0.2s' }}
                            >
                                <n.icon style={{ width: '1.25rem', height: '1.25rem', color: active ? '#111827' : 'var(--text-muted)' }} />
                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.label}</span>
                                {n.id === 'orders' && <span style={{ width: '1.5rem', height: '1.5rem', borderRadius: '9999px', backgroundColor: '#FFF7ED', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem' }}>{orders.length}</span>}
                            </button>
                        );
                    })}
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: '100%', backgroundColor: 'var(--accent)', borderRadius: '1.5rem', padding: '1.5rem', textAlign: 'center', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <h4 style={{ fontSize: '1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Help Center</h4>
                   <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>Have a problem? Reach out to support.</p>
                   <button onClick={logout} style={{ width: '100%', fontSize: '0.875rem', backgroundColor: '#fff', color: '#000', padding: '0.875rem', borderRadius: '0.75rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
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
                            <span style={{ width: '0.625rem', height: '0.625rem', borderRadius: '9999px', backgroundColor: '#3B82F6' }}></span> Connected
                        </span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'var(--bg-secondary)', padding: '0.375rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                            <button onClick={!dark ? undefined : toggle} style={{ backgroundColor: !dark ? 'var(--bg-card)' : 'transparent', color: !dark ? '#000' : 'var(--text-muted)', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: !dark ? '0 1px 2px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}><Sun style={{ width: '1rem', height: '1rem' }}/> Light</button>
                            <button onClick={dark ? undefined : toggle} style={{ backgroundColor: dark ? 'var(--bg-card)' : 'transparent', color: dark ? 'var(--text-primary)' : 'var(--text-muted)', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 'bold', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: dark ? '0 1px 2px rgba(0,0,0,0.05)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}><Moon style={{ width: '1rem', height: '1rem' }}/> Dark</button>
                        </div>
                        <button style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <Bell style={{ width: '1.25rem', height: '1.25rem' }} />
                        </button>
                        <Link to="/designer" style={{ backgroundColor: 'var(--accent)', color: '#000', padding: '0.875rem 1.5rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none', display: 'inline-block' }}>
                            New Design
                        </Link>
                    </div>
                </header>

                <div style={{ flex: 1, overflowY: 'auto', padding: '0 3rem 3rem 3rem' }}>
                    
                    {/* OVERVIEW TAB */}
                    {tab === 'overview' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                            
                            {/* Hero Section */}
                            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-end', width: '100%' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1.15, letterSpacing: '-0.025em', margin: '0 0 1.5rem 0' }}>
                                        Welcome, {user?.name?.split(' ')[0]} <span>👋</span><br/>
                                        Manage your <span style={{ color: '#E8943B' }}>designs</span> and orders.
                                    </h1>
                                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '28rem', lineHeight: 1.6 }}>
                                        Track your orders, re-visit your saved interior designs, and update your personal settings.
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '1.25rem' }}>
                                    {[
                                        { label: 'Designs', value: designs.length, icon: PenTool, bg: '#F2FCE4', border: '#E2F5CA', iconColor: '#4D7C0F', id: 'designs' },
                                        { label: 'Orders', value: orders.length, icon: Package, bg: '#FFF7E3', border: '#FFECC0', iconColor: '#EA580C', id: 'orders' },
                                        { label: 'Profile', value: 'Ready', icon: Settings, bg: '#F3E8FF', border: '#E9D5FF', iconColor: '#7E22CE', id: 'profile' },
                                    ].map((s, i) => (
                                        <div key={i} onClick={() => setTab(s.id)} style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '1.5rem', border: '1px solid var(--border-color)', padding: '1.5rem', width: '10rem', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'rgba(0,0,0,0.05) 0px 4px 12px' }} onMouseEnter={e => e.currentTarget.style.backgroundColor='var(--bg-card)'} onMouseLeave={e => e.currentTarget.style.backgroundColor='var(--bg-secondary)'}>
                                            <div style={{ height: '6rem', width: '100%', backgroundColor: s.bg, border: `2px solid ${s.border}`, borderRadius: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <s.icon style={{ width: '2.5rem', height: '2.5rem', color: s.iconColor }} />
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <p style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-primary)', margin: '0 0 0.25rem 0', lineHeight: 1 }}>{s.value}</p>
                                                <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{s.label}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* DESIGNS TAB */}
                    {tab === 'designs' && (
                        <div style={{ padding: '2rem 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', flex: 1, margin: 0 }}>My Designs</h2>
                                <Link to="/designer" style={{ backgroundColor: 'var(--accent)', color: '#000', padding: '0.75rem 1.5rem', borderRadius: '1rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                                    <Plus style={{ width: '1rem', height: '1rem' }} /> New Design
                                </Link>
                            </div>

                            {designs.length === 0 ? (
                                <div style={{ padding: '4rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', backgroundColor: 'var(--bg-secondary)', borderRadius: '2rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                                    <PenTool style={{ width: '4rem', height: '4rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }} />
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No designs yet</h3>
                                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '24rem', marginBottom: '2rem' }}>Create your first interior design project today!</p>
                                    <Link to="/designer" style={{ backgroundColor: 'var(--accent)', color: '#000', padding: '0.75rem 1.5rem', borderRadius: '1rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                                        Start Designing
                                    </Link>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                    {designs.map(d => (
                                        <div key={d._id} style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '2rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ height: '160px', backgroundColor: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                                <PenTool style={{ width: '3rem', height: '3rem', color: 'var(--text-muted)', opacity: 0.5 }} />
                                                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                                                    <Link to={`/designer?load=${d._id}`} style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', backgroundColor: 'var(--bg-card)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#3B82F6' }}><Edit style={{ width: '1rem', height: '1rem' }}/></Link>
                                                    <button onClick={() => deleteDesign(d._id)} style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', backgroundColor: 'var(--bg-card)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#EF4444' }}><Trash2 style={{ width: '1rem', height: '1rem' }}/></button>
                                                </div>
                                            </div>
                                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0, flex: 1, paddingRight: '1rem' }}>{d.name || 'Untitled Room'}</h3>
                                                </div>
                                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>Room: {d.roomWidth}m × {d.roomLength}m</p>
                                                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                    <span style={{ backgroundColor: 'var(--border-color)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{d.furniture?.length || 0} items</span>
                                                    <span style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold' }}>Last updated: {new Date(d.updatedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ORDERS TAB */}
                    {tab === 'orders' && (
                        <div style={{ padding: '2rem 0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', flex: 1, margin: 0 }}>My Orders</h2>
                            </div>

                            {orders.length === 0 ? (
                                <div style={{ padding: '4rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', backgroundColor: 'var(--bg-secondary)', borderRadius: '2rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                                    <Package style={{ width: '4rem', height: '4rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }} />
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No orders yet</h3>
                                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '24rem', marginBottom: '2rem' }}>You haven't placed any orders yet. Visit the catalog to find your next favorite piece.</p>
                                    <Link to="/shop" style={{ backgroundColor: 'var(--accent)', color: '#000', padding: '0.75rem 1.5rem', borderRadius: '1rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                                        Shop Now
                                    </Link>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {orders.map(o => (
                                        <div key={o._id} style={{ padding: '1.5rem 2rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '1.5rem', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.backgroundColor='var(--bg-card)'} onMouseLeave={e => e.currentTarget.style.backgroundColor='var(--bg-secondary)'}>
                                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                                <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Package style={{ width: '1.5rem', height: '1.5rem', color: 'var(--text-muted)' }} />
                                                </div>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                                        <h4 style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '1.125rem', margin: 0 }}>Order #{o._id.slice(-6).toUpperCase()}</h4>
                                                        <span style={{ backgroundColor: o.status === 'confirmed' ? '#D4F670' : 'var(--border-color)', color: o.status === 'confirmed' ? '#4D7C0F' : 'var(--text-primary)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{o.status}</span>
                                                    </div>
                                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>{o.items?.length} items · Placed on {new Date(o.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 0.25rem 0', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Total</p>
                                                    <p style={{ fontWeight: '900', color: 'var(--text-primary)', fontSize: '1.25rem', margin: 0 }}>$${o.total?.toFixed(2)}</p>
                                                </div>
                                                <button style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', backgroundColor: 'var(--bg-primary)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                                    <Search style={{ width: '1.25rem', height: '1.25rem' }} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
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
