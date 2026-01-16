"use client";

import { useSearchParams } from 'next/navigation';
import EnrichmentForm from '@/components/ui/enrichment-form';
import { TubesBackground } from '@/components/ui/neon-flow';
import { Suspense } from 'react';

function OnboardingContent() {
    const searchParams = useSearchParams();
    const leadId = searchParams.get('id');

    if (!leadId) {
        return (
            <div className="text-white text-center p-8 bg-slate-900/80 rounded-xl backdrop-blur">
                <h1 className="text-2xl font-bold mb-4">Initial Setup Required</h1>
                <p>Please return to the login page to restart the process.</p>
                <a href="/login" className="inline-block mt-4 text-blue-400 hover:text-blue-300">Back to Login</a>
            </div>
        );
    }

    return <EnrichmentForm leadId={leadId} />;
}

export default function OnboardingPage() {
    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-slate-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 z-0">
                <TubesBackground className="bg-black" />
            </div>
            <div className="relative z-10 w-full max-w-md">
                <Suspense fallback={<div className="text-white">Loading...</div>}>
                    <OnboardingContent />
                </Suspense>
            </div>
        </main>
    );
}
