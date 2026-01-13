'use client';

import { motion } from 'framer-motion';
import { Linkedin, Instagram, Globe, Twitter } from 'lucide-react';

const SOCIALS = [
    {
        name: "Tech Alley Henderson",
        handle: "@techalleyhenderson",
        links: [
            { icon: Globe, url: "https://techalley.org" },
            { icon: Linkedin, url: "#" },
            { icon: Instagram, url: "#" }
        ]
    },
    {
        name: "Social Alignment",
        handle: "@socialalignment",
        links: [
            { icon: Globe, url: "https://socialalignment.biz" },
            { icon: Linkedin, url: "#" },
            { icon: Twitter, url: "#" }
        ]
    },
    {
        name: "Dead Sprint Radio",
        handle: "@deadsprintradio",
        links: [
            { icon: Globe, url: "https://deadsprintradio.com" },
            { icon: Instagram, url: "#" }
        ]
    }
];

export default function FollowUsPage() {
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold mb-2">Stay <span className="gradient-text">Connected</span></h1>
                <p className="text-gray-400">Follow the brands making this event possible.</p>
            </motion.div>

            <div className="space-y-4">
                {SOCIALS.map((brand, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-panel p-6 flex flex-col md:flex-row items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold">
                                {brand.name[0]}
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="font-bold text-lg">{brand.name}</h3>
                                <p className="text-sm text-gray-500">{brand.handle}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {brand.links.map((link, j) => (
                                <a
                                    key={j}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:text-[#9d4edd] transition-colors"
                                >
                                    <link.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
