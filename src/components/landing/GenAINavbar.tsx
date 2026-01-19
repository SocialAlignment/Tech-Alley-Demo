"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export function GenAINavbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
                scrolled
                    ? "bg-slate-950/80 backdrop-blur-md border-white/10 py-3"
                    : "bg-transparent border-transparent py-5"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="relative h-10 w-32 md:h-12 md:w-40 hover:opacity-90 transition-opacity">
                    <Image
                        src="/logos/new/logo-1.png"
                        alt="Social Alignment"
                        fill
                        className="object-contain object-left"
                        priority
                    />
                </Link>

                {/* Links */}
                <div className="hidden md:flex items-center space-x-8">
                    <button
                        onClick={() => scrollToSection('portfolio')}
                        className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    >
                        Work
                    </button>
                    <button
                        onClick={() => scrollToSection('cta')}
                        className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    >
                        Raffle
                    </button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                        onClick={() => window.open('https://cal.com/jonathans-alignment/30min', '_blank')}
                    >
                        Book Call
                    </Button>
                </div>

                {/* Mobile: Just the main CTA or simple menu? User requested sticky nav. Keeping it simple for mobile for now. */}
                <div className="md:hidden">
                    <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-500 text-white"
                        onClick={() => window.open('https://cal.com/jonathans-alignment/30min', '_blank')}
                    >
                        Book Call
                    </Button>
                </div>
            </div>
        </nav>
    );
}
