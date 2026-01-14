'use client';

import Sidebar from "@/components/Sidebar";
import { useIdentity } from "@/context/IdentityContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function HubLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { leadId, isLoading } = useIdentity();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !leadId) {
            router.push('/');
        }
    }, [isLoading, leadId, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-purple-600 w-8 h-8" />
            </div>
        );
    }

    // Don't render content if no leadId (prevent flash before redirect)
    if (!leadId) return null;

    return (
        <div className="flex bg-[#F3F4F6] min-h-screen">
            {/* 1. Sidebar Column (Fixed width on Desktop) */}
            <div className="hidden md:block w-[18%] min-w-[250px] p-6 pr-0">
                <Sidebar />
            </div>

            {/* Mobile Sidebar (Absolute/Fixed) handled inside Sidebar component mostly, but we need the button visible */}
            <div className="md:hidden">
                <Sidebar />
            </div>

            {/* 2. Main Content + 3. Right Widgets */}
            <main className="flex-1 p-6 md:p-8 flex gap-8 overflow-hidden h-screen">
                {/* Center Content Scrollable Area */}
                <div className="flex-1 overflow-y-auto rounded-[32px] no-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    );
}
