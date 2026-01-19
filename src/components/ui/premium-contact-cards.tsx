"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Quote, Star, ArrowLeft, ArrowRight, Sparkles, Linkedin, Instagram, Twitter, Globe, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Contact {
    id: string;
    name: string;
    role: string;
    company: string;
    avatar: string | null;
    is_first_time: boolean;
    goal_for_tonight: string;
    help_me_by: string | null;
    help_you_by: string | null;
    ask_me_about: string | null;
    instagram: string | null;
    linkedin: string | null;
    twitter: string | null;
    website: string | null;
}

export function PremiumContactCards() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch Logic
    useEffect(() => {
        async function fetchContacts() {
            try {
                const { data, error } = await supabase
                    .from('leads')
                    .select('id, preferred_name, role, company, avatar, is_first_time, goal_for_tonight, help_me_by, help_you_by, ask_me_about, instagram, linkedin, twitter, website')
                    .not('preferred_name', 'is', null) // Only valid profiles
                    .order('created_at', { ascending: false })
                    .limit(50);

                if (error) throw error;

                // Map Supabase data to Contact interface
                const mapped: Contact[] = (data || []).map((user: any) => ({
                    id: user.id,
                    name: user.preferred_name || 'Anonymous',
                    role: user.role || 'Attendee',
                    company: user.company || 'Tech Alley Community',
                    avatar: user.avatar,
                    is_first_time: user.is_first_time,
                    goal_for_tonight: user.goal_for_tonight || 'Here to connect and learn',
                    help_me_by: user.help_me_by,
                    help_you_by: user.help_you_by,
                    ask_me_about: user.ask_me_about,
                    instagram: user.instagram,
                    linkedin: user.linkedin,
                    twitter: user.twitter,
                    website: user.website,
                }));

                setContacts(mapped);
            } catch (e) {
                console.error("Error fetching contacts:", e);
            } finally {
                setLoading(false);
            }
        }

        fetchContacts();
    }, []);

    // Auto-advance
    useEffect(() => {
        if (contacts.length <= 1) return;
        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % contacts.length);
        }, 8000); // Slower for reading cards

        return () => clearInterval(timer);
    }, [contacts.length]);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8,
            rotateY: direction > 0 ? 45 : -45
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8,
            rotateY: direction < 0 ? 45 : -45
        })
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut" as const // Explicit content for TS
            }
        }
    };

    const nextContact = () => {
        if (contacts.length <= 1) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % contacts.length);
    };

    const prevContact = () => {
        if (contacts.length <= 1) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + contacts.length) % contacts.length);
    };

    if (loading) return <div className="text-white text-center py-20">Loading Community...</div>;
    if (contacts.length === 0) return <div className="text-white text-center py-20">No contacts found yet. Be the first to join!</div>;

    const currentContact = contacts[currentIndex];

    return (
        <section id="contact-cards" className="relative py-12 md:py-24 overflow-hidden w-full">
            {/* Background Effects (Keeping User's Animation) */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.08] via-purple-500/[0.05] to-rose-500/[0.08]"
                    animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    style={{ backgroundSize: '400% 400%' }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">

                {/* Header */}
                <motion.div className="text-center mb-12" variants={fadeInUp} initial="hidden" whileInView="visible">
                    <motion.div
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.08] border border-white/[0.15] backdrop-blur-sm mb-6"
                    >
                        <Sparkles className="h-4 w-4 text-indigo-300" />
                        <span className="text-sm font-medium text-white/80">IRL Rolodex Live</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-white/80 mb-4">
                        Connect & Collaborate
                    </h2>
                    <p className="text-slate-400">Discover who is in the room right now.</p>
                </motion.div>

                {/* Card Display */}
                <div className="relative max-w-4xl mx-auto mb-16 px-2">
                    <div className="relative min-h-[600px] perspective-1000">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={currentContact.id} // Ensure key changes for animation
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.4 },
                                    scale: { duration: 0.4 },
                                    rotateY: { duration: 0.6 }
                                }}
                                className="absolute inset-0 w-full"
                            >
                                <div className="relative h-full bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 overflow-y-auto overflow-x-hidden group shadow-2xl">

                                    {/* Card Content */}
                                    <div className="flex flex-col md:flex-row gap-8 h-full">

                                        {/* Left Column: Avatar & Basic Info */}
                                        <div className="flex-shrink-0 text-center md:text-left md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
                                            <motion.div className="relative mb-6 mx-auto md:mx-0 w-32 h-32" whileHover={{ scale: 1.05 }}>
                                                <Avatar className="w-32 h-32 border-4 border-white/10 shadow-xl">
                                                    <AvatarImage src={currentContact.avatar || ''} className="object-cover" />
                                                    <AvatarFallback className="bg-slate-800 text-2xl">{currentContact.name.substring(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                {/* Status Ring */}
                                                <motion.div
                                                    className={`absolute inset-0 border-2 rounded-full ${currentContact.is_first_time ? 'border-green-400/50' : 'border-purple-400/50'}`}
                                                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                                                    transition={{ duration: 3, repeat: Infinity }}
                                                />
                                            </motion.div>

                                            <h3 className="text-2xl font-bold text-white mb-1">{currentContact.name}</h3>
                                            <p className="text-indigo-400 font-medium mb-1">{currentContact.role}</p>
                                            <p className="text-slate-400 text-sm mb-4">{currentContact.company}</p>

                                            <Badge className={`mb-6 ${currentContact.is_first_time ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30' : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'}`}>
                                                {currentContact.is_first_time ? '🌱 First Time Techer' : '👑 Returning Legend'}
                                            </Badge>

                                            {/* Socials */}
                                            <div className="flex justify-center md:justify-start gap-3 mt-auto">
                                                {currentContact.linkedin && (
                                                    <a href={currentContact.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-blue-600/20 hover:text-blue-400 transition-colors">
                                                        <Linkedin size={18} />
                                                    </a>
                                                )}
                                                {currentContact.twitter && (
                                                    <a href={currentContact.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-sky-500/20 hover:text-sky-400 transition-colors">
                                                        <Twitter size={18} />
                                                    </a>
                                                )}
                                                {currentContact.instagram && (
                                                    <a href={currentContact.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-pink-600/20 hover:text-pink-400 transition-colors">
                                                        <Instagram size={18} />
                                                    </a>
                                                )}
                                                {currentContact.website && (
                                                    <a href={currentContact.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-emerald-600/20 hover:text-emerald-400 transition-colors">
                                                        <Globe size={18} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Column: Intention & Ask Me About */}
                                        <div className="flex-1 space-y-6 text-left">

                                            {/* Intention */}
                                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                                <h4 className="text-sm uppercase tracking-wider text-slate-500 mb-2 font-semibold">Tonight's Mission</h4>
                                                <p className="text-lg text-white font-medium">"{currentContact.goal_for_tonight}"</p>
                                            </div>

                                            {/* The Exchange */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {(currentContact.help_you_by) && (
                                                    <div className="space-y-1">
                                                        <h5 className="text-xs uppercase text-green-400/80 font-bold">I Can Help With</h5>
                                                        <p className="text-slate-300 text-sm leading-relaxed">{currentContact.help_you_by}</p>
                                                    </div>
                                                )}
                                                {(currentContact.help_me_by) && (
                                                    <div className="space-y-1">
                                                        <h5 className="text-xs uppercase text-orange-400/80 font-bold">I Need Help With</h5>
                                                        <p className="text-slate-300 text-sm leading-relaxed">{currentContact.help_me_by}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Ask Me About / Skills */}
                                            {currentContact.ask_me_about && (
                                                <div>
                                                    <h4 className="text-sm uppercase tracking-wider text-indigo-400 mb-3 font-semibold flex items-center gap-2">
                                                        <MessageCircle size={14} /> Ask Me About
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {currentContact.ask_me_about.split(',').map((skill, i) => (
                                                            <span key={i} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-sm">
                                                                {skill.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex justify-center items-center gap-6 mt-8">
                        <motion.button
                            onClick={prevContact}
                            className="p-3 rounded-full bg-white/[0.08] border border-white/[0.15] backdrop-blur-sm text-white hover:bg-white/[0.15] transition-all"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </motion.button>

                        {/* Simple Dots */}
                        <div className="flex gap-2">
                            {contacts.map((_, idx) => (
                                <div key={idx} className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-indigo-400' : 'bg-white/20'}`} />
                            ))}
                        </div>

                        <motion.button
                            onClick={nextContact}
                            className="p-3 rounded-full bg-white/[0.08] border border-white/[0.15] backdrop-blur-sm text-white hover:bg-white/[0.15] transition-all"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </div>

                </div>
            </div>
        </section>
    );
}
