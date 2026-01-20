"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import UnifiedProfileWizard from '@/components/ui/unified-profile-wizard';
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { Suspense, useState, useEffect } from 'react';

import { supabase } from '@/lib/supabase';

function OnboardingContent() {
    const searchParams = useSearchParams();
    const leadId = searchParams.get('id');
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialData, setInitialData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!leadId) {
            setIsLoading(false);
            return;
        }

        const fetchLead = async () => {
            try {
                const { data, error } = await supabase
                    .from('leads')
                    .select('*')
                    .eq('id', leadId)
                    .single();

                if (data) {
                    setInitialData({
                        name: data.name || '',
                        email: data.email || '',
                        preferredName: data.preferred_name || '',
                        phone: data.phone || '',
                        timezone: data.timezone || '',
                        company: data.company || '',
                        role: data.role || '',
                        website: data.website || '',
                        industry: data.industry || '',
                        instagram: data.instagram || '',
                        linkedin: data.linkedin || '',
                        twitter: data.twitter || '',
                        goalForTonight: data.goal_for_tonight || '',
                    });
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLead();
    }, [leadId]);

    if (!leadId && !isLoading) {
        return (
            <div className="text-white text-center p-8 bg-slate-900/80 rounded-xl backdrop-blur">
                <h1 className="text-2xl font-bold mb-4">Initial Setup Required</h1>
                <p>Please return to the login page to restart the process.</p>
                <a href="/login" className="inline-block mt-4 text-blue-400 hover:text-blue-300">Back to Login</a>
            </div>
        );
    }

    if (isLoading) {
        return <div className="text-white text-center p-20 animate-pulse">Loading profile...</div>;
    }

    const handleSubmit = async (formData: any) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/contact/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId, ...formData })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Submission Error Details:", errorData);
                const detailedError = errorData.error + (errorData.details ? `\nDetails: ${errorData.details}` : '') + (errorData.hint ? `\nHint: ${errorData.hint}` : '');
                throw new Error(detailedError || 'Failed to update profile');
            }

            router.push(`/hub/start?id=${leadId}&onboarding=complete`);
        } catch (e: any) {
            console.error(e);
            alert(e.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-2xl">
            <UnifiedProfileWizard
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                initialData={initialData || {}}
                mode="onboarding"
            />
        </div>
    );
}

export default function OnboardingPage() {
    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-slate-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 z-0">
                <ShootingStars />
                <StarsBackground />
            </div>
            <div className="relative z-10 w-full flex justify-center max-w-2xl">
                <Suspense fallback={<div className="text-white">Loading...</div>}>
                    <OnboardingContent />
                </Suspense>
            </div>
        </main>
    );
}
