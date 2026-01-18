"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIdentity } from '@/context/IdentityContext';
import GrantApplicationWizard from '@/components/ui/grant-application-wizard';
import { Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GrantApplicationPage() {
    const router = useRouter();
    const { leadId } = useIdentity();
    const [isLoading, setIsLoading] = useState(true);
    const [initialData, setInitialData] = useState<any>({});

    useEffect(() => {
        const checkIdentity = async () => {
            let currentLeadId = leadId;
            if (!currentLeadId) {
                if (typeof window !== 'undefined') {
                    // Context uses 'techalley_lead_id'
                    const stored = localStorage.getItem('techalley_lead_id');
                    if (stored) {
                        currentLeadId = stored;
                    }
                }
            }

            if (currentLeadId) {
                try {
                    // Fetch using POST as per IdentityContext pattern
                    const res = await fetch('/api/identify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ leadId: currentLeadId })
                    });

                    if (res.ok) {
                        const responseHelper = await res.json();
                        const data = responseHelper.data;
                        // Map contactDetails.website if available
                        if (data && data.contactDetails && data.contactDetails.website) {
                            setInitialData((prev: any) => ({ ...prev, websiteUrl: data.contactDetails.website }));
                        }
                    }
                } catch (e) {
                    console.error("Failed to hydrate:", e);
                }
            }
            setIsLoading(false);
        };

        checkIdentity();
    }, [leadId]);

    const handleSubmit = async (data: any) => {
        if (!leadId) {
            alert("No Lead ID found. Please go back to Onboarding.");
            return;
        }

        try {
            const res = await fetch('/api/grant/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId,
                    ...data
                })
            });

            if (!res.ok) throw new Error("Submission failed");

            // Redirect to Success or Hub
            router.push('/hub');
        } catch (error) {
            console.error(error);
            alert("Failed to submit application. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 p-4 font-sans selection:bg-cyan-500/30">
            <div className="max-w-4xl mx-auto pt-8 pb-20">
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.push('/hub')}
                    className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Hub
                </motion.button>

                <div className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-4 tracking-tight">
                        Apply for the Grant
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        We're selecting 5 businesses to receive $5,000 in AI Architecture services. Tell us why it should be you.
                    </p>
                </div>

                <GrantApplicationWizard
                    onSubmit={handleSubmit}
                    isSubmitting={false}
                    initialValues={initialData}
                />
            </div>
        </div>
    );
}
