'use client';

import { motion } from 'framer-motion';
import { Share2, Heart } from 'lucide-react';
import SponsorDonationFeed from '@/components/SponsorDonationFeed';
import { Button } from '@/components/ui/button';

export default function SponsorsPage() {
    // Hardcoded stats for now, could be dynamic later
    const totalRaised = 5373;
    const donorCount = 42;
    const goal = 10000;
    const progress = (totalRaised / goal) * 100;

    return (
        <div className="min-h-full pb-20">
            {/* Hero Section */}
            <div className="relative w-full h-[300px] md:h-[400px] bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent z-10" />
                <img
                    src="https://pledgeling-res.cloudinary.com/image/upload/c_fill,f_auto,h_720,q_auto,w_1280/v1/prod-media/images/fundraiser_landing_pages/base/default-v2.jpg"
                    alt="Fundraiser Hero"
                    className="w-full h-full object-cover opacity-80"
                />

                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10 max-w-7xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end gap-6"
                    >
                        {/* Logo Box */}
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl p-4 shadow-xl flex items-center justify-center shrink-0">
                            <img
                                src="/hub-icon.png?v=2"
                                alt="Organization Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="pb-2">
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 shadow-sm">
                                Let's Build the Tech and Startup Community
                            </h1>
                            <p className="text-blue-200 font-medium text-lg">
                                Organized by Tech Alley Henderson
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats Card Mobile (visible only on small screens) */}
                        <div className="lg:hidden bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                            <div className="mb-4">
                                <h2 className="text-3xl font-bold text-white mb-1">
                                    ${totalRaised.toLocaleString()}
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    raised of ${goal.toLocaleString()} goal • {donorCount} donors
                                </p>
                            </div>
                            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-6">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-emerald-500 rounded-full"
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 text-lg">
                                    Donate Now
                                </Button>
                                <Button variant="outline" className="w-12 h-12 p-0 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700">
                                    <Share2 size={20} />
                                </Button>
                            </div>
                        </div>

                        {/* Story Section */}
                        <div className="bg-slate-800/30 rounded-3xl p-6 md:p-8 backdrop-blur-sm border border-slate-700/50">
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-4">
                                About This Fundraiser
                            </h2>
                            <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-4">
                                <p>
                                    Welcome to the official fundraiser page for <strong>"Tech Alley - Let's Build the Tech and Startup Community!"</strong> Your support is crucial in empowering Tech Alley, a leading nonprofit organization dedicated to nurturing the tech and startup ecosystem.
                                </p>
                                <p>
                                    Launched in 2021 in the vibrant city of Las Vegas, Nevada, Tech Alley has quickly become a cornerstone for aspiring entrepreneurs, tech enthusiasts, and startup leaders, providing them with the guidance, resources, and support needed to excel in their ventures.
                                </p>
                                <p>
                                    At Tech Alley, we believe that the key to success lies in community collaboration and mentorship. Our organization was born out of a desire to cultivate a mentorship culture where mentors are celebrated as superstars.
                                </p>
                                <h3 className="text-white font-bold text-xl mt-6 mb-2">Our Mission</h3>
                                <p>
                                    Strengthen communities by uniting people, fostering a creative class, and promoting an inclusive, diverse, and innovative technology and startup culture. We achieve this by serving as a vibrant hub where technology, entrepreneurship, and innovation groups can collaborate and thrive.
                                </p>
                                <div className="my-8 p-6 bg-blue-500/10 border-l-4 border-blue-500 rounded-r-xl">
                                    <p className="italic text-blue-200 m-0">
                                        "This fundraiser aims to amplify our efforts and extend our reach, allowing us to continue creating new opportunities for growth and success in the tech and startup community."
                                    </p>
                                </div>
                                <p>
                                    Your generous contribution will directly support our initiatives to provide educational workshops, mentorship programs, networking events, and resources that empower individuals to turn their visions into reality.
                                </p>
                                <p className="font-semibold text-white">
                                    Join us in building a brighter, more inclusive future for the tech and startup world. Thank you for your support!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Donation Card Desktop */}
                        <div className="hidden lg:block sticky top-6 bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-700">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                                Fundraiser Progress
                            </h3>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-4xl font-bold text-white">${totalRaised.toLocaleString()}</span>
                                <span className="text-slate-400">raised</span>
                            </div>
                            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-2">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-emerald-500 rounded-full"
                                />
                            </div>
                            <div className="flex justify-between text-sm text-slate-400 mb-6">
                                <span>{progress.toFixed(0)}% of goal</span>
                                <span>{donorCount} donors</span>
                            </div>

                            <div className="space-y-3">
                                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 text-lg shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]">
                                    Donate Now
                                </Button>
                                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 gap-2">
                                    <Share2 size={18} />
                                    Share Fundraiser
                                </Button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-700 flex items-center justify-center gap-2 text-slate-400 text-sm">
                                <Heart size={16} className="text-red-500" />
                                <span>All donations are tax deductible</span>
                            </div>
                        </div>

                        {/* Feed Section */}
                        <div className="bg-slate-900/50 rounded-3xl p-6 border border-slate-800">
                            <SponsorDonationFeed />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
