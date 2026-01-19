'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { ArrowUpRight } from 'lucide-react';
import SpeakerCard from '@/components/SpeakerCard';
import SpeakerDrawer, { ExtendedSpeaker } from '@/components/SpeakerDrawer';

// Transformed Data from original Guest Speaker Page
// Reordered for Layout: Lorraine, Hoz, Shaq, Jonathan, Todd
const SPEAKERS: ExtendedSpeaker[] = [
    {
        id: '3',
        name: 'Lorainne Yard',
        title: 'Chapter Lead',
        company: 'Tech Alley Henderson',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        promoImage: '/tech-alley-logo.png',
        topics: ['State of the Alley', 'Innovation Hub', 'Community Growth'],
        bioShort: 'Leading the charge for innovation and community connection.',
        quote: "It's not about who you become to build the brand, but rather what the brand becomes because YOU make it.",
        industry: 'Community Organization',
        valueProposition: 'I help tech enthusiasts connect with like-minded individuals using community events.',
        landingPage: 'https://techalley.org',
        deckLink: 'https://techalley.org/deck',
        resourceLink: 'https://techalley.org/resource',
        sessionTitle: 'State of the Alley 2024',
        sessionAbstract: 'An update on the progress of Tech Alley and what lies ahead for the innovation community in Henderson.',
        socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
            facebook: 'https://facebook.com'
        },
        status: 'complete',
        completion: 100,
    },
    {
        id: '5',
        name: 'Hoz Roushdi',
        title: 'Host',
        company: 'Hello Henderson Podcast on Dead Sprint Radio',
        image: '/hoz-profile.jpg',
        topics: ['Podcasting', 'Content Strategy', 'Community'],
        bioShort: 'Voice of the community and podcasting expert.',
        quote: "It's not about who you become to build the brand, but rather what the brand becomes because YOU make it.",
        industry: 'Media & Podcasting',
        valueProposition: 'I help creators launch successful podcasts using proven content strategies.',
        landingPage: 'https://deadsprintradio.com',
        deckLink: 'https://deadsprintradio.com/deck',
        resourceLink: 'https://deadsprintradio.com/resource',
        sessionTitle: 'Podcasting 101: From Idea to Launch',
        sessionAbstract: 'A comprehensive guide to starting your own podcast, from equipment selection to content planning and distribution.',
        socials: {
            linkedin: 'https://linkedin.com',
            youtube: 'https://youtube.com/@deadsprint',
            instagram: 'https://instagram.com'
        },
        status: 'complete',
        completion: 100,
    },
    {
        id: '1',
        name: 'Shaq Cruz',
        title: 'Entrepreneurship Coordinator',
        company: 'GOED',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        promoImage: '/tech-alley-logo.png',
        topics: ['Resilience', 'Disaster Recovery', 'Local Business'],
        bioShort: 'Empowering communities through resilience and restoration.',
        quote: "It's not about who you become to build the brand, but rather what the brand becomes because YOU make it.",
        industry: 'Restoration Services',
        valueProposition: 'I help homeowners recover from disasters using efficient restoration techniques.',
        landingPage: 'https://lifesavers.com/speaker',
        deckLink: 'https://lifesavers.com/deck',
        resourceLink: 'https://lifesavers.com/resource',
        sessionTitle: 'Building Resilient Communities',
        sessionAbstract: 'Disasters can strike at any time. In this session, we will discuss how to prepare your community for the unexpected and how to recover quickly and effectively.',
        socials: {
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
            facebook: 'https://facebook.com',
            youtube: 'https://youtube.com',
            scheduling: 'https://calendly.com',
            twitter: 'https://x.com/lifesavers',
            tiktok: 'https://tiktok.com/@lifesavers'
        },
        status: 'complete',
        completion: 100,
    },
    {
        id: '4',
        name: 'Jonathan Sterritt',
        title: 'CEO',
        company: 'Social Alignment, LLC',
        image: '/jonathan-profile.jpg',
        promoImage: '/tech-alley-logo.png', // Main updated promo image
        topics: ['System Automation', 'Lead Gen', 'Digital Strategy'],
        bioShort: 'Optimizing digital strategies for maximum impact.',

        quote: "It's not about who you become to build the brand, but rather what the brand becomes because YOU make it.",
        industry: 'Digital Marketing',
        valueProposition: 'I help businesses generate more leads using automated digital strategies.',
        landingPage: 'https://socialalignment.biz/speaker',
        deckLink: 'https://socialalignment.biz/deck',
        resourceLink: 'https://socialalignment.biz/resource',
        sessionTitle: 'Automating Your Lead Generation',
        sessionAbstract: 'Learn how to set up automated systems that consistently bring in high-quality leads for your business.',
        socials: {
            linkedin: 'https://linkedin.com/in/jonathansterritt',
            website: 'https://socialalignment.biz',
            scheduling: 'https://calendly.com/jsterritt'
        },
        status: 'complete',
        completion: 100,
    },
    {
        id: '2',
        name: 'Todd DeRemer',
        title: 'Vice President',
        company: 'Silver Sevens Hotel and Casino',
        image: '/todd-profile.png',
        promoImage: '/tech-alley-logo.png',
        topics: ['Community Integration', 'Hospitality Tech', 'Economic Growth'],
        bioShort: 'Driving economic growth and community integration in Henderson.',
        quote: "It's not about who you become to build the brand, but rather what the brand becomes because YOU make it.",
        industry: 'Hospitality & Gaming',
        valueProposition: 'I help local businesses integrate with the community using strategic partnerships.',
        landingPage: 'https://thepasscasino.com/community',
        deckLink: 'https://thepasscasino.com/deck',
        resourceLink: 'https://thepasscasino.com/resource',
        sessionTitle: 'The Future of Hospitality Tech',
        sessionAbstract: 'Explore how technology is revolutionizing the hospitality industry, enhancing guest experiences, and streamlining operations.',
        socials: {
            linkedin: 'https://linkedin.com',
            website: 'https://thepasscasino.com',
            twitter: 'https://x.com/thepasscasino'
        },
        status: 'complete',
        completion: 100,
    }
];

