'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { ArrowUpRight, Loader2 } from 'lucide-react';
import SpeakerDrawer, { ExtendedSpeaker } from '@/components/SpeakerDrawer';
import { motion } from 'framer-motion';
import { WarpBackground } from '@/components/ui/warp-background';
import { getTonightLineup } from '@/lib/lineup';

// Tentative mapping of user uploaded logos.
// 0: Tech Alley, 1: Dead Sprint, 2: GOED, 3: Social Alignment, 4: Silver Sevens
const LOGO_MAP = {
    techAlley: '/ta-header-badge.png',
    deadSprint: '/logos/new/logo-4.png',
    goed: '/logos/new/logo-2.png',
    socialAlignment: '/logos/new/logo-1.png',
    silverSevens: '/logos/new/logo-3.png'
};

const FALLBACK_SPEAKERS: ExtendedSpeaker[] = [
    {
        id: '3',
        name: 'Lorainne Yarde',
        title: 'Chapter Lead',
        company: 'Tech Alley Henderson',
        image: '/lorainne-profile.png',
        imageClassName: "w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out",
        promoImage: LOGO_MAP.techAlley,
        topics: ['State of the Alley', 'Innovation Hub'],
        bioShort: 'Leading the charge for innovation and community connection.',
        quote: "It's not about who you become to build the brand, but rather what the brand becomes because YOU make it.",
        industry: 'Community Organization',
        valueProposition: 'I help tech enthusiasts connect with like-minded individuals using community events.',
        landingPage: 'https://techalley.org',
        deckLink: 'https://techalley.org/deck',
        resourceLink: 'https://techalley.org/resource',
        sessionTitle: 'State of the Alley 2024',
        sessionAbstract: 'An update on the progress of Tech Alley and what lies ahead for the innovation community in Henderson.',
        socials: { linkedin: 'https://linkedin.com', instagram: 'https://instagram.com', facebook: 'https://facebook.com' },
        status: 'complete',
        completion: 100,
    },
    {
        id: '5',
        name: 'Hoz Roushdi',
        title: 'Host',
        company: 'Hello Henderson Podcast',
        image: '/hoz-profile.jpg',
        promoImage: LOGO_MAP.deadSprint,
        topics: ['Podcasting', 'Content Strategy'],
        bioShort: 'Voice of the community and podcasting expert.',
        quote: "It's not about who you become to build the brand, but rather what the brand becomes because YOU make it.",
        industry: 'Media & Podcasting',
        valueProposition: 'I help creators launch successful podcasts using proven content strategies.',
        landingPage: 'https://deadsprintradio.com',
        deckLink: 'https://deadsprintradio.com/deck',
        resourceLink: 'https://deadsprintradio.com/resource',
        sessionTitle: 'Podcasting 101',
        sessionAbstract: 'A comprehensive guide to starting your own podcast, from equipment selection to content planning and distribution.',
        socials: { linkedin: 'https://linkedin.com', youtube: 'https://youtube.com/@deadsprint', instagram: 'https://instagram.com' },
        status: 'complete',
        completion: 100,
    },
    {
        id: '1',
        name: 'Shaq Cruz',
        title: 'Entrepreneurship Coordinator',
        company: 'GOED',
        image: '/shaq-profile.png',
        imageClassName: "w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out",
        promoImage: LOGO_MAP.goed,
        topics: ['Resilience', 'Restoration'],
        bioShort: 'Empowering communities through resilience and restoration.',
        quote: "It's not about who you become to build the brand, but rather what the brand becomes because YOU make it.",
        industry: 'Restoration Services',
        valueProposition: 'I help homeowners recover from disasters using efficient restoration techniques.',
        landingPage: 'https://lifesavers.com/speaker',
        deckLink: 'https://lifesavers.com/deck',
        resourceLink: 'https://lifesavers.com/resource',
        sessionTitle: 'Building Resilient Communities',
        sessionAbstract: 'Disasters can strike at any time. In this session, we will discuss how to prepare your community for the unexpected.',
        socials: { linkedin: 'https://linkedin.com' },
        status: 'complete',
        completion: 100,
    },
    {
        id: '4',
        name: 'Jonathan Sterritt',
        title: 'CEO',
        company: 'Social Alignment, LLC',
        image: '/jonathan-profile.jpg',
        imageClassName: "w-full h-full object-cover object-top scale-110 group-hover:scale-125 transition-transform duration-700 ease-out",
        promoImage: LOGO_MAP.socialAlignment,
        topics: ['System Automation', 'Lead Gen'],
        bioShort: 'Optimizing digital strategies for maximum impact.',
        quote: "It's not about who you become to build the brand, but rather what the brand becomes because YOU make it.",
        industry: 'Digital Marketing',
        valueProposition: 'I help businesses generate more leads using automated digital strategies.',
        landingPage: 'https://socialalignment.biz/speaker',
        deckLink: 'https://socialalignment.biz/deck',
        resourceLink: 'https://socialalignment.biz/resource',
        sessionTitle: 'Automating Lead Gen',
        sessionAbstract: 'Learn how to set up automated systems that consistently bring in high-quality leads for your business.',
        socials: { linkedin: 'https://linkedin.com/in/jonathansterritt', website: 'https://socialalignment.biz' },
        status: 'complete',
        completion: 100,
    },
    {
        id: '2',
        name: 'Todd DeRemer',
        title: 'Vice President',
        company: 'Silver Sevens Hotel and Casino',
        image: '/todd-profile.png',
        imageClassName: "w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out",
        promoImage: LOGO_MAP.silverSevens,
        topics: ['Hospitality Tech', 'Growth'],
        bioShort: 'Driving economic growth and community integration in Henderson.',
        quote: "It's not about who you become to build the brand, but rather what the brand becomes because YOU make it.",
        industry: 'Hospitality & Gaming',
        valueProposition: 'I help local businesses integrate with the community using strategic partnerships.',
        landingPage: 'https://thepasscasino.com/community',
        deckLink: 'https://thepasscasino.com/deck',
        resourceLink: 'https://thepasscasino.com/resource',
        sessionTitle: 'The Future of Hospitality Tech',
        sessionAbstract: 'Explore how technology is revolutionizing the hospitality industry, enhancing guest experiences.',
        socials: { linkedin: 'https://linkedin.com' },
        status: 'complete',
        completion: 100,
    }
];

