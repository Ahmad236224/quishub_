import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        "background-alt": "var(--bg-alt)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        mute: "var(--mute)",
        "mute-2": "var(--mute-2)",
        line: "var(--line)",
        "line-2": "var(--line-2)",
        platinum: "var(--platinum)",
        signal: "var(--signal)",
        "signal-ink": "var(--signal-ink)",
        "brand-g1": "var(--g1)",
        "brand-g2": "var(--g2)",
        quishub: {
          black: "rgb(var(--quishub-black-rgb) / <alpha-value>)",
          blue: "#2563eb",
          purple: "#7c3aed",
          light: "rgb(var(--quishub-light-rgb) / <alpha-value>)",
          platinum: "rgb(var(--quishub-light-rgb) / <alpha-value>)",
          muted: "rgb(var(--quishub-muted-rgb) / <alpha-value>)",
          faint: "rgb(var(--quishub-faint-rgb) / <alpha-value>)",
          surface: "rgb(var(--quishub-surface-rgb) / <alpha-value>)",
          surfaceAlt: "rgb(var(--quishub-surface-alt-rgb) / <alpha-value>)",
          border: "rgb(var(--quishub-border-rgb) / <alpha-value>)",
          white: "#e5e5e4",
        },
      },
      fontFamily: {
        sans: ["var(--font-sora)", "system-ui", "sans-serif"],
        body: ["var(--font-sora)", "system-ui", "sans-serif"],
        ui: ["var(--font-ui-stack)"],
        display: ["var(--font-display-stack)"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        "display-2xl": ["clamp(2.75rem, 7.2vw, 6.5rem)", { lineHeight: "0.96", letterSpacing: "-0.035em" }],
        "display-xl": ["clamp(2.375rem, 5.4vw, 5.25rem)", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2rem, 3.9vw, 3.75rem)", { lineHeight: "1.04", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(1.5rem, 2.4vw, 2.25rem)", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
        lede: ["clamp(1.0625rem, 1.35vw, 1.25rem)", { lineHeight: "1.6" }],
      },
      transitionTimingFunction: {
        out: "cubic-bezier(.16,1,.3,1)",
      },
      letterSpacing: {
        heading: "-0.02em",
        hero: "-0.03em",
        label: "0.05em",
        "label-wide": "0.1em",
      },
      lineHeight: {
        body: "1.7",
        hero: "1.1",
      },
      maxWidth: {
        content: "1200px",
        site: "1320px",
      },
      borderRadius: {
        card: "12px",
        feature: "16px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "slow-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        drift1: {
          to: { transform: "translate(80px, 40px) scale(1.08)" },
        },
        drift2: {
          to: { transform: "translate(-60px, 50px) scale(1.1)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "slow-float": "slow-float 8s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        drift1: "drift1 22s ease-in-out infinite alternate",
        drift2: "drift2 26s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};

export default config;
