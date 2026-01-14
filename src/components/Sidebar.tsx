'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Mic2, Gift, ClipboardList, Share2, Menu, X, CheckSquare, Star, Brain, MessageSquare, BookOpen, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useIdentity } from '@/context/IdentityContext';

const NAV_ITEMS = [
    { label: 'Hello World', icon: Home, path: '/hub/hello-world' },
    { label: 'Companion Checklist', icon: CheckSquare, path: '/hub/checklist' },
    { label: 'Speakers', icon: Mic2, path: '/hub/speakers' },
    { label: 'Startup Spotlight', icon: Star, path: '/hub/spotlight' },
    { label: 'Win $1,500 Audit', icon: Gift, path: '/hub/giveaway' },
    { label: 'Get Free AI Training', icon: Brain, path: '/hub/ai-training' },
    { label: 'Help Us Help You', icon: MessageSquare, path: '/hub/surveys' },
    { label: 'Resources', icon: BookOpen, path: '/hub/resources' },
    { label: 'Connect With Us', icon: Users, path: '/hub/connect' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { leadId, userName } = useIdentity();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [currentTime, setCurrentTime] = useState<string>('');

    useEffect(() => {
        setMounted(true);
        // Initial format
        const formatTime = () => {
            const now = new Date();
            return new Intl.DateTimeFormat('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            }).format(now);
        };

        setCurrentTime(formatTime());

        const timer = setInterval(() => {
            setCurrentTime(formatTime());
        }, 1000 * 60); // Update every minute

        const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => {
            window.removeEventListener('resize', checkDesktop);
            clearInterval(timer);
        };
    }, []);

    const handleNav = (path: string) => {
        // Persist the ID in the URL when navigating
        const url = leadId ? `${path}?id=${leadId}` : path;
        router.push(url);
        setIsOpen(false);
    };

    const sidebarVariants = {
        mobileClosed: { x: "-100%", opacity: 0 },
        mobileOpen: { x: "0%", opacity: 1 },
        desktop: { x: "0%", opacity: 1 }
    };

    return (
        <>
            {/* Mobile Toggle */}
            <div className="md:hidden fixed top-4 right-4 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-3 bg-glass-bg backdrop-blur-xl border border-glass-border rounded-full text-foreground shadow-lg active:scale-95 transition-transform"
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar Container */}
            <motion.aside
                initial={false}
                animate={isDesktop ? "desktop" : (isOpen ? "mobileOpen" : "mobileClosed")}
                variants={sidebarVariants}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={clsx(
                    // Base styles (Mobile Fixed / Desktop Relative Card)
                    "fixed inset-y-0 left-0 z-40 w-72 md:w-full bg-[#0F172A] p-4 flex flex-col shadow-2xl md:shadow-none",
                    // Desktop Specifics: Floating Card
                    "md:!relative md:!translate-x-0 md:!block md:!opacity-100 md:h-full md:rounded-[32px]",
                    !isOpen && !isDesktop && "hidden"
                )}
            >
                {/* Brand Header */}
                <div className="flex flex-col mb-8 pt-4 px-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-purple-900/20">
                            TA
                        </div>
                        <h2 className="text-lg font-bold text-white tracking-tight leading-4">
                            Innovation Henderson<br />
                            <span className="text-primary font-normal text-sm">Alignment Hub</span>
                        </h2>
                    </div>
                    {/* Live Clock Psd */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 w-fit">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                        <span className="text-[10px] font-mono font-medium text-slate-400 tracking-wide">{currentTime}</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;

                        return (
                            <button
                                key={item.path}
                                onClick={() => handleNav(item.path)}
                                className={clsx(
                                    "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
                                    isActive
                                        ? "text-white bg-white/10"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <div className={clsx(
                                    "p-2 rounded-xl transition-colors",
                                    isActive ? "bg-primary text-white" : "bg-white/5 text-slate-400 group-hover:text-white"
                                )}>
                                    <Icon size={18} />
                                </div>
                                <span className="font-medium text-sm">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom Promo Card (Detailed Stats style) */}
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/5 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform">
                    <div className="relative z-10">
                        <h3 className="text-white font-bold text-sm mb-1">Detailed Stats</h3>
                        <p className="text-slate-400 text-xs mb-3">View your engagement analytics</p>
                        <button className="px-3 py-1.5 bg-white text-primary text-xs font-bold rounded-lg shadow-lg">View Reports</button>
                    </div>
                    <div className="absolute -right-2 -bottom-2 w-20 h-20 bg-primary/40 rounded-full blur-2xl group-hover:bg-primary/50 transition-colors" />
                </div>
            </motion.aside>

            {/* Mobile Backdrop */}
            {
                isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )
            }
        </>
    );
}
