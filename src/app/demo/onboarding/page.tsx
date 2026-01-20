'use client';

import { useEffect, useState } from 'react';
import DemoProfileWizard from '@/components/ui/demo-profile-wizard';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DemoOnboardingPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');
    const [isLoading, setIsLoading] = useState(true);
    const [initialData, setInitialData] = useState<any>(null);
    const [connectedName, setConnectedName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!id) {
            router.push('/demo/login');
            return;
        }

        // Fetch basic info if we can, or just use what we know/empty. 
        // Ideally we fetch the name/email we just synced.
        // We can create a simple route /api/demo/entry?id=... or just assume empty.
        // For better UX, let's try to pass name via query or fetch it.
        // Fetching is cleaner. I'll just simulate a quick load or rely on defaults for now 
        // to avoid creating another route unless needed. 
        // Actually, UnifiedProfileWizard expects email/name to be locked if populated.
        // So I SHOULD fetch.

        // Let's do a quick fetch to our new generic data endpoint if we had one, 
        // OR we can misuse the register endpoint or create a GET on /api/demo/register.

        // I'll create a simple GET on /api/demo/register/[id] or just use client data if passed? 
        // No, fetch from server is secure.

        // I'll just use the /api/demo/sync logic idea but GET? No sync is POST.
        // Let's add GET to /api/demo/register/route.ts? No that's generic.
        // I'll add GET to /api/demo/sync? No.

        // I'll just use a direct supbase select via a new route /api/demo/entry
        // Or honestly, for this specific task, I'll fetch it from a new lightweight route: /api/demo/get-entry

        const fetchEntry = async () => {
            try {
                const res = await fetch(`/api/demo/get-entry?id=${id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.entry) {
                        setInitialData({
                            name: data.entry.name,
                            email: data.entry.email,
                            socialHandle: data.entry.social_handle,
                            isFirstTime: data.entry.is_first_time ? 'yes' : (data.entry.is_first_time === false ? 'no' : '')
                        });
                        setConnectedName(data.entry.name);
                    }
                }
            } catch (e) {
                console.error("Fetch error", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntry();

    }, [id, router]);

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            // Use the new update endpoint specifically for demo flow details
            const res = await fetch('/api/demo/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id, // Update existing entry
                    ...data,
                    socialHandle: data.instagram || data.linkedin // Map to socialHandle for top-level column
                })
            });

            if (res.ok) {
                router.push('/demo/success');
            } else {
                const errorData = await res.json();
                console.error("Submission failed", errorData);
                alert("Something went wrong. Please try again.");
            }
        } catch (e) {
            console.error(e);
            alert("Error submitting form.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 p-4 md:p-8">
            <div className="max-w-4xl mx-auto mb-8 text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Complete Registration
                </h1>
                <p className="text-slate-400">Tell us a bit about yourself to enter the raffle.</p>
            </div>

            <DemoProfileWizard
                initialData={initialData}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                connectedName={connectedName}
                connectedId={id!}
            />
        </main>
    );
}
