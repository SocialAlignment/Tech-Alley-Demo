# Preferred Tech Stack & Implementation Rules

When generating code or UI components for this brand, you **MUST** strictly adhere to the following technology choices.

## Core Stack
* **Framework:** Next.js 14+ (App Router)
* **Language:** TypeScript
* **Styling Engine:** Tailwind CSS
* **Animation:** Framer Motion (Standard for all entrances/interactions)
* **Icons:** Lucide React
* **Components:** shadcn/ui

## Implementation Guidelines

### 1. Visual Style (Cyber/Glass)
* **Dark Mode Default:** The app is primarily dark mode (`bg-slate-900` or `bg-slate-950`).
* **Glassmorphism:** Use `bg-glass-bg` (slate-800/70) with `backdrop-blur-md` and `border-glass-border` for panels.
* **Gradients:** Use Violet-to-Fuchsia gradients for primary actions or text highlights (`from-primary to-secondary`).

### 2. Tailwind Usage
* Use the extended color palette: `bg-primary`, `bg-secondary`, `bg-slate-850`.
* Font is always `font-outfit`.
* Use `framer-motion` for page transitions (`initial={{ opacity: 0 }} animate={{ opacity: 1 }}`).

### 3. Component Patterns
* **Cards:** Use the "Glass Panel" style by default for content containers.
* **Buttons:** Primary buttons often use gradients or the solid Violet (`bg-primary`).
* **Layout:** Mobile-first responsive design is critical.

### 4. Forbidden Patterns
* Do NOT use light mode defaults (white backgrounds) unless creating a specific high-contrast print view.
* Do NOT introduce new font imports; rely on `var(--font-outfit)`.
