'use client';

import React from "react";
import StartNavbar from "@/components/start/StartNavbar";
import StartHero from "@/components/start/StartHero";
import StartGrid from "@/components/start/StartGrid";



export default function StartHerePage() {
    return (
        <div className="w-full min-h-screen bg-[#020617] text-slate-200">
            <StartNavbar />
            <StartHero />
            <StartGrid />



            {/* Footer Padding */}
            <div className="h-32"></div>

        </div>
    );
}
