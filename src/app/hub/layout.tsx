'use client';

import Sidebar from "@/components/Sidebar";
import { useIdentity } from "@/context/IdentityContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function HubLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { leadId, isLoading } = useIdentity();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const hasUrlId = searchParams.get('id');
        // Critical Fix: Never redirect if we have an ID in the URL, even if context is lagging
        if (!isLoading && !leadId && !hasUrlId) {
            console.warn("HubLayout: No ID found in Context or URL. Redirecting to home.");
            router.push('/');
        }
    }, [isLoading, leadId, router, searchParams]);

    // Non-blocking approach: Always render the Shell.
    // Show skeleton in main content if loading.

    return (
        <div className="flex bg-[#F3F4F6] min-h-screen">
            {/* 1. Sidebar Column (Fixed width on Desktop) */}
            <div className="hidden md:block w-[18%] min-w-[250px] p-6 pr-0">
                <Sidebar />
            </div>

            {/* Mobile Sidebar */}
            <div className="md:hidden">
                <Sidebar />
            </div>

            {/* 2. Main Content + 3. Right Widgets */}
            <main className="flex-1 p-6 md:p-8 flex gap-8 overflow-hidden h-screen">
                {/* Center Content Scrollable Area */}
                <div id="hub-scroll-container" className="flex-1 overflow-y-auto rounded-[32px] no-scrollbar relative">
                    {/* Only show blocking loader if we have NO ID at all */}
                    {isLoading && !leadId && !searchParams.get('id') ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50 rounded-[32px]">
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 className="animate-spin text-purple-600 w-12 h-12" />
                                <p className="text-sm font-medium text-slate-500 animate-pulse">Loading Hub...</p>
                                <button
                                    onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                                    className="mt-4 text-xs text-red-400 hover:text-red-500 underline"
                                >
                                    Stuck? Click here to Reset
                                </button>
                            </div>
                        </div>
                    ) : null}

                    {/* If we have an ID (even if loading), show the children. They handle their own empty states. */}

                    {/* Only show children if we have a leadId, otherwise show nothing (waiting for redirect) */}
                    {leadId ? children : null}
                </div>
            </main>
        </div>
    );
}
