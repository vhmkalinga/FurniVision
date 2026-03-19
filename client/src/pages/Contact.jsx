import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

function Reveal({ children, delay = 0 }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    return (
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay }}>
            {children}
        </motion.div>
    );
}

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Message sent! We\'ll get back to you within 24 hours.');
        setForm({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="w-full">
            {/* Immersive Contact Hero */}
            <section className="relative w-full h-[60vh] lg:h-[75vh] flex items-center justify-center overflow-hidden" style={{ marginTop: '-90px', paddingTop: '90px' }}>
                <img 
                    src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop" 
                    alt="Get In Touch" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[30s] hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/70 dark:bg-black/90 backdrop-blur-[2px]" />
                
                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <Reveal delay={0.1}>
                        <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
                            Let's Talk<br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-white to-white/40">Design</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/70 font-light tracking-[0.2em] uppercase">Connect with our team of experts</p>
                    </Reveal>
                </div>
            </section>

            {/* Static spacer — not affected by framer-motion y offset */}
            <div className="h-12 lg:h-16" />

            {/* Contact Content Section */}
            <section className="py-20 lg:py-28 bg-(--bg-primary)">
                <div className="container-centered">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 lg:gap-32">
                        
                        {/* Column 1: Contact Details */}
                        <div className="lg:col-span-5">
                            <Reveal>
                                <span className="text-(--accent) text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block">Stay connected</span>
                                <h2 className="text-5xl md:text-6xl font-bold mb-12 tracking-tight text-(--text-primary)">Reach Out</h2>
                                
                                <div className="space-y-16">
                                    {[
                                        { icon: Mail, title: 'Email Us', info: 'hello@furnivision.com', sub: 'We respond within 24 hours' },
                                        { icon: Phone, title: 'Call Us', info: '+1 (555) 123-4567', sub: 'Mon-Fri, 9am - 6pm EST' },
                                        { icon: MapPin, title: 'Visit Us', info: '123 Design Avenue', sub: 'Creative District, NY 10001' },
                                        { icon: Clock, title: 'Studio Hours', info: 'Mon — Fri, 9am - 6pm', sub: 'Closed on Sundays' }
                                    ].map((c, i) => (
                                        <div key={i} className="group flex flex-col items-start max-w-xs">
                                            <div className="w-10 h-px bg-(--accent) mb-8 transition-all duration-700 group-hover:w-20"></div>
                                            <div className="flex items-center gap-6">
                                                <div className="p-3 rounded-full border border-(--border-color) group-hover:border-(--accent) group-hover:bg-(--accent)/5 transition-all duration-500">
                                                    <c.icon className="w-4 h-4 text-(--text-muted) group-hover:text-(--accent)" />
                                                </div>
                                                <div>
                                                    <p className="text-[15px] font-bold text-(--text-primary) mb-1">{c.info}</p>
                                                    <p className="text-[12px] text-(--text-muted) font-medium uppercase tracking-wider">{c.sub}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Reveal>
                        </div>

                        {/* Column 2: Minimalist Form */}
                        <div className="lg:col-span-7">
                            <Reveal delay={0.2}>
                                <div className="relative">
                                    {/* Large Background Blur Accent */}
                                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-(--accent)/5 rounded-full blur-[100px] -z-10"></div>
                                    
                                    <form onSubmit={handleSubmit} className="space-y-12">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                                            <div className="border-b border-(--border-color) pb-4 focus-within:border-(--accent) transition-colors duration-500">
                                                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-(--text-secondary) mb-3 block">Your Name</label>
                                                <input 
                                                    type="text" 
                                                    required 
                                                    value={form.name} 
                                                    onChange={e => setForm({ ...form, name: e.target.value })} 
                                                    className="w-full bg-transparent border-none p-0 text-(--text-primary) text-lg font-light focus:outline-none focus:ring-0 placeholder:text-(--text-muted)/40" 
                                                    placeholder="John Doe" 
                                                />
                                            </div>
                                            <div className="border-b border-(--border-color) pb-4 focus-within:border-(--accent) transition-colors duration-500">
                                                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-(--text-secondary) mb-3 block">Email Address</label>
                                                <input 
                                                    type="email" 
                                                    required 
                                                    value={form.email} 
                                                    onChange={e => setForm({ ...form, email: e.target.value })} 
                                                    className="w-full bg-transparent border-none p-0 text-(--text-primary) text-lg font-light focus:outline-none focus:ring-0 placeholder:text-(--text-muted)/40" 
                                                    placeholder="john@example.com" 
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="border-b border-(--border-color) pb-4 focus-within:border-(--accent) transition-colors duration-500">
                                            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-(--text-secondary) mb-3 block">Subject</label>
                                            <input 
                                                type="text" 
                                                required 
                                                value={form.subject} 
                                                onChange={e => setForm({ ...form, subject: e.target.value })} 
                                                className="w-full bg-transparent border-none p-0 text-(--text-primary) text-lg font-light focus:outline-none focus:ring-0 placeholder:text-(--text-muted)/40" 
                                                placeholder="Inquiry about custom furniture" 
                                            />
                                        </div>

                                        <div className="border-b border-(--border-color) pb-4 focus-within:border-(--accent) transition-colors duration-500">
                                            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-(--text-secondary) mb-3 block">Message</label>
                                            <textarea 
                                                required 
                                                value={form.message} 
                                                onChange={e => setForm({ ...form, message: e.target.value })} 
                                                rows={5} 
                                                className="w-full bg-transparent border-none p-0 text-(--text-primary) text-lg font-light focus:outline-none focus:ring-0 placeholder:text-(--text-muted)/40 resize-none" 
                                                placeholder="Tell us about your project..." 
                                            />
                                        </div>

                                        <button 
                                            type="submit" 
                                            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-6 border border-(--text-primary) px-16 py-6 rounded-full font-bold text-[10px] tracking-[0.5em] uppercase overflow-hidden transition-all duration-700 hover:border-(--accent)"
                                        >
                                            <span className="relative z-10 text-(--text-primary) group-hover:text-white transition-colors duration-500">Send Message</span>
                                            <ArrowRight className="w-4 h-4 relative z-10 text-(--accent) group-hover:text-white transition-all duration-500 group-hover:translate-x-3" />
                                            
                                            {/* Fill Background Animation */}
                                            <div className="absolute inset-0 bg-(--accent) -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-700 ease-out"></div>
                                        </button>
                                    </form>
                                </div>
                            </Reveal>
                        </div>

                    </div>
                </div>
            </section>

            {/* Indestructible Bottom Space */}
            <div className="w-full h-20 lg:h-32 shrink-0 block" aria-hidden="true"></div>
        </div>
    );
}
