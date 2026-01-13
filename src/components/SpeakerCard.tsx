'use client';

import { motion } from 'framer-motion';
import { Linkedin, Globe } from 'lucide-react';

interface SpeakerProps {
    name: string;
    title: string;
    company: string;
    image: string;
    topics: string[];
}

export default function SpeakerCard({ name, title, company, image, topics, isSpotlight }: SpeakerProps & { isSpotlight?: boolean }) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className={`bg-white p-6 rounded-[2rem] border relative overflow-hidden group transition-all duration-300 ${isSpotlight
                    ? 'border-purple-300 shadow-lg shadow-purple-100 ring-4 ring-purple-50'
                    : 'border-slate-100 shadow-sm hover:shadow-md'
                }`}
        >
            {isSpotlight && (
                <div className="absolute top-0 right-0 bg-gradient-to-bl from-purple-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-20">
                    SPOTLIGHT
                </div>
            )}

            <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
                <div className="flex gap-4">
                    <div className={`w-16 h-16 rounded-2xl overflow-hidden shadow-sm ${isSpotlight ? 'ring-2 ring-purple-200' : ''}`}>
                        <img src={image} alt={name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-slate-900 leading-tight">
                                {name.split(' ').map((n, i) => (
                                    <span key={i} className="block md:inline mr-1">{n}</span>
                                ))}
                            </h3>
                            {/* Social Icons (Placeholder for now, visible on hover or always? Let's make them always visible but subtle) */}
                            <div className="flex gap-1 opacity-100 transition-opacity">
                                <button className="text-slate-300 hover:text-[#0077b5] transition-colors"><Linkedin size={14} /></button>
                                <button className="text-slate-300 hover:text-purple-600 transition-colors"><Globe size={14} /></button>
                            </div>
                        </div>
                        <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-0.5">{title}</p>
                        <p className="text-xs text-slate-500 font-medium">{company}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3 relative z-10">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Speaking On:</p>
                <div className="flex flex-wrap gap-2">
                    {topics.map((topic, i) => (
                        <span key={i} className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-50 text-slate-600 border border-slate-100 group-hover:border-purple-100 group-hover:bg-purple-50 group-hover:text-purple-700 transition-colors">
                            {topic}
                        </span>
                    ))}
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0" />
        </motion.div>
    );
}
