import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Users, Award, Home, Sparkles } from 'lucide-react';

function Reveal({ children, delay = 0 }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    return (
        <motion.div 
            ref={ref} 
            initial={{ opacity: 0, y: 30 }} 
            animate={inView ? { opacity: 1, y: 0 } : {}} 
            transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
            {children}
        </motion.div>
    );
}

export default function About() {
    return (
        <div className="w-full">
            {/* Immersive Hero Header */}
            <section className="relative w-full h-[70vh] lg:h-[85vh] flex items-center justify-center overflow-hidden" style={{ marginTop: '-90px', paddingTop: '90px' }}>
                <img 
                    src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop" 
                    alt="Premium Interior Design" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-[1px]" />
                
                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <Reveal delay={0.1}>
                        <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-8 tracking-tight leading-[1.1]" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>
                            Transforming Spaces,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/60">Inspiring Lives</span>
                        </h1>
                    </Reveal>
                </div>
                
                {/* Scroll Indicator */}
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
                >
                    <div className="w-[1px] h-20 bg-gradient-to-b from-white/0 via-white to-white/0 animate-pulse" />
                </motion.div>
            </section>

            {/* Values Section - Ultra-Modern with Background Photo */}
            <section className="relative py-40 lg:py-52 overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
                    alt="Design Philosophy" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[30s] hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" />
                
                <div className="container-centered relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                        {/* Header Column */}
                        <div className="lg:col-span-5">
                            <Reveal>
                                <span className="text-[var(--accent)] text-[10px] font-bold tracking-[0.5em] uppercase mb-6 block">Our philosophy</span>
                                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-10 tracking-tight text-white leading-[1.1]">
                                    What we<br />stand for
                                </h2>
                                <p className="text-xl text-white/80 font-light leading-relaxed max-w-md">
                                    Bridging the gap between imagination and reality to create spaces that inspire.
                                </p>
                            </Reveal>
                        </div>

                        {/* Values List Column */}
                        <div className="lg:col-span-7 lg:pl-12">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-24 lg:gap-y-32 mt-12 lg:mt-0">
                                {[
                                    { icon: Sparkles, title: 'Design Excellence', desc: 'Curated with a keen eye for aesthetics and modern living.' },
                                    { icon: Users, title: 'Customer First', desc: 'Intuitive tools designed with the user at the very center.' },
                                    { icon: Award, title: 'Quality Assured', desc: 'Trusted manufacturers providing furniture that lasts a lifetime.' },
                                    { icon: Home, title: 'Sustainability', desc: 'Prioritizing eco-friendly materials for a responsible future.' }
                                ].map((v, i) => (
                                    <Reveal key={i} delay={i * 0.1}>
                                        <div className={`group flex flex-col ${i % 2 !== 0 ? 'sm:mt-16 lg:mt-24' : ''}`}>
                                            <div className="w-10 h-[1px] bg-[var(--accent)] mb-10 transition-all duration-700 group-hover:w-20"></div>
                                            <div className="mb-8 text-white/40 group-hover:text-white transition-colors duration-500">
                                                <v.icon className="w-7 h-7 stroke-[1px]" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-5 text-white tracking-tight">{v.title}</h3>
                                            <p className="text-[15px] text-white/60 leading-relaxed font-light group-hover:opacity-100 transition-opacity duration-500">{v.desc}</p>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision Quote Section - More immersive with background image */}
            <section className="relative py-28 lg:py-36 overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070&auto=format&fit=crop" 
                    alt="Inspired Living" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                
                <div className="container-centered relative z-10 text-center">
                    <Reveal>
                        <div className="text-[var(--accent)] text-6xl font-serif mb-10 opacity-40">&quot;</div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-light italic text-white max-w-5xl mx-auto leading-[1.3] tracking-tight">
                            At FurniVision, we don't just sell furniture. We provide the canvas and the colors for you to paint the story of your life, one room at a time.
                        </h2>
                        <div className="mt-16 flex items-center justify-center gap-6">
                            <div className="w-16 h-[1px] bg-white/30"></div>
                            <span className="text-sm font-bold tracking-[0.3em] uppercase text-white/60">Our Core Vision</span>
                            <div className="w-16 h-[1px] bg-white/30"></div>
                        </div>
                    </Reveal>
                </div>
            </section>

            <div className="h-14 lg:h-20" />
        </div>
    );
}
