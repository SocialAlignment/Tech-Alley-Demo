'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Mic2, Gift, ClipboardList, Share2, Menu, X, CheckSquare, Star, Brain, MessageSquare, BookOpen, Users, Zap, Megaphone, Calendar, Rocket, ChevronDown, Camera, Heart, MessageCircleQuestion } from 'lucide-react';
import { FlipText } from '@/components/ui/flip-link';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useIdentity } from '@/context/IdentityContext';
import UserProfileDemo from '@/components/UserProfileDemo';

// Moved NAV_SECTIONS inside component to access context

// Helper Component for Countdown
const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                // Format with leading zeros
                const pad = (n: number) => n < 10 ? `0${n}` : n;
                return `${pad(days)}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;
            }
            return 'EVENT STARTED';
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Initial call
        setTimeLeft(calculateTimeLeft());

        return () => clearInterval(timer);
    }, [targetDate]);

    return <>{timeLeft}</>;
};

// Helper for Nav Item
const NavItem = ({ item, pathname, handleNav }: { item: any, pathname: string, handleNav: (path: string) => void }) => {
    const Icon = item.icon;
    const isActive = pathname === item.path;

    return (
        <button
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
            <FlipText className="font-medium text-sm">
                {item.label}
            </FlipText>
        </button>
    );
};

const CollapsibleSection = ({ title, items, pathname, handleNav, defaultOpen = false }: { title: string, items: any[], pathname: string, handleNav: (path: string) => void, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="space-y-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 hover:text-white transition-colors"
            >
                {title}
                <ChevronDown
                    size={14}
                    className={clsx("transition-transform duration-200", isOpen ? "rotate-180" : "")}
                />
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden space-y-1"
                    >
                        {items.map((item) => (
                            <NavItem key={item.path} item={item} pathname={pathname} handleNav={handleNav} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { leadId, userName, isProfileComplete } = useIdentity();

    const NAV_SECTIONS = [
        {
            title: "", // Main Section (No Header)
            items: [
                { label: 'Start Here', icon: Zap, path: '/hub/start' },
                { label: 'Home', icon: Home, path: '/hub' },
            ]
        },
        {
            title: "Tonight's Event",
            items: [
                { label: 'Agenda', icon: Calendar, path: '/hub/agenda' },
                { label: 'Announcements', icon: Megaphone, path: '/hub/announcements' },
                { label: 'Startup Spotlight', icon: Star, path: '/hub/spotlight' },
                { label: 'Guest Speakers', icon: Mic2, path: '/hub/speakers' },
                { label: 'Sponsors', icon: Heart, path: '/hub/sponsors' },
            ]
        },
        {
            title: "Connect with Others",
            items: [
                { label: 'Your Interactive Hub', icon: CheckSquare, path: '/hub/checklist' },
                { label: 'Photo Booth', icon: Camera, path: '/hub/photo-booth' },
                { label: 'IRL Rolodex', icon: Users, path: '/hub/networking' },
                { label: 'Upcoming Events', icon: Calendar, path: '/hub/upcoming' },
            ]
        },
        {
            title: "Free Resources",
            items: [
                { label: 'Speaker Resources', icon: Mic2, path: '/hub/speaker-resources' },
                { label: 'Enter Raffle', icon: Gift, path: '/hub/raffle' },
                { label: 'Free AI Readiness Audit', icon: Brain, path: '/hub/mri' },
                { label: 'Get AI Training', icon: Rocket, path: '/hub/grant' },
            ]
        },
        {
            title: "Connect With Us",
            items: [
                { label: 'Speaker Qualifier', icon: Mic2, path: '/hub/apply-to-speak' },
                { label: 'Feedback', icon: MessageSquare, path: '/hub/feedback' },
                { label: 'Ask Lorraine', icon: MessageCircleQuestion, path: '/hub/ask-lorraine' },
            ]
        }
    ];
    const [isOpen, setIsOpen] = useState(false);
    // Removed individual state variables in favor of internal state in CollapsibleSection if desired, 
    // OR we can lift state up. For simplicity in this refactor, I'll let CollapsibleSection handle its own open state 
    // or pass it in. To match the requested "toggles", independent state is best.
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
                    <div className="flex items-start gap-3 mb-2">
                        <div className="w-12 h-12 flex items-center justify-center shrink-0 mt-0.5">
                            <img src="/hub-icon.png?v=2" alt="Innovation Henderson Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-base font-bold text-white leading-tight">
                                Innovation Henderson
                            </h2>
                            <span className="text-white font-medium text-xs opacity-90">Alignment Hub</span>
                        </div>
                    </div>
                    {/* Date/Time & Countdown */}
                    <div className="flex flex-col gap-3 w-full">
                        {/* Current Time */}
                        <div className="flex flex-col gap-1 px-4 py-3 rounded-xl bg-white/5 border border-white/5 w-full">
                            <span className="text-[10px] uppercase tracking-wider text-white/60 font-bold">Current Time</span>
                            <span className="text-sm font-mono font-semibold text-white tracking-wide">{currentTime}</span>
                        </div>

                        {/* Countdown to Jan 21, 2026 5PM PST */}
                        <div className="flex flex-col gap-1 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 w-full">
                            <span className="text-[10px] uppercase tracking-wider text-blue-200 font-bold">Event Starts In</span>
                            <span className="text-sm font-mono font-semibold text-white tracking-wide">
                                <CountdownTimer targetDate="2026-01-21T17:00:00-08:00" />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
                    {/* Main Section - Always Visible */}
                    <div className="space-y-2">
                        <div className="space-y-1">
                            {NAV_SECTIONS[0].items.map((item) => (
                                <NavItem key={item.path} item={item} pathname={pathname} handleNav={handleNav} />
                            ))}
                        </div>
                    </div>

                    <div id="tour-tonights-event">
                        <CollapsibleSection
                            title="Tonight's Event"
                            items={NAV_SECTIONS[1].items}
                            pathname={pathname}
                            handleNav={handleNav}
                            defaultOpen={true}
                        />
                    </div>

                    <div id="tour-connect-with-others">
                        <CollapsibleSection
                            title={NAV_SECTIONS[2].title}
                            items={NAV_SECTIONS[2].items}
                            pathname={pathname}
                            handleNav={handleNav}
                            defaultOpen={false}
                        />
                    </div>

                    <div id="tour-free-resources">
                        <CollapsibleSection
                            title={NAV_SECTIONS[3].title}
                            items={NAV_SECTIONS[3].items}
                            pathname={pathname}
                            handleNav={handleNav}
                            defaultOpen={false}
                        />
                    </div>

                    <div id="tour-connect-with-us">
                        <CollapsibleSection
                            title={NAV_SECTIONS[4].title}
                            items={NAV_SECTIONS[4].items}
                            pathname={pathname}
                            handleNav={handleNav}
                            defaultOpen={false}
                        />
                    </div>
                </nav>

                <div className="mt-4">
                    <UserProfileDemo />
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
