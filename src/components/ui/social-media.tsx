import React from 'react';
import { cn } from "@/lib/utils";

// Define the type for a single social media item
export interface SocialItem {
    href: string;
    ariaLabel: string;
    tooltip: string;
    icon: React.ElementType; // Changed from svgUrl to icon component
    color: string; // Color for customization
}

// Define the props for the SocialTooltip component
export interface SocialTooltipProps extends React.HTMLAttributes<HTMLUListElement> {
    items: SocialItem[];
}

const SocialTooltip = React.forwardRef<HTMLUListElement, SocialTooltipProps>(
    ({ className, items, ...props }, ref) => {
        // Base styles for the component
        const baseIconStyles =
            "relative flex items-center justify-center w-12 h-12 rounded-full bg-background overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-lg border border-slate-200";
        const baseSvgStyles =
            "relative z-10 w-6 h-6 text-slate-600 transition-colors duration-300 ease-in-out group-hover:text-white";
        const baseFilledStyles =
            "absolute bottom-0 left-0 w-full h-0 transition-all duration-300 ease-in-out group-hover:h-full";
        const baseTooltipStyles =
            "absolute bottom-[-40px] left-1/2 -translate-x-1/2 px-2.5 py-1.5 text-xs font-semibold text-white whitespace-nowrap rounded-md opacity-0 invisible transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:visible group-hover:bottom-[-50px] z-50";

        return (
            <ul
                ref={ref}
                className={cn("flex items-center gap-4", className)}
                {...props}
            >
                {items.map((item, index) => (
                    <li key={index} className="relative group">
                        <a
                            href={item.href}
                            aria-label={item.ariaLabel}
                            className={cn(baseIconStyles)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div
                                className={cn(baseFilledStyles)}
                                style={{ backgroundColor: item.color }}
                            />
                            <item.icon className={cn(baseSvgStyles)} />
                        </a>
                        <div
                            className={cn(baseTooltipStyles)}
                            style={{ backgroundColor: item.color }}
                        >
                            {item.tooltip}
                        </div>
                    </li>
                ))}
            </ul>
        );
    }
);

SocialTooltip.displayName = "SocialTooltip";

export { SocialTooltip };
