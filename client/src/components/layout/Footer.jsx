import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const footerLinks = {
    'Company': [
        { label: 'About Us', to: '/about' },
        { label: 'Blog', to: '/blog' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
    ],
    'Customer': [
        { label: 'Support', to: '/contact' },
        { label: 'Shipping Info', href: '#' },
        { label: 'Returns', href: '#' },
        { label: 'FAQ', href: '#' },
    ],
    'Resources': [
        { label: 'Room Designer', to: '/designer' },
        { label: 'Design Guide', href: '#' },
        { label: 'Room Ideas', to: '/blog' },
        { label: 'Gift Cards', href: '#' },
    ],
    'Legal': [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Settings', href: '#' },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-[var(--bg-primary)] pt-32 pb-12 transition-colors duration-500 mt-40">
            <div className="container-centered max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex flex-col lg:flex-row justify-between w-full gap-16 lg:gap-12 mb-20">
                    
                    {/* Brand Column (Left) */}
                    <div className="lg:w-1/3 flex flex-col hidden lg:flex">
                        <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
                            <img src="/logo.png" alt="FurniVision" style={{ height: '2.25rem', width: 'auto', objectFit: 'contain' }} onError={e => e.currentTarget.style.display = 'none'} />
                            <span className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">FurniVision</span>
                        </Link>
                        <p className="text-[15px] leading-[1.8] text-[var(--text-secondary)] mb-10 max-w-sm">
                            Design your dream space with our interactive 3D room designer. Browse premium furniture and bring your vision to life.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-4 mt-auto">
                            {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-11 h-11 rounded-full flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white transition-all duration-300 group shadow-sm" aria-label="Social">
                                    <Icon className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-white transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns (Right - Justified) */}
                    <div className="lg:w-3/4 grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-8">
                        {Object.entries(footerLinks).map(([title, links]) => (
                            <div key={title} className="flex-1 min-w-[140px]">
                                <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--text-primary)] mb-8">{title}</h4>
                                <ul className="space-y-5">
                                    {links.map(link => (
                                        <li key={link.label}>
                                            <Link 
                                                to={link.to || link.href} 
                                                className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors duration-300 flex items-center gap-3 group"
                                            >
                                                <span className="w-0 h-px bg-[var(--accent)] transition-all duration-300 group-hover:w-4 opacity-0 group-hover:opacity-100"></span>
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom bar no border */}
                <div className="pt-8 flex flex-col items-center justify-center gap-6">
                    <p className="text-[13px] text-[var(--text-muted)] tracking-wide text-center">
                        © {new Date().getFullYear()} FurniVision. All rights reserved.
                    </p>
                    {/* Brand in bottom menu on mobile */}
                    <div className="lg:hidden flex flex-col items-center text-center mt-6 w-full">
                         <Link to="/" className="flex flex-col items-center gap-2 mb-4">
                             <img src="/logo.png" alt="FurniVision" style={{ height: '2rem', width: 'auto', objectFit: 'contain' }} onError={e => e.currentTarget.style.display = 'none'} />
                             <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">FurniVision</span>
                         </Link>
                         {/* Social Links mobile */}
                        <div className="flex items-center justify-center gap-4 mb-8">
                            {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-11 h-11 rounded-full flex items-center justify-center bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white transition-all duration-300 group shadow-sm" aria-label="Social">
                                    <Icon className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-white transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
