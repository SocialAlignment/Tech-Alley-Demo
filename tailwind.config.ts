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
                }
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
            },
        },
    },
    plugins: [],
};
export default config;
