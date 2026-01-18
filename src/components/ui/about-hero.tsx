"use client";

import React from "react";
import { ArrowRight, CheckSquare, User } from "lucide-react";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { useIdentity } from "@/context/IdentityContext";
import { useRouter } from "next/navigation";

export default function AboutHero() {
    const { isProfileComplete, leadId } = useIdentity();
    const router = useRouter();

    const handleProfileClick = () => {
        if (isProfileComplete) {
            router.push('/hub');
        } else {
            const url = leadId ? `/hub/profile/qualify?id=${leadId}` : '/hub/profile/qualify';
            router.push(url);
        }
    };

    return (
        <section className="flex flex-col items-center justify-center gap-10 px-4 py-10">
            {/* Image Column */}
            <div className="relative shadow-2xl shadow-indigo-600/20 rounded-2xl shrink-0 max-w-md w-full">
                <HeroVideoDialog
                    className="block"
                    animationStyle="from-center"
                    videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                    thumbnailSrc="/hero-thumbnail.jpg"
                    thumbnailAlt="Team collaboration"
                />
            </div>

            {/* Text Column */}
            <div className="text-sm text-slate-600 max-w-2xl flex flex-col items-center text-center">
                <h1 className="text-xl uppercase font-semibold text-slate-700">How to Start?</h1>
                <div className="w-24 h-[3px] rounded-full bg-gradient-to-r from-indigo-600 to-[#DDD9FF] mt-2 mb-6"></div>

                <p className="mt-4 leading-relaxed">
                    Tech Alley Henderson helps you build connections faster by transforming your networking
                    experience into fully functional, production-ready relationships.
                </p>
                <p className="mt-4 leading-relaxed">
                    Whether you're launching a startup, looking for a job, or expanding your knowledge,
                    our community events are crafted to boost your career speed and improve your local reach.
                </p>
                <p className="mt-4 leading-relaxed">
                    From "Run of Show" updates to real-time engagement, this Hub helps you
                    connect beautifully and scale your network effortlessly.
                </p>

                <button
                    onClick={handleProfileClick}
                    className={`flex items-center gap-2 mt-8 hover:-translate-y-0.5 transition-all py-3 px-8 rounded-full text-white font-medium group ${isProfileComplete ? 'bg-green-500 hover:bg-green-600' : 'bg-gradient-to-r from-indigo-600 to-[#8A7DFF] hover:shadow-lg hover:shadow-indigo-500/30'}`}
                >
                    {isProfileComplete ? (
                        <>
                            <span>View Profile</span>
                            <CheckSquare size={16} className="group-hover:scale-110 transition-transform" />
                        </>
                    ) : (
                        <>
                            <span>Complete Your Profile</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </section>
    );
}
