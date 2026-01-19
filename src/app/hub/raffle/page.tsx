"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useIdentity } from '@/context/IdentityContext';
import GenAIRaffleWizard from '@/components/ui/gen-ai-raffle-wizard';
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

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
        <div className="min-h-screen w-full bg-slate-950 relative overflow-hidden text-white p-4 flex flex-col items-center justify-start py-12">
            <div className="fixed inset-0 z-0 bg-transparent pointer-events-none">
                <ShootingStars />
                <StarsBackground />
            </div>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={FADE_UP}
                className="w-full max-w-2xl flex flex-col items-center z-10"
            >
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
