import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    // Add custom breakpoints
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        serif: ['Manrope', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        locked: {
          DEFAULT: "hsl(var(--locked))",
          foreground: "hsl(var(--locked-foreground))",
        },
        hex: {
          complete: "hsl(var(--hex-complete))",
          active: "hsl(var(--hex-active))",
          locked: "hsl(var(--hex-locked))",
          border: "hsl(var(--hex-border))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Level-specific colors for consistent theming
        level: {
          beginner: "hsl(var(--success))",
          intermediate: "hsl(var(--primary))",
          advanced: "hsl(270, 70%, 55%)",
        },
        // Stats colors for dashboard
        stats: {
          lessons: "hsl(var(--success))",
          streak: "hsl(var(--warning))",
          milestone: "hsl(var(--primary))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px -5px hsla(217, 91%, 60%, 0.3)" },
          "50%": { boxShadow: "0 0 30px -5px hsla(217, 91%, 60%, 0.5)" },
        },
        "hex-hover": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        confetti: {
          "0%": { transform: "translateY(0) rotateZ(0)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotateZ(720deg)", opacity: "0" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.5" },
          "100%": { transform: "scale(1)", opacity: "0" },
        },
        "checkbox-flash": {
          "0%, 100%": { backgroundColor: "transparent" },
          "50%": { backgroundColor: "hsl(var(--success) / 0.3)" },
        },
        "checkbox-check": {
          "0%": { transform: "translate(-50%, -50%) scale(0)" },
          "50%": { transform: "translate(-50%, -50%) scale(1.2)" },
          "100%": { transform: "translate(-50%, -50%) scale(1)" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "milestone-glow": {
          "0%, 100%": { boxShadow: "0 0 5px hsl(var(--success))" },
          "50%": { boxShadow: "0 0 20px hsl(var(--success))" },
        },
        "streak-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
        },
        "unlock-glow": {
          "0%": { boxShadow: "0 0 0 0 hsl(var(--success) / 0.7)" },
          "70%": { boxShadow: "0 0 0 15px hsl(var(--success) / 0)" },
          "100%": { boxShadow: "0 0 0 0 hsl(var(--success) / 0)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "hex-hover": "hex-hover 0.3s ease-in-out",
        "slide-up": "slide-up 0.4s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-out forwards",
        "scale-in": "scale-in 0.2s ease-out forwards",
        confetti: "confetti 3s ease-out forwards",
        ripple: "ripple 0.6s ease-out forwards",
        "checkbox-flash": "checkbox-flash 0.2s ease-out",
        "checkbox-check": "checkbox-check 0.3s ease-out forwards",
        "bounce-in": "bounce-in 0.5s ease-out forwards",
        "milestone-glow": "milestone-glow 1s ease-in-out",
        "streak-pulse": "streak-pulse 0.5s ease-in-out",
        "unlock-glow": "unlock-glow 1s ease-out",
        "spin-slow": "spin-slow 3s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
