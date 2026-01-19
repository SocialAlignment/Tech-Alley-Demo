"use client";

import { PremiumContactCards } from "@/components/ui/premium-contact-cards";

export default function NetworkingPage() {
    return (
        <div className="w-full min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
            {/* Background elements to match the VIP theme */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black -z-10" />

            <div className="relative z-10 w-full flex-1 flex flex-col">
                <PremiumContactCards />
            </div>
        </div>
    );
}
