"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useIdentity } from '@/context/IdentityContext';
import ContactWizard from '@/components/ui/contact-wizard';

const FADE_UP = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function QualificationPage() {
    const router = useRouter();
    const { leadId } = useIdentity();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (formData: any) => {
        setIsSubmitting(true);
        try {
            console.log("Submitting Contact Data:", { leadId, ...formData });

            const response = await fetch('/api/contact/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId, ...formData })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || 'Failed to save contact details');
            }

            // Success!!
            alert("Social Profile Updated! You are ready to network.");
            // Force hard reload to ensure fresh dashboard state
            window.location.href = `/hub?id=${leadId}`;
        } catch (e: any) {
            console.error(e);
            alert(`Error: ${e.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const [initialData, setInitialData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Fetch existing data when leadId is available
    useEffect(() => {
        let isMounted = true;

        // Failsafe: if data takes too long, just let the user edit a blank form
        const timer = setTimeout(() => {
            if (isMounted && loading) {
                console.warn("QualificationPage: Fetch timed out. allowing edit.");
                setLoading(false);
            }
        }, 5000);

        if (!leadId) return;

        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/identify', {
                    method: 'POST',
                    body: JSON.stringify({ leadId })
                });
                const data = await res.json();
                if (isMounted) {
                    if (data.success && data.data.contactDetails) {
                        console.log("Frontend: Received Contact Details:", data.data.contactDetails);
                        setInitialData(data.data.contactDetails);
                    } else {
                        console.log("Frontend: No contact details found in response", data);
                    }
                }
            } catch (e) {
                console.error("Failed to load profile", e);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchProfile();

        return () => { isMounted = false; clearTimeout(timer); };
    }, [leadId]);

    // Better Loading UI
    if (loading) {
        return (
            <div className="min-h-screen w-full bg-[#020817] flex flex-col items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="text-blue-400 font-medium animate-pulse">Loading Profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#020817] text-white p-4 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.15),rgba(255,255,255,0))]">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={FADE_UP}
                className="w-full max-w-4xl flex flex-col items-center space-y-8"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                        {initialData ? "Update Your Profile" : "Let's Level Up your Network"}
                    </h1>
                    <p className="text-gray-400 max-w-lg mx-auto">
                        {initialData ? "Make changes to your social profile below." : "Complete your Tech Alley Henderson Social Profile so its easier to make magic with other attendees tonight."}
                    </p>
                </div>

                <ContactWizard
                    key={initialData ? 'loaded' : 'loading'}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    initialData={initialData}
                />

            </motion.div>
        </div>
    );
}
