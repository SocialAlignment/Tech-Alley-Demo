"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIdentity } from '@/context/IdentityContext';
import AIMRIWizard from '@/components/ui/ai-mri-wizard';
import { HubLandingNavbar } from '@/components/landing/HubLandingNavbar';
import { MRIHero } from '@/components/landing/MRIHero';
import { MRIInfo } from '@/components/landing/MRIInfo';
import { Loader2 } from 'lucide-react';

export default function AIMRIPage() {
    const router = useRouter();
    const { leadId } = useIdentity();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialData, setInitialData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const handleSubmit = async (formData: any) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/contact/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId,
                    aiMriResponse: formData
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || 'Failed to save audit');
            }

            alert("Audit Saved! Generating Report...");
            router.push(`/hub?id=${leadId}&audit=complete`);
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
                    if (data.success && data.data.contactDetails?.aiMriResponse) {
                        setInitialData(data.data.contactDetails.aiMriResponse);
                    }
                }
            } catch (e) {
                console.error("Failed to load MRI data", e);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchProfile();

        return () => { isMounted = false; clearTimeout(timer); };
    }, [leadId]);

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-[#020817] flex justify-center items-center">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#020817] text-white overflow-hidden font-sans selection:bg-cyan-500/30">
            <HubLandingNavbar
                links={[
                    { label: "Features", onClick: () => document.getElementById('mri-benefits')?.scrollIntoView({ behavior: 'smooth' }) },
                    { label: "Report", onClick: () => document.getElementById('mri-benefits')?.scrollIntoView({ behavior: 'smooth' }) }
                ]}
                cta={{ label: "Start Audit", onClick: () => document.getElementById('ai-mri-wizard')?.scrollIntoView({ behavior: 'smooth' }) }}
            />

            <MRIHero />

            <div id="mri-benefits">
                <MRIInfo />
            </div>

            <div id="ai-mri-wizard" className="py-24 bg-slate-900/50 relative border-t border-white/5">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Start Your Audit</h2>
                        <p className="text-slate-400">Answer 6 quick questions to generate your report.</p>
                    </div>

                    <div className="bg-[#0b1221] border border-cyan-500/20 rounded-2xl p-6 md:p-10 shadow-[0_0_50px_-12px_rgba(6,182,212,0.15)]">
                        <AIMRIWizard
                            key={initialData ? 'loaded' : 'new'}
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                            initialValues={initialData}
                        />
                    </div>
                </div>
            </div>

            {/* Simple Footer */}
            <footer className="py-8 bg-[#020817] border-t border-white/5 text-center text-slate-600 text-sm">
                <p>© {new Date().getFullYear()} Social Alignment. All rights reserved.</p>
            </footer>
        </div>
    );
}
