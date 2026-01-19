'use client';

import { motion } from 'framer-motion';

interface HeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    className?: string; // For overriding H1 styles
}

export default function Header({ title, description, children, className }: HeaderProps) {
    // If a className is provided, we assume we want a transparent/custom header.
    // Otherwise we use the default white sticky header.
    const isCustom = !!className;

    return (
        <div className={isCustom ? "relative z-30" : "bg-white border-b border-slate-200 sticky top-0 z-30 bg-opacity-80 backdrop-blur-md"}>
            <div className={`max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${isCustom ? "" : ""}`}>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className={className || "text-3xl font-bold text-slate-900 tracking-tight"}>{title}</h1>
                    {description && <p className="text-slate-500 font-medium mt-1">{description}</p>}
                </motion.div>

                {children && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {children}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
