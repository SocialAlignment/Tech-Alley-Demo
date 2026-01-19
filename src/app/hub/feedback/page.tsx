"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedShaderBackground from '@/components/ui/animated-shader-background';
import SpeakerCard from '@/components/SpeakerCard';
import SpeakerInteractionModal, { InteractionMode } from '@/components/SpeakerInteractionModal';
import { ExtendedSpeaker } from '@/components/SpeakerDrawer';
import { getTonightLineup } from '@/lib/lineup';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Keep the same logic as SpeakersPage for data
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
        name: 'Lorraine Yarde',
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
        landingPage: 'https://goed.nv.gov/',
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
        landingPage: 'https://socialalignment.biz/',
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
        title: 'GM',
        company: 'Primm Valley Casino Resorts',
        image: '/todd-profile.png',
        imageClassName: "w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out",
        promoImage: LOGO_MAP.silverSevens,
        topics: ['Hospitality Tech', 'Growth'],
        bioShort: 'Driving economic growth and community integration in Henderson.',
        quote: "It's not about who you become to build the brand, but rather what the brand becomes because YOU make it.",
        industry: 'Hospitality & Gaming',
        valueProposition: 'I help local businesses integrate with the community using strategic partnerships.',
        landingPage: 'https://primmvalleyresorts.com/',
        deckLink: 'https://thepasscasino.com/deck',
        resourceLink: 'https://thepasscasino.com/resource',
        sessionTitle: 'The Future of Hospitality Tech',
        sessionAbstract: 'Explore how technology is revolutionizing the hospitality industry, enhancing guest experiences.',
        socials: { linkedin: 'https://linkedin.com' },
        status: 'complete',
        completion: 100,
    }
];

export default function FeedbackPage() {
    const router = useRouter();
    const [speakers, setSpeakers] = useState<ExtendedSpeaker[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSpeaker, setSelectedSpeaker] = useState<ExtendedSpeaker | null>(null);
    const [modalMode, setModalMode] = useState<InteractionMode>('question');

    const handleQuestionClick = (speaker: ExtendedSpeaker) => {
        setModalMode('question');
        setSelectedSpeaker(speaker);
    };

    const handleFeedbackClick = (speaker: ExtendedSpeaker) => {
        setModalMode('feedback');
        setSelectedSpeaker(speaker);
    };

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getTonightLineup();
                if (data && data.length > 0) {
                    const patchedData = data.map(s => {
                        // Jonathan Patch
                        if (s.id === '4' || s.name.includes('Jonathan')) {
                            return {
                                ...s,
                                promoImage: LOGO_MAP.socialAlignment,
                                landingPage: 'https://socialalignment.biz/',
                                socials: { ...s.socials, website: 'https://socialalignment.biz' }
                            };
                        }
                        // Shaq Patch
                        if (s.id === '1' || s.name.includes('Shaq')) {
                            return {
                                ...s,
                                landingPage: 'https://goed.nv.gov/'
                            };
                        }
                        // Todd Patch
                        if (s.id === '2' || s.name.includes('Todd')) {
                            return {
                                ...s,
                                title: 'GM',
                                company: 'Primm Valley Casino Resorts',
                                landingPage: 'https://primmvalleyresorts.com/'
                            };
                        }
                        return s;
                    });
                    setSpeakers(patchedData);
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <main className="min-h-screen relative w-full bg-slate-950 overflow-y-auto text-white font-sans selection:bg-cyan-500/30 pb-20">
            {/* Animated Shader Background */}
            <div className="fixed inset-0 z-0 bg-transparent pointer-events-none">
                <AnimatedShaderBackground />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={20} /> Back
                </button>

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                            Ask a Speaker
                        </span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto text-balance">
                        Have a question? Select a speaker below to submit your question for the live Q&A session.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-cyan-500 w-12 h-12" />
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {speakers.map((speaker) => (
                            <motion.div key={speaker.id} variants={itemVariants}>
                                <SpeakerCard
                                    speaker={speaker}
                                    onClick={(action) => {
                                        if (action === 'questions') {
                                            handleQuestionClick(speaker);
                                        } else if (action === 'feedback') {
                                            handleFeedbackClick(speaker);
                                        } else {
                                            // Open website on card click
                                            const url = speaker.landingPage || speaker.website;
                                            if (url) {
                                                window.open(url, '_blank');
                                            }
                                        }
                                    }}
                                    variant="dark"
                                    isSpotlight={false}
                                    layout="comprehensive"
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            <SpeakerInteractionModal
                isOpen={!!selectedSpeaker}
                onClose={() => setSelectedSpeaker(null)}
                speaker={selectedSpeaker}
                initialMode={modalMode}
            />
        </main>
    );
}
