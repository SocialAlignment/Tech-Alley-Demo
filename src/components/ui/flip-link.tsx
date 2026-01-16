"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface FlipLinkProps {
    children: string;
    href: string;
    className?: string;
}

const DURATION = 0.25;
const STAGGER = 0.025;

export const FlipText = ({ children, className }: { children: string; className?: string }) => {
    return (
        <motion.div
            initial="initial"
            whileHover="hovered"
            className={cn("relative block overflow-hidden whitespace-nowrap", className)}
        >
            <div className="relative">
                {children.split("").map((l, i) => (
                    <motion.span
                        variants={{
                            initial: {
                                y: 0,
                            },
                            hovered: {
                                y: "-100%",
                            },
                        }}
                        transition={{
                            duration: DURATION,
                            ease: "easeInOut",
                            delay: STAGGER * i,
                        }}
                        className="inline-block"
                        key={i}
                    >
                        {l === " " ? "\u00A0" : l}
                    </motion.span>
                ))}
            </div>
            <div className="absolute inset-0">
                {children.split("").map((l, i) => (
                    <motion.span
                        variants={{
                            initial: {
                                y: "100%",
                            },
                            hovered: {
                                y: 0,
                            },
                        }}
                        transition={{
                            duration: DURATION,
                            ease: "easeInOut",
                            delay: STAGGER * i,
                        }}
                        className="inline-block"
                        key={i}
                    >
                        {l === " " ? "\u00A0" : l}
                    </motion.span>
                ))}
            </div>
        </motion.div>
    );
};

export const FlipLink = ({ children, href, className }: FlipLinkProps) => {
    return (
        <Link
            href={href}
            className={cn(
                "relative block overflow-hidden whitespace-nowrap text-4xl font-black uppercase sm:text-7xl md:text-8xl lg:text-9xl",
                className
            )}
            style={{
                lineHeight: 0.75,
            }}
        >
            <FlipText className={className}>{children}</FlipText>
        </Link>
    );
};
