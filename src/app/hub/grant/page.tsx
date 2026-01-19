"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIdentity } from '@/context/IdentityContext';
import GrantApplicationWizard from '@/components/ui/grant-application-wizard';
import { HubLandingNavbar } from '@/components/landing/HubLandingNavbar';
import { GrantHero } from '@/components/landing/GrantHero';
import { GrantInfo } from '@/components/landing/GrantInfo';
import { Loader2 } from 'lucide-react';

export default function GrantApplicationPage() {
    const router = useRouter();
    const { leadId } = useIdentity();
    const [isLoading, setIsLoading] = useState(true);
    const [initialData, setInitialData] = useState<any>({});

    useEffect(() => {
        const checkIdentity = async () => {
            let currentLeadId = leadId;
            if (!currentLeadId && typeof window !== 'undefined') {
                currentLeadId = localStorage.getItem('techalley_lead_id');
            }

            if (currentLeadId) {
                try {
                    const res = await fetch('/api/identify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ leadId: currentLeadId })
                    });

                    if (res.ok) {
                        const responseHelper = await res.json();
                        const data = responseHelper.data;
                        if (data?.contactDetails?.website) {
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
                body: JSON.stringify({ leadId, ...data })
            });

            if (!res.ok) throw new Error("Submission failed");
            router.push('/hub');
        } catch (error) {
            console.error(error);
            alert("Failed to submit application. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-slate-950 font-sans selection:bg-violet-500/30">
            <HubLandingNavbar
                links={[
                    { label: "Benefits", onClick: () => document.getElementById('grant-info')?.scrollIntoView({ behavior: 'smooth' }) },
                    { label: "Criteria", onClick: () => document.getElementById('grant-info')?.scrollIntoView({ behavior: 'smooth' }) } // Simplified to same section
                ]}
                cta={{ label: "Apply Now", onClick: () => document.getElementById('grant-application-form')?.scrollIntoView({ behavior: 'smooth' }) }}
            />

            <GrantHero />

            <div id="grant-info">
                <GrantInfo />
            </div>

            <div id="grant-application-form" className="py-24 bg-slate-900/50 relative">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Application Form</h2>
                        <p className="text-slate-400">Complete the wizard below to submit your application.</p>
                    </div>

                    <div className="bg-slate-950 border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl">
                        <GrantApplicationWizard
                            onSubmit={handleSubmit}
                            isSubmitting={false}
                            initialValues={initialData}
                        />
                    </div>
                </div>
            </div>

            {/* Simple Footer */}
            <footer className="py-8 bg-slate-950 border-t border-white/5 text-center text-slate-600 text-sm">
                <p>© {new Date().getFullYear()} Social Alignment. All rights reserved.</p>
            </footer>
        </div>
    );
}