export default function SpeakersPage() {
    const [selectedSpeaker, setSelectedSpeaker] = useState<ExtendedSpeaker | null>(null);
    const router = useRouter();

    const handleSpeakerClick = (speaker: ExtendedSpeaker) => {
        if (speaker.id === '5') { // Hoz / Spotlight
            router.push('/hub/spotlight');
        } else {
            setSelectedSpeaker(speaker);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-24">
            <Header title="Guest Speakers" description="Minds shaping tonight's conversation." />

            <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">

                {/* Top Row: Hosts/Organizers (Centered) */}
                <div className="flex flex-col md:flex-row justify-center gap-6">
                    {SPEAKERS.slice(0, 2).map((speaker) => (
                        <div key={speaker.id} className="w-full md:w-[400px]">
                            <SpeakerCard
                                speaker={speaker}
                                onClick={() => handleSpeakerClick(speaker)}
                                isSpotlight={speaker.id === '5'} // Keep Hoz Spotlight if needed
                                variant="light"
                            />
                        </div>
                    ))}
                </div>

                {/* Bottom Row: Guest Speakers (Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {SPEAKERS.slice(2).map((speaker) => (
                        <SpeakerCard
                            key={speaker.id}
                            speaker={speaker}
                            onClick={() => handleSpeakerClick(speaker)}
                            variant="light"
                        />
                    ))}
                </div>

                {/* Info Section */}
                <div className="mt-16 bg-gradient-to-br from-purple-900 to-slate-900 rounded-3xl p-10 text-white relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl font-bold mb-4">Interested in Speaking?</h2>
                        <p className="text-purple-100 mb-8 leading-relaxed">
                            Tech Alley Henderson is always looking for new voices to share their expertise, stories, and innovations. Connect with our community and amplify your impact.
                        </p>
                        <button className="flex items-center gap-2 px-6 py-3 bg-white text-purple-900 font-bold rounded-xl hover:bg-purple-50 transition-colors">
                            Apply for Next Event <ArrowUpRight size={18} />
                        </button>
                    </div>
                    {/* Abstract Circle Backgrounds */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
                </div>
            </div>

            {/* Interactive Drawer */}
            <SpeakerDrawer
                isOpen={!!selectedSpeaker}
                onClose={() => setSelectedSpeaker(null)}
                speaker={selectedSpeaker}
            />
        </div>
    );
}
