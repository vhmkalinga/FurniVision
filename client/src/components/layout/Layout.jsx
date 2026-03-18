import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
    const location = useLocation();
    const hideFooterPaths = ['/designer'];
    const showFooter = !hideFooterPaths.includes(location.pathname);

    return (
        <div className="page-container flex flex-col min-h-screen w-full">
            <Navbar />
            <main className="flex-1 w-full" style={{ paddingTop: '90px' }}>
                <Outlet />
            </main>
            {showFooter && <Footer />}
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        color: 'var(--text-primary)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        borderRadius: '1rem',
                        padding: '1rem 1.25rem',
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </div>
    );
}
