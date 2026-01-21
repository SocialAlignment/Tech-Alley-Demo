import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                glass: {
                    bg: "rgba(30, 41, 59, 0.7)",
                    border: "rgba(255, 255, 255, 0.1)",
                },
                primary: {
                    DEFAULT: "#8B5CF6", // Violet 500
                    foreground: "#FFFFFF",
                },
                secondary: {
                    DEFAULT: "#D946EF", // Fuchsia 500
                    foreground: "#FFFFFF",
                },
                slate: {
                    850: "#1e293b", // Custom deep slate
                    900: "#0F172A",
                    950: "#020617",
                },
                // New Brand Colors
                midnight: "#0a0e1a",
                "neon-cyan": "#00D4D4",
                "neon-purple": "#9D4EDD",
                "neon-green": "#00F5A0",
                "gold-dark": "#b8860b",
                "gold-light": "#ffd700",
            },
            fontFamily: {
                outfit: ["var(--font-outfit)", "sans-serif"],
            },
            backdropBlur: {
                xs: "2px",
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-out",
                "slide-up": "slideUp 0.5s ease-out",
                "shine": "shine 3s infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                shine: {
                    "0%": { transform: "translateX(-150%) skewX(-12deg)" },
                    "100%": { transform: "translateX(150%) skewX(-12deg)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
