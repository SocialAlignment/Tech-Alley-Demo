"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useIdentity } from '@/context/IdentityContext';
import GenAIRaffleWizard from '@/components/ui/gen-ai-raffle-wizard';

const FADE_UP = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function GenAIRafflePage() {
    const router = useRouter();
    const { leadId } = useIdentity();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialData, setInitialData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const handleSubmit = async (formData: any) => {
        setIsSubmitting(true);
        try {
            console.log("Submitting Raffle Data:", { leadId, ...formData });

            const response = await fetch('/api/contact/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId,
                    ...formData
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || 'Failed to save entry');
            }

            // Success!!
            alert("Entry Received! Good luck!");
            router.push(`/hub?id=${leadId}&raffle=entered`);
        } catch (e: any) {
            console.error(e);
            alert(`Error: ${e.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fetch existing data when leadId is available
    useEffect(() => {
        let isMounted = true;
        const timer = setTimeout(() => {
            if (isMounted && loading) setLoading(false);
        }, 3000);

        if (!leadId) return;

        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/identify', {
                    method: 'POST',
                    body: JSON.stringify({ leadId })
                });
                const data = await res.json();
                if (isMounted) {
                    if (data.success && data.data.raffleData) {
                        setInitialData(data.data.raffleData);
                    }
                }
            } catch (e) {
                console.error("Failed to load Raffle data", e);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchProfile();

        return () => { isMounted = false; clearTimeout(timer); };
    }, [leadId]);

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-[#020817] flex flex-col items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#020817] text-white p-4 flex flex-col items-center justify-start py-12 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(168,85,247,0.15),rgba(255,255,255,0))]">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={FADE_UP}
                className="w-full max-w-5xl flex flex-col items-center space-y-8"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        Win a Free GenAI Audit
                    </h1>
                    <p className="text-gray-400 max-w-lg mx-auto">
                        Tell us about your experience and expectations to enter the raffle.
                    </p>
                </div>

                <GenAIRaffleWizard
                    key={initialData ? 'loaded' : 'new'}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    initialValues={initialData}
                />

            </motion.div>
        </div>
    );
}
