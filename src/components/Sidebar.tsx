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
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
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
            <AnimatePresence>
                <motion.aside
                    initial={false}
                    animate={isDesktop ? "desktop" : (isOpen ? "mobileOpen" : "mobileClosed")}
                    variants={sidebarVariants}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={clsx(
                        "fixed inset-y-0 left-0 z-40 w-72 bg-[#0F172A] border-r border-[#1E293B] p-6 flex flex-col shadow-2xl",
                        // Force desktop visibility with !important to override any Framer Motion inline styles
                        "md:!translate-x-0 md:!relative md:!block md:!opacity-100",
                        !isOpen && !isDesktop && "hidden" // Only hide via CSS if mobile and closed
                    )}
                >
                    {/* Brand */}
                    <div className="mb-10 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20 ring-1 ring-white/10">
                            TA
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight tracking-tight text-white">Tech Alley</h1>
                            <p className="text-xs text-primary font-medium tracking-wide uppercase">Henderson Hub</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.path;

                            return (
                                <button
                                    key={item.path}
                                    onClick={() => handleNav(item.path)}
                                    className={clsx(
                                        "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative",
                                        isActive
                                            ? "text-white"
                                            : "text-slate-400 hover:text-white"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-white/5 border border-white/5 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <Icon size={20} className={clsx("relative z-10 transition-colors", isActive ? "text-secondary" : "group-hover:text-primary")} />
                                    <span className="font-medium relative z-10">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* User Profile */}
                    <div className="pt-6 border-t border-white/5">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Identified As</p>
                            <p className="text-sm font-bold text-white truncate">
                                {userName || 'Guest User'}
                            </p>
                            {leadId && <p className="text-[10px] font-mono text-primary/70 truncate mt-1">ID: {leadId.slice(0, 8)}...</p>}
                        </div>
                    </div>
                </motion.aside>
            </AnimatePresence>

            {/* Mobile Backdrop */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
