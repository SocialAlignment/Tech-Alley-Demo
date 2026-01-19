'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { Users, Filter, Plus, ArrowUpRight } from 'lucide-react';
import SpeakerCard from '@/components/SpeakerCard';
import SpeakerDrawer, { ExtendedSpeaker } from '@/components/SpeakerDrawer';

// Mock Data for Concept Demonstration
const SPEAKERS: ExtendedSpeaker[] = [
    {
        id: '1',
        name: 'Sarah Chen',
        title: 'Lead Product Designer',
        company: 'InnovateOne',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&fit=crop',
        topics: ['UX Design', 'Product Strategy', 'Figma'],
        bioShort: 'Passionate about building inclusive digital experiences.',
        quote: 'Design is not just what it looks like and feels like. Design is how it works.',
        industry: 'Design Technology',
        valueProposition: 'I help startups build inclusive products using human-centered design.',
        landingPage: 'https://sarahchen.design',
        deckLink: 'https://sarahchen.design/deck',
        resourceLink: 'https://sarahchen.design/resource',
        sessionTitle: 'Inclusive Design for the Future',
        sessionAbstract: 'Discover how to create digital experiences that are accessible to everyone, regardless of their abilities or background.',
        status: 'complete',
        completion: 100,
        socials: {
            linkedin: 'https://linkedin.com/in/sarah-chen',
            website: 'https://sarahchen.design',
            instagram: 'https://instagram.com/sarahdesign',
            tiktok: 'https://tiktok.com/@sarahdesign'
        },
    },
    {
        id: '2',
        name: 'Michael Ross',
        title: 'CTO',
        company: 'CloudScale',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&h=256&fit=crop',
        topics: ['Cloud Architecture', 'DevOps'],
        bioShort: 'Building scalable infrastructure for the next billion users.',
        quote: 'Scalability is the key to unlocking global potential.',
        industry: 'Cloud Computing',
        valueProposition: 'I help enterprises scale their infrastructure using cloud-native technologies.',
        landingPage: 'https://cloudscale.io',
        deckLink: 'https://cloudscale.io/deck',
        resourceLink: 'https://cloudscale.io/resource',
        sessionTitle: 'Scalable Architecture for Global Growth',
        sessionAbstract: 'Learn how to design and build cloud infrastructure that can handle millions of users without compromising performance.',
        status: 'action_required',
        completion: 45,
        socials: {
            twitter: '@mross_tech',
            scheduling: 'https://calendly.com',
            tiktok: 'https://tiktok.com/@mross_tech'
        },
    },
    {
        id: '3',
        name: 'Jessica Lee',
        title: 'Founder',
        company: 'GreenTech Solutions',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&h=256&fit=crop',
        topics: ['Sustainability', 'Startups'],
        status: 'pending',
        quote: 'Sustainability is not a trend, it is a necessity.',
        industry: 'Green Technology',
        valueProposition: 'I help businesses reduce their carbon footprint using sustainable technologies.',
        landingPage: 'https://greentech.solutions',
        deckLink: 'https://greentech.solutions/deck',
        resourceLink: 'https://greentech.solutions/resource',
        sessionTitle: 'The Business Case for Sustainability',
        sessionAbstract: 'Explore how sustainable practices can drive profitability and long-term success for your business.',
        completion: 78,
        socials: {
            linkedin: 'https://linkedin.com',
            facebook: 'https://facebook.com'
        }
    },
    {
        id: '4',
        name: 'David Kim',
        title: 'AI Researcher',
        company: 'NeuralNet Labs',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop',
        topics: ['Machine Learning', 'Ethics in AI'],
        status: 'complete',
        quote: 'AI is a tool, not a replacement for human creativity.',
        industry: 'Artificial Intelligence',
        valueProposition: 'I help organizations implement ethical AI using transparent algorithms.',
        landingPage: 'https://neuralnet.ai',
        deckLink: 'https://neuralnet.ai/deck',
        resourceLink: 'https://neuralnet.ai/resource',
        sessionTitle: 'Ethical AI in Practice',
        sessionAbstract: 'A deep dive into the ethical considerations of artificial intelligence and how to ensure your AI systems are fair and unbiased.',
        completion: 100,
        socials: {
            youtube: 'https://youtube.com',
            linkedin: 'https://linkedin.com'
        }
    }
];

export default function SpeakerResourcesPage() {
    const [selectedSpeaker, setSelectedSpeaker] = useState<ExtendedSpeaker | null>(null);

    return (
        <div className="min-h-screen bg-slate-50/50 pb-24">
            <Header title="Speaker Hub" description="Manage your profile, speaking slots, and resources." />

            <div className="max-w-7xl mx-auto px-6 mt-8">

                {/* Action Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div className="flex gap-2 p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <button className="px-4 py-2 text-sm font-bold text-slate-700 bg-slate-100 rounded-lg">All Speakers</button>
                        <button className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg">Pending</button>
                        <button className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg">Complete</button>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                            <Filter size={16} /> Filters
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                            <Plus size={16} /> Add Speaker
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SPEAKERS.map((speaker, index) => (
                        <SpeakerCard
                            key={speaker.id}
                            speaker={speaker}
                            onClick={() => setSelectedSpeaker(speaker)}
                            isSpotlight={index === 0}
                            variant="light"
                        />
                    ))}

                    {/* Empty State / Add New Card Concept */}
                    <motion.button
                        whileHover={{ scale: 1.02, borderStyle: 'solid' }}
                        className="flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-blue-50 hover:border-blue-200 transition-all group h-full min-h-[280px]"
                    >
                        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-500 mb-4 transition-colors">
                            <Plus size={32} />
                        </div>
                        <h3 className="font-bold text-slate-600 group-hover:text-blue-700">Invite New Speaker</h3>
                        <p className="text-xs text-slate-400 mt-1">Send an invite via email</p>
                    </motion.button>
                </div>

                {/* Info Section */}
                <div className="mt-16 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-10 text-white relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl font-bold mb-4">Why Complete Your Profile?</h2>
                        <p className="text-indigo-100 mb-8 leading-relaxed">
                            Completing your speaker profile unlocks access to our dedicated marketing team, allows us to promote your session effectively, and ensures we have all the technical requirements for a flawless show.
                        </p>
                        <button className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors">
                            View Speaker Guide <ArrowUpRight size={18} />
                        </button>
                    </div>
                    {/* Abstract Circle Backgrounds */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
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
