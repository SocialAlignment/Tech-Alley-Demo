"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface NavLink {
    label: string;
    href?: string;
    onClick?: () => void;
}

interface HubLandingNavbarProps {
    links?: NavLink[];
    cta?: {
        label: string;
        onClick: () => void;
    };
}

export function HubLandingNavbar({ links = [], cta }: HubLandingNavbarProps) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-8">
                    {links.map((link, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                if (link.onClick) link.onClick();
                                if (link.href) window.location.href = link.href;
                            }}
                            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                        >
                            {link.label}
                        </button>
                    ))}

                    {cta && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                            onClick={cta.onClick}
                        >
                            {cta.label}
                        </Button>
                    )}
                </div>

                {/* Mobile */}
                <div className="md:hidden">
                    {cta && (
                        <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-white"
                            onClick={cta.onClick}
                        >
                            {cta.label}
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
