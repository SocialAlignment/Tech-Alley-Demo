'use client';

import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'glass' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export default function Button({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = "relative inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";

    const variants = {
        primary: "bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] border border-white/10",
        secondary: "bg-secondary text-white hover:bg-secondary/90 shadow-[0_0_20px_rgba(236,72,153,0.4)]",
        glass: "bg-white/10 text-white hover:bg-white/20 border border-white/10 backdrop-blur-sm",
        ghost: "hover:bg-white/5 text-slate-300 hover:text-white",
        danger: "bg-red-500/80 text-white hover:bg-red-500 border border-red-500/50"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            className={clsx(
                baseStyles,
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : children}

            {/* Gloss Effect (Optional, for glass/primary) */}
            {(variant === 'primary' || variant === 'glass') && (
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
            )}
        </motion.button>
    );
}