export default function SpeakersPage() {
    const [selectedSpeaker, setSelectedSpeaker] = useState<ExtendedSpeaker | null>(null);
    const [speakers, setSpeakers] = useState<ExtendedSpeaker[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getTonightLineup();
                if (data && data.length > 0) {
                    setSpeakers(data);
                } else {
                    setSpeakers(FALLBACK_SPEAKERS);
                }
            } catch (error) {
                console.error("Failed to load speakers", error);
                setSpeakers(FALLBACK_SPEAKERS);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const handleSpeakerClick = (speaker: ExtendedSpeaker) => {
        if (speaker.id === '5') {
            router.push('/hub/spotlight');
        } else {
            setSelectedSpeaker(speaker);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 50 } }
    };

    return (
        <main className="min-h-screen relative w-full bg-slate-950 overflow-hidden text-white font-sans selection:bg-cyan-500/30">
            {/* Warp Background for that 'Welcome Page' Energy */}
            <div className="fixed inset-0 z-0 bg-transparent">
                <WarpBackground className="w-full h-full" gridColor="rgba(139, 92, 246, 0.4)" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 text-center"
                >
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">
                            TONIGHT&apos;S LINEUP
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400 font-medium tracking-wide">Minds shaping the conversation.</p>
                </motion.div>

                {/* Main Content Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3"
                >
                    {/* Featured Speakers (Lorainne & Hoz) - Full Width 'Hero' Cards */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-cyan-500 w-12 h-12" />
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-12">
                                {speakers.slice(0, 2).map((speaker, idx) => (
                                    <motion.div
                                        key={speaker.id}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.01 }}
                                        onClick={() => handleSpeakerClick(speaker)}
                                        className={`cursor-pointer relative overflow-hidden rounded-[2.5rem] p-[1px] bg-gradient-to-br ${idx === 0 ? 'from-cyan-500 via-blue-500 to-transparent' : 'from-fuchsia-500 via-purple-500 to-transparent'
                                            } shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] group`}
                                    >
                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />

                                        <div className="relative h-full bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 overflow-hidden">
                                            {/* Background Glow */}
                                            <div className={`absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 pointer-events-none ${idx === 0 ? 'bg-cyan-500' : 'bg-fuchsia-500'
                                                }`} />

                                            {/* Image */}
                                            <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                                                <div className={`absolute inset-0 rounded-[2rem] rotate-6 opacity-40 blur-md transition-transform duration-500 group-hover:rotate-12 ${idx === 0 ? 'bg-cyan-400' : 'bg-fuchsia-400'
                                                    }`} />
                                                <img
                                                    src={speaker.image}
                                                    alt={speaker.name}
                                                    className={`relative w-full h-full object-cover rounded-[2rem] shadow-2xl z-10 transition-transform duration-500 group-hover:scale-105 ${speaker.imageClassName || ''}`}
                                                />
                                            </div>

                                            {/* Text */}
                                            <div className="flex-1 text-center md:text-left z-10">
                                                <div className={`inline-flex items-center px-4 py-1.5 rounded-full border mb-4 backdrop-blur-md ${idx === 0 ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300'
                                                    }`}>
                                                    <span className="text-xs font-bold tracking-wider uppercase">{idx === 0 ? 'Chapter Lead' : 'Spotlight'}</span>
                                                </div>
                                                <h2 className="text-5xl md:text-6xl font-black text-white mb-2 leading-tight tracking-tight">{speaker.name.toUpperCase()}</h2>
                                                <p className="text-lg text-slate-300 mb-6 font-medium">{speaker.title} • {speaker.company}</p>

                                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                                    {speaker.topics.map(topic => (
                                                        <span key={topic} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 transition-colors">
                                                            {topic}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Logo Badge */}
                                            <div className={`w-44 h-44 flex-shrink-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500 ${speaker.id === '5' ? 'p-0' : 'p-4'}`}>
                                                <img src={speaker.promoImage} alt="Logo" className={`w-full h-full object-contain scale-150 ${speaker.id === '3' ? 'translate-y-2' : '-translate-y-1'}`} />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Grid Speakers (Shaq, Jonathan, Todd) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {speakers.slice(2).map((speaker) => (
                                    <motion.div
                                        key={speaker.id}
                                        variants={itemVariants}
                                        whileHover={{ y: -5 }}
                                        onClick={() => handleSpeakerClick(speaker)}
                                        className="cursor-pointer group relative overflow-hidden rounded-3xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 transition-colors duration-300 h-full"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="p-6 flex flex-col h-full relative z-10">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-2 border-white/10 group-hover:border-cyan-400/50 transition-colors">
                                                    <img src={speaker.image} alt={speaker.name} className={`w-full h-full object-cover ${speaker.imageClassName || ''}`} />
                                                </div>
                                                {/* Logo - Sized Up & Filtered */}
                                                <div className={`w-32 h-32 transition-all duration-500 p-1 ${speaker.id === '4' ? 'opacity-100' : 'brightness-0 invert opacity-70 group-hover:opacity-100'}`}>
                                                    <img src={speaker.promoImage} alt="Logo" className="w-full h-full object-contain scale-[2.0] translate-y-1 -translate-x-6" />
                                                </div>
                                            </div>

                                            <div className="mt-auto">
                                                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{speaker.name}</h3>
                                                <p className="text-sm text-slate-400 mb-4 line-clamp-1">{speaker.title}, {speaker.company}</p>

                                                <div className="bg-white/5 rounded-xl px-3 py-2 border border-white/5 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                                                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Speaking On</span>
                                                    <span className="text-xs text-cyan-200/80 truncate">{speaker.topics[0]}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    )}
                </motion.div>

                {/* Footer CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-32 relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-12 md:p-16"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent opacity-50" />

                    <div className="relative z-10 max-w-[90rem] mx-auto flex flex-col xl:flex-row items-center justify-between gap-20">
                        <div className="text-left flex-1 min-w-[600px]">
                            <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">Step Into the Spotlight</h2>
                            <p className="text-white mb-8 text-xl max-w-3xl leading-relaxed">
                                We're looking for innovators, builders, and storytellers to share their expertise and shape the future of Henderson's tech ecosystem.
                            </p>
                            <button className="whitespace-nowrap px-10 py-5 bg-white text-slate-950 font-bold rounded-full text-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-2">
                                Now Isn't the Time to Be Modest <ArrowUpRight className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Partner Logos */}
                        <div className="flex items-center gap-6 shrink-0">
                            <img src="/ta-header-badge.png" alt="Tech Alley" className="h-32 md:h-48 lg:h-64 w-auto object-contain" />
                            <img src={LOGO_MAP.deadSprint} alt="Dead Sprint Radio" className="h-32 md:h-48 lg:h-64 w-auto object-contain -translate-y-4" />
                        </div>
                    </div>
                </motion.div>
            </div>

            <SpeakerDrawer
                isOpen={!!selectedSpeaker}
                onClose={() => setSelectedSpeaker(null)}
                speaker={selectedSpeaker}
            />
        </main >
    );
}
