const fs = require("fs");

const css = `
/* =========================================================
   Quishub — refined Linear/Vercel-flavoured design system
   ========================================================= */
*, *::before, *::after { box-sizing: border-box; }

:root {
  --g1: #7c3aed;        /* electric violet */
  --g2: #2563eb;        /* cobalt blue */

  /* Light theme (default) */
  --bg: #ffffff;
  --bg-alt: #faf9fb;
  --surface: #ffffff;
  --surface-2: #f5f4f7;
  --ink: #160e20;
  --ink-2: #2c2139;
  --mute: #6b6477;
  --mute-2: #9b93a6;
  --line: #ece9f0;
  --line-2: #dfdae6;
  --platinum: #e5e5e4;

  --shadow-sm: 0 1px 2px rgba(22,14,32,.04), 0 1px 1px rgba(22,14,32,.03);
  --shadow-md: 0 2px 12px rgba(22,14,32,.08);
  --shadow-lg: 0 20px 60px -20px rgba(22,14,32,.25), 0 8px 24px -12px rgba(22,14,32,.12);
  --shadow-glow: 0 0 0 1px rgba(124,58,237,.15), 0 20px 60px -20px rgba(124,58,237,.35);

  --r-sm: 8px;
  --r-md: 12px;
  --r-lg: 18px;
  --r-xl: 24px;

  --ease: cubic-bezier(.4,0,.2,1);
  --ease-out: cubic-bezier(.16,1,.3,1);

  --container: 1240px;
  --section-y: 140px;
}

[data-theme="dark"] {
  --bg: #0b0712;
  --bg-alt: #0f0a18;
  --surface: #160e20;
  --surface-2: #1f1729;
  --ink: #f5f3f8;
  --ink-2: #e5e2ec;
  --mute: #b5acc2;
  --mute-2: #7c7488;
  --line: #261d32;
  --line-2: #32253f;
  --platinum: #2a2234;

  --shadow-sm: 0 1px 2px rgba(0,0,0,.4);
  --shadow-md: 0 2px 16px rgba(0,0,0,.4);
  --shadow-lg: 0 20px 60px -20px rgba(0,0,0,.6), 0 8px 24px -12px rgba(0,0,0,.4);
  --shadow-glow: 0 0 0 1px rgba(124,58,237,.35), 0 20px 60px -20px rgba(124,58,237,.5);
}

[data-accent="cool"]      { --g1:#06b6d4; --g2:#4f46e5; }
[data-accent="warm"]      { --g1:#ec4899; --g2:#7c3aed; }

[data-density="compact"] { --section-y: 96px; }

/* =========================================================
   Base
   ========================================================= */
.new-home-wrapper {
  font-family: var(--font-sora), system-ui, -apple-system, sans-serif;
  font-size: 16px;
  line-height: 1.55;
  color: var(--ink);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  overflow-x: hidden;
}

.new-home-wrapper a { color: inherit; text-decoration: none; }
.new-home-wrapper button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }

.new-home-wrapper .container {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 32px;
}
.new-home-wrapper .container--narrow { max-width: 860px; }

.new-home-wrapper .grad {
  background: linear-gradient(100deg, var(--g1), var(--g2));
  -webkit-background-clip: text; background-clip: text;
  color: transparent;
}

/* =========================================================
   Typography
   ========================================================= */
.new-home-wrapper .h2, 
.new-home-wrapper .hero__h1, 
.new-home-wrapper .cta__h {
  font-family: var(--font-texar), var(--font-tt-lakes), sans-serif;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.05;
  color: var(--ink);
}

.new-home-wrapper .hero__h1 {
  font-size: clamp(44px, 5.4vw, 84px);
  font-weight: 600;
  letter-spacing: -0.03em;
  margin: 16px 0 20px;
  text-wrap: balance;
}
.new-home-wrapper .h2 {
  font-size: clamp(32px, 3.6vw, 56px);
  margin: 10px 0 14px;
  text-wrap: balance;
}
.new-home-wrapper .cta__h {
  font-size: clamp(36px, 4.4vw, 68px);
  text-wrap: balance;
}

.new-home-wrapper .kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-sora), monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--mute);
}
.new-home-wrapper .kicker::before {
  content:""; width: 20px; height: 1px; background: currentColor; opacity:.5;
}

.new-home-wrapper .lede {
  color: var(--mute);
  font-size: 18px;
  max-width: 620px;
  text-wrap: pretty;
}

/* =========================================================
   Buttons
   ========================================================= */
.new-home-wrapper .btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 18px;
  border-radius: 10px;
  font-weight: 500;
  font-size: 14.5px;
  line-height: 1;
  transition: transform .18s var(--ease), box-shadow .2s var(--ease), background .2s var(--ease), color .2s var(--ease), border-color .2s var(--ease);
  white-space: nowrap;
}
.new-home-wrapper .btn__arrow { transition: transform .22s var(--ease); display:inline-block; }
.new-home-wrapper .btn:hover .btn__arrow { transform: translateX(3px); }
.new-home-wrapper .btn:active { transform: scale(.98); }

.new-home-wrapper .btn--primary {
  background: linear-gradient(100deg, var(--g1), var(--g2));
  color: #fff;
  box-shadow: 0 8px 24px -10px color-mix(in oklab, var(--g1) 60%, transparent);
  position: relative; overflow: hidden;
}
.new-home-wrapper .btn--primary::after {
  content:""; position:absolute; inset:0;
  background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,.35) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform .7s var(--ease);
}
.new-home-wrapper .btn--primary:hover::after { transform: translateX(100%); }
.new-home-wrapper .btn--primary:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 14px 34px -10px color-mix(in oklab, var(--g1) 70%, transparent);
}

.new-home-wrapper .btn--ghost {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--line-2);
}
.new-home-wrapper .btn--ghost:hover {
  background: var(--surface-2);
  border-color: var(--ink-2);
  transform: translateY(-1px);
}

.new-home-wrapper .btn--lg { padding: 15px 22px; font-size: 15px; border-radius: 12px; }
.new-home-wrapper .btn--sm { padding: 8px 12px; font-size: 13px; }

/* =========================================================
   NAV
   ========================================================= */
.new-home-wrapper .nav {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 40;
  display: flex; align-items: center; justify-content: space-between;
  gap: 24px;
  padding: 16px 32px;
  transition: background .25s var(--ease), backdrop-filter .25s var(--ease), border-color .25s var(--ease), padding .25s var(--ease);
  border-bottom: 1px solid transparent;
}
.new-home-wrapper .nav.is-scrolled {
  background: color-mix(in oklab, var(--bg) 80%, transparent);
  backdrop-filter: saturate(180%) blur(14px);
  -webkit-backdrop-filter: saturate(180%) blur(14px);
  border-bottom-color: var(--line);
  padding: 10px 32px;
}

.new-home-wrapper .nav__brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 600; letter-spacing: -0.01em; }
.new-home-wrapper .logo-mark { width: 28px; height: 28px; display: block; }
.new-home-wrapper .nav__word { font-family: var(--font-texar), sans-serif; font-size: 19px; letter-spacing: -.02em; }

.new-home-wrapper .nav__links { display: flex; gap: 26px; }
.new-home-wrapper .nav__links a {
  position: relative;
  font-size: 14px;
  color: var(--mute);
  padding: 6px 0;
  transition: color .2s var(--ease);
}
.new-home-wrapper .nav__links a::after {
  content:""; position:absolute; left:0; right:100%; bottom:0; height: 1.5px;
  background: linear-gradient(90deg, var(--g1), var(--g2));
  transition: right .35s var(--ease);
}
.new-home-wrapper .nav__links a:hover { color: var(--ink); }
.new-home-wrapper .nav__links a:hover::after { right: 0; }

.new-home-wrapper .nav__cta { display: flex; align-items: center; gap: 10px; }

.new-home-wrapper #themeToggle {
  width: 38px; height: 38px;
  padding: 0;
  border: 1px solid var(--line-2);
  border-radius: 10px;
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--ink);
  transition: background .2s var(--ease), border-color .2s var(--ease);
  cursor: pointer;
}
.new-home-wrapper #themeToggle:hover { background: var(--surface-2); }
.new-home-wrapper .icon { width: 17px; height: 17px; }
[data-theme="light"] .new-home-wrapper .icon--moon { display: none; }
[data-theme="dark"] .new-home-wrapper .icon--sun  { display: none; }

@media (max-width: 900px) {
  .new-home-wrapper .nav__links { display: none; }
}

/* =========================================================
   HERO
   ========================================================= */
.new-home-wrapper .hero {
  position: relative;
  padding: 160px 0 60px;
  overflow: hidden;
  isolation: isolate;
}

.new-home-wrapper .hero__mesh, 
.new-home-wrapper .cta__bg {
  position: absolute; inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}
.new-home-wrapper .blob {
  position: absolute;
  width: 720px; height: 720px;
  border-radius: 50%;
  filter: blur(120px);
  opacity: .38;
  will-change: transform;
}
[data-theme="dark"] .new-home-wrapper .blob { opacity: .32; }
.new-home-wrapper .blob--1 {
  top: -280px; left: -200px;
  background: radial-gradient(circle at 30% 30%, var(--g1), transparent 65%);
  animation: drift1 22s ease-in-out infinite alternate;
}
.new-home-wrapper .blob--2 {
  top: -180px; right: -260px;
  background: radial-gradient(circle at 70% 40%, var(--g2), transparent 65%);
  animation: drift2 26s ease-in-out infinite alternate;
}
@keyframes drift1 { to { transform: translate(80px, 40px) scale(1.08); } }
@keyframes drift2 { to { transform: translate(-60px, 50px) scale(1.1); } }

.new-home-wrapper .grid-overlay {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(to right, color-mix(in oklab, var(--ink) 6%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklab, var(--ink) 6%, transparent) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse at 50% 30%, black 30%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse at 50% 30%, black 30%, transparent 75%);
}

.new-home-wrapper .hero__inner { max-width: var(--container); margin: 0 auto; padding: 0 32px; }
.new-home-wrapper .hero__inner--split {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 64px;
  align-items: center;
}
.new-home-wrapper .hero__inner--centered { display: none; text-align: center; }

.new-home-wrapper [data-hero="B"] .hero__inner--split { display: none; }
.new-home-wrapper [data-hero="B"] .hero__inner--centered { display: block; max-width: 960px; }

.new-home-wrapper .eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 6px 12px;
  border: 1px solid var(--line-2);
  border-radius: 99px;
  font-size: 12.5px;
  color: var(--mute);
  background: color-mix(in oklab, var(--surface) 80%, transparent);
  backdrop-filter: blur(6px);
  font-family: var(--font-sora), monospace;
  letter-spacing: .02em;
}
.new-home-wrapper .eyebrow .dot--live {
  width: 7px; height: 7px; border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 3px color-mix(in oklab, #22c55e 25%, transparent);
  animation: pulse 1.8s ease-in-out infinite;
}
@keyframes pulse { 50% { transform: scale(.85); opacity:.7; } }

.new-home-wrapper .hero__sub {
  max-width: 540px;
  color: var(--mute);
  font-size: 19px;
  line-height: 1.55;
  text-wrap: pretty;
}
.new-home-wrapper .hero__sub--center { margin-left: auto; margin-right: auto; }
.new-home-wrapper .hero__ctas { display: flex; gap: 12px; margin-top: 28px; flex-wrap: wrap; }
.new-home-wrapper .hero__ctas--center { justify-content: center; }

.new-home-wrapper .hero__proof {
  display: flex; align-items: center; gap: 10px;
  margin-top: 28px;
  color: var(--mute);
  font-size: 14px;
}
.new-home-wrapper .hero__proof strong { color: var(--ink); font-weight: 600; }
.new-home-wrapper .stars { display: inline-flex; color: #f59e0b; gap: 1px; }
.new-home-wrapper .stars svg { width: 14px; height: 14px; }
.new-home-wrapper .sep { opacity: .5; }

/* Hero visual — terminal / eval panel */
.new-home-wrapper .hero__visual { position: relative; min-height: 460px; }

.new-home-wrapper .panel {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  position: relative;
}
.new-home-wrapper .panel::before {
  content:""; position: absolute; inset: 0; pointer-events: none;
  border-radius: inherit;
  background: linear-gradient(180deg, color-mix(in oklab, var(--g1) 7%, transparent), transparent 30%);
}
.new-home-wrapper .panel__chrome {
  display: flex; align-items: center; gap: 6px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--line);
  background: color-mix(in oklab, var(--surface-2) 80%, var(--surface));
  position: relative;
}
.new-home-wrapper .panel__chrome .dot { width: 10px; height: 10px; border-radius: 50%; }
.new-home-wrapper .panel__chrome .dot--r { background: #ff5f57; }
.new-home-wrapper .panel__chrome .dot--y { background: #ffbd2e; }
.new-home-wrapper .panel__chrome .dot--g { background: #28c940; }
.new-home-wrapper .panel__path {
  margin-left: 14px;
  font-family: var(--font-sora), monospace;
  font-size: 12px;
  color: var(--mute);
}
.new-home-wrapper .panel__live {
  margin-left: auto;
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--font-sora), monospace;
  font-size: 11px; letter-spacing: .1em; text-transform: uppercase;
  color: #16a34a;
}
.new-home-wrapper .live-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #22c55e; box-shadow: 0 0 0 3px color-mix(in oklab, #22c55e 25%, transparent);
  animation: pulse 1.8s ease-in-out infinite;
}

.new-home-wrapper .term {
  padding: 20px 22px 22px;
  font-family: var(--font-sora), monospace;
  font-size: 13px;
  line-height: 1.85;
  color: var(--ink-2);
  background: var(--surface);
}
.new-home-wrapper .term__line { opacity: 0; transform: translateY(4px); animation: termIn .45s var(--ease-out) forwards; }
.new-home-wrapper .term__line:nth-child(1) { animation-delay: .2s; }
.new-home-wrapper .term__line:nth-child(2) { animation-delay: .5s; }
.new-home-wrapper .term__line:nth-child(3) { animation-delay: .8s; }
.new-home-wrapper .term__line:nth-child(4) { animation-delay: 1.1s; }
.new-home-wrapper .term__line:nth-child(5) { animation-delay: 1.4s; }
.new-home-wrapper .term__line:nth-child(6) { animation-delay: 1.7s; }
.new-home-wrapper .term__line:nth-child(7) { animation-delay: 2.0s; }
@keyframes termIn { to { opacity: 1; transform: none; } }

.new-home-wrapper .c-mute { color: var(--mute-2); }
.new-home-wrapper .c-fg   { color: var(--ink); }
.new-home-wrapper .c-ok   { color: #16a34a; font-weight: 600; }
.new-home-wrapper .c-grad {
  background: linear-gradient(100deg, var(--g1), var(--g2));
  -webkit-background-clip: text; background-clip: text; color: transparent;
  font-weight: 600;
}
.new-home-wrapper .caret {
  display: inline-block; width: 8px; height: 14px;
  background: var(--ink); vertical-align: -2px;
  animation: blink 1.1s steps(1) infinite;
}
@keyframes blink { 50% { opacity: 0; } }

.new-home-wrapper .panel__meta {
  display: grid; grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--line);
}
.new-home-wrapper .meta-cell {
  padding: 14px 18px;
  display: flex; flex-direction: column; gap: 2px;
  border-right: 1px solid var(--line);
  background: color-mix(in oklab, var(--surface-2) 50%, var(--surface));
}
.new-home-wrapper .meta-cell:last-child { border-right: 0; }
.new-home-wrapper .meta-cell__k {
  font-size: 11px; letter-spacing: .1em; text-transform: uppercase;
  color: var(--mute-2);
  font-family: var(--font-sora), monospace;
}
.new-home-wrapper .meta-cell__v {
  font-family: var(--font-texar), sans-serif;
  font-size: 22px; font-weight: 600;
  color: var(--ink); letter-spacing: -.02em;
}
.new-home-wrapper .meta-cell__v .unit { font-size: 14px; color: var(--mute); margin-left: 2px; }

/* Floating chips */
.new-home-wrapper .chip {
  position: absolute;
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 14px;
  border-radius: 99px;
  background: var(--surface);
  border: 1px solid var(--line-2);
  box-shadow: var(--shadow-md);
  font-size: 13px;
  color: var(--ink);
  backdrop-filter: blur(6px);
}
.new-home-wrapper .chip svg { width: 14px; height: 14px; color: #16a34a; }
.new-home-wrapper .chip--float-1 {
  top: -16px; left: -24px;
  animation: floatA 7s ease-in-out infinite alternate;
}
.new-home-wrapper .chip--float-2 {
  bottom: -14px; right: -24px;
  animation: floatB 8s ease-in-out infinite alternate;
}
.new-home-wrapper .chip__gradpill {
  width: 10px; height: 10px; border-radius: 50%;
  background: linear-gradient(135deg, var(--g1), var(--g2));
}
@keyframes floatA { to { transform: translateY(-8px); } }
@keyframes floatB { to { transform: translateY(8px); } }

@media (max-width: 1100px) {
  .new-home-wrapper .hero__inner--split { grid-template-columns: 1fr; gap: 48px; }
  .new-home-wrapper .chip--float-1 { left: 8px; }
  .new-home-wrapper .chip--float-2 { right: 8px; }
}

/* Marquee */
.new-home-wrapper .marquee {
  margin-top: 70px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 18px 0;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
  background: color-mix(in oklab, var(--surface-2) 40%, var(--bg));
}
.new-home-wrapper .marquee__track {
  display: inline-flex; align-items: center;
  gap: 36px;
  white-space: nowrap;
  animation: marquee 50s linear infinite;
  font-family: var(--font-texar), sans-serif;
  color: var(--ink-2);
  font-size: 18px;
  letter-spacing: -.01em;
}
.new-home-wrapper .marquee__track .bullet {
  color: var(--g1);
  font-size: 10px;
  opacity: .7;
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* =========================================================
   Logo strip
   ========================================================= */
.new-home-wrapper .strip { padding: 40px 0 30px; border-bottom: 1px solid var(--line); }
.new-home-wrapper .strip__inner {
  display: grid; gap: 18px;
  grid-template-columns: auto 1fr;
  align-items: center;
}
.new-home-wrapper .strip__label {
  font-family: var(--font-sora), monospace;
  font-size: 12px; letter-spacing: .16em; text-transform: uppercase;
  color: var(--mute-2);
}
.new-home-wrapper .strip__logos {
  display: flex; flex-wrap: wrap; gap: 36px 56px;
  align-items: center;
}
.new-home-wrapper .wlogo {
  font-family: var(--font-texar), sans-serif;
  font-weight: 600; letter-spacing: -.02em;
  font-size: 22px;
  color: var(--ink-2);
  opacity: .7;
  transition: opacity .2s var(--ease), color .2s var(--ease);
}
.new-home-wrapper .wlogo .ai { color: var(--g1); }
.new-home-wrapper .wlogo:hover { opacity: 1; }

@media (max-width: 800px) {
  .new-home-wrapper .strip__inner { grid-template-columns: 1fr; }
  .new-home-wrapper .strip__logos { gap: 24px 32px; }
}

/* =========================================================
   Sections
   ========================================================= */
.new-home-wrapper .section { padding: var(--section-y) 0; position: relative; }
.new-home-wrapper .section--alt { background: var(--bg-alt); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.new-home-wrapper .section__head { max-width: 820px; margin: 0 auto 60px; text-align: center; }
.new-home-wrapper .section__head .kicker::before { display: none; }
.new-home-wrapper .section__head .kicker { justify-content: center; }

/* Grid helpers */
.new-home-wrapper .grid { display: grid; gap: 20px; }
.new-home-wrapper .grid--3 { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 900px) { .new-home-wrapper .grid--3 { grid-template-columns: 1fr; } }

/* Cards (services / testimonials shared) */
.new-home-wrapper .card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  padding: 28px;
  box-shadow: var(--shadow-sm);
  transition: transform .25s var(--ease), box-shadow .25s var(--ease), border-color .25s var(--ease);
  position: relative;
  overflow: hidden;
}
.new-home-wrapper .card::before {
  content:""; position:absolute; inset:0; border-radius: inherit;
  background: radial-gradient(400px circle at var(--mx,-100px) var(--my,-100px), color-mix(in oklab, var(--g1) 10%, transparent), transparent 60%);
  opacity: 0; transition: opacity .35s var(--ease);
  pointer-events: none;
}
.new-home-wrapper .card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: color-mix(in oklab, var(--g1) 25%, var(--line)); }
.new-home-wrapper .card:hover::before { opacity: 1; }

.new-home-wrapper .card__icon {
  width: 44px; height: 44px; border-radius: 11px;
  display: grid; place-items: center;
  background: color-mix(in oklab, var(--g1) 10%, var(--surface));
  border: 1px solid color-mix(in oklab, var(--g1) 20%, var(--line));
  color: var(--g1);
  margin-bottom: 18px;
  transition: transform .3s var(--ease), background .3s var(--ease);
}
.new-home-wrapper .card__icon svg { width: 20px; height: 20px; }
.new-home-wrapper .card:hover .card__icon {
  background: linear-gradient(135deg, var(--g1), var(--g2));
  color: #fff;
  transform: rotate(-4deg) scale(1.05);
}
.new-home-wrapper .card__h { font-family: var(--font-texar), sans-serif; font-size: 20px; font-weight: 600; margin: 0 0 8px; letter-spacing: -.02em; }
.new-home-wrapper .card__p { color: var(--mute); margin: 0 0 18px; font-size: 15px; line-height: 1.55; }
.new-home-wrapper .card__link {
  display: inline-flex; align-items: center; gap: 6px;
  color: var(--ink);
  font-size: 14px; font-weight: 500;
  border-bottom: 1px solid transparent;
  transition: color .2s var(--ease), border-color .2s var(--ease);
}
.new-home-wrapper .card__link span { transition: transform .25s var(--ease); }
.new-home-wrapper .card__link:hover { color: var(--g1); }
.new-home-wrapper .card__link:hover span { transform: translateX(3px); }

/* =========================================================
   Process / steps
   ========================================================= */
.new-home-wrapper .steps {
  list-style: none; padding: 0; margin: 0;
  display: grid; gap: 16px;
  counter-reset: stepcount;
}
.new-home-wrapper .step {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 40px;
  padding: 36px 32px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  transition: border-color .25s var(--ease), box-shadow .25s var(--ease);
}
.new-home-wrapper .step::before {
  content:""; position:absolute; inset-block: 0; left: 0; width: 3px;
  background: linear-gradient(180deg, var(--g1), var(--g2));
  transform: scaleY(0); transform-origin: top;
  transition: transform .5s var(--ease-out);
}
.new-home-wrapper .step:hover { box-shadow: var(--shadow-md); }
.new-home-wrapper .step:hover::before { transform: scaleY(1); }
.new-home-wrapper .step__num {
  font-family: var(--font-texar), sans-serif;
  font-size: 72px; font-weight: 500;
  letter-spacing: -.05em;
  background: linear-gradient(180deg, var(--g1), var(--g2));
  -webkit-background-clip: text; background-clip: text; color: transparent;
  line-height: 1;
}
.new-home-wrapper .step__h {
  font-family: var(--font-texar), sans-serif;
  font-size: 28px; font-weight: 600;
  margin: 0 0 10px; letter-spacing: -.02em;
}
.new-home-wrapper .step__p { color: var(--mute); margin: 0 0 16px; max-width: 640px; }
.new-home-wrapper .step__list {
  display: flex; flex-wrap: wrap; gap: 8px;
  list-style: none; padding: 0; margin: 0;
}
.new-home-wrapper .step__list li {
  font-family: var(--font-sora), monospace;
  font-size: 12px;
  color: var(--ink-2);
  padding: 5px 10px;
  border: 1px solid var(--line);
  border-radius: 99px;
  background: var(--surface-2);
}

@media (max-width: 800px) {
  .new-home-wrapper .step { grid-template-columns: 1fr; gap: 8px; padding: 28px; }
  .new-home-wrapper .step__num { font-size: 48px; }
}

/* =========================================================
   Case study
   ========================================================= */
.new-home-wrapper .case__stats {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--line);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  overflow: hidden;
  margin-bottom: 40px;
}
.new-home-wrapper .stat {
  background: var(--surface);
  padding: 28px 24px;
  display: flex; flex-direction: column; gap: 6px;
}
.new-home-wrapper .stat__v {
  font-family: var(--font-texar), sans-serif;
  font-size: clamp(36px, 3.4vw, 52px);
  font-weight: 600;
  letter-spacing: -.03em;
  line-height: 1;
  background: linear-gradient(100deg, var(--g1), var(--g2));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.new-home-wrapper .stat__k {
  color: var(--mute);
  font-size: 13.5px;
}
@media (max-width: 800px) { .new-home-wrapper .case__stats { grid-template-columns: repeat(2, 1fr); } }

.new-home-wrapper .case__body { display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px; align-items: stretch; }
@media (max-width: 1000px) { .new-home-wrapper .case__body { grid-template-columns: 1fr; } }

/* Fake product UI — NurMed */
.new-home-wrapper .panel--app .app {
  display: grid;
  grid-template-columns: 210px 1fr;
  min-height: 460px;
}
.new-home-wrapper .app__side {
  background: var(--surface-2);
  border-right: 1px solid var(--line);
  padding: 18px 14px;
  display: flex; flex-direction: column; gap: 18px;
}
.new-home-wrapper .app__brand {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-texar), sans-serif;
  font-weight: 600;
  letter-spacing: -.02em;
}
.new-home-wrapper .app__brand .mark {
  width: 20px; height: 20px; border-radius: 6px;
  background: linear-gradient(135deg, var(--g1), var(--g2));
}
.new-home-wrapper .app__nav { display: flex; flex-direction: column; gap: 2px; }
.new-home-wrapper .app__item {
  font-size: 13px; color: var(--mute);
  padding: 7px 9px; border-radius: 7px;
  cursor: pointer;
  transition: background .18s var(--ease), color .18s var(--ease);
}
.new-home-wrapper .app__item:hover { background: var(--surface); color: var(--ink); }
.new-home-wrapper .app__item--active {
  background: color-mix(in oklab, var(--g1) 12%, var(--surface));
  color: var(--ink); font-weight: 500;
}
.new-home-wrapper .app__pill {
  margin-top: auto;
  font-family: var(--font-sora), monospace;
  font-size: 11px;
  color: var(--mute-2);
  letter-spacing: .1em; text-transform: uppercase;
  padding: 6px 8px;
  border: 1px dashed var(--line-2);
  border-radius: 7px;
  text-align: center;
}

.new-home-wrapper .app__main { padding: 20px 22px; display: flex; flex-direction: column; gap: 16px; }
.new-home-wrapper .app__row { display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap; }
.new-home-wrapper .app__small { font-size: 12px; color: var(--mute-2); font-family: var(--font-sora), monospace; letter-spacing: .04em; text-transform: uppercase; }
.new-home-wrapper .app__title { font-family: var(--font-texar), sans-serif; font-size: 18px; font-weight: 600; margin-top: 2px; }

.new-home-wrapper .tag {
  padding: 5px 10px; border-radius: 99px;
  font-size: 12px;
  border: 1px solid var(--line-2);
}
.new-home-wrapper .tag--grad {
  background: linear-gradient(100deg, var(--g1), var(--g2));
  color: #fff; border: 0;
}

.new-home-wrapper .app__cards {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
}
.new-home-wrapper .appcard {
  padding: 12px 14px;
  background: color-mix(in oklab, var(--surface-2) 60%, var(--surface));
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  display: flex; flex-direction: column; gap: 4px;
}
.new-home-wrapper .app__big {
  font-family: var(--font-texar), sans-serif;
  font-size: 26px; font-weight: 600; letter-spacing: -.02em;
  color: var(--ink);
  line-height: 1;
}
.new-home-wrapper .app__big i { font-style: normal; color: var(--mute); font-size: 16px; font-weight: 500; }
.new-home-wrapper .app__delta { font-size: 12px; color: var(--mute); }
.new-home-wrapper .app__delta.down { color: #16a34a; }

.new-home-wrapper .app__note {
  padding: 14px 16px;
  border: 1px solid var(--line);
  background: var(--surface);
  border-radius: var(--r-md);
  font-size: 13.5px; line-height: 1.6;
  color: var(--ink-2);
}
.new-home-wrapper .app__note p { margin: 4px 0; }

/* Quote */
.new-home-wrapper .case__quote {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  padding: 32px 32px 28px;
  box-shadow: var(--shadow-sm);
  display: flex; flex-direction: column; gap: 22px;
  position: relative;
}
.new-home-wrapper .quote-mark { width: 36px; height: 36px; color: color-mix(in oklab, var(--g1) 45%, var(--line-2)); }
.new-home-wrapper .case__quote blockquote {
  margin: 0; font-size: 19px; line-height: 1.5;
  color: var(--ink);
  font-family: var(--font-texar), sans-serif;
  letter-spacing: -.01em;
  text-wrap: pretty;
}
.new-home-wrapper .case__by { display: flex; align-items: center; gap: 12px; }
.new-home-wrapper .avatar {
  width: 44px; height: 44px; border-radius: 50%;
  background: linear-gradient(135deg, var(--g1), var(--g2));
  color: #fff;
  display: grid; place-items: center;
  font-family: var(--font-texar), sans-serif;
  font-weight: 600; font-size: 14px;
  letter-spacing: .06em;
}
.new-home-wrapper .avatar--2 { background: linear-gradient(135deg, #06b6d4, #4f46e5); }
.new-home-wrapper .avatar--3 { background: linear-gradient(135deg, #ec4899, #7c3aed); }
.new-home-wrapper .case__name { font-weight: 600; font-size: 14px; }
.new-home-wrapper .case__org { font-size: 13px; color: var(--mute); }

/* =========================================================
   Portfolio
   ========================================================= */
.new-home-wrapper .portfolio {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: auto;
  gap: 20px;
}
.new-home-wrapper .pcard {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  padding: 24px;
  display: flex; flex-direction: column; gap: 10px;
  transition: transform .28s var(--ease), box-shadow .28s var(--ease), border-color .28s var(--ease);
  position: relative;
  overflow: hidden;
}
.new-home-wrapper .pcard:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
  border-color: color-mix(in oklab, var(--g1) 25%, var(--line));
}
.new-home-wrapper .pcard--lg {
  grid-column: span 2;
  grid-row: span 2;
  padding: 32px;
}
.new-home-wrapper .pcard__tag {
  font-family: var(--font-sora), monospace;
  font-size: 11.5px;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--mute-2);
}
.new-home-wrapper .pcard__h { font-family: var(--font-texar), sans-serif; font-size: 26px; font-weight: 600; margin: 2px 0 4px; letter-spacing: -.02em; }
.new-home-wrapper .pcard--lg .pcard__h { font-size: 40px; }
.new-home-wrapper .pcard__p { color: var(--mute); margin: 0; font-size: 15px; }
.new-home-wrapper .pcard__metric {
  margin-top: auto;
  font-family: var(--font-sora), monospace;
  font-size: 13px;
  color: var(--mute);
}
.new-home-wrapper .pcard__metric strong {
  color: var(--ink);
  font-family: var(--font-texar), sans-serif;
  font-size: 20px; font-weight: 600; letter-spacing: -.02em; margin-right: 4px;
}
.new-home-wrapper .pcard__img {
  margin-top: 16px;
  aspect-ratio: 16/9;
  border: 1px solid var(--line);
  border-radius: var(--r-md);
  overflow: hidden;
  background: var(--surface-2);
  position: relative;
}
.new-home-wrapper .pcard__img::after {
  content: attr(data-label);
  position: absolute; inset: auto 14px 12px auto;
  font-family: var(--font-sora), monospace;
  font-size: 11px; color: var(--mute);
  background: color-mix(in oklab, var(--surface) 85%, transparent);
  padding: 4px 8px; border-radius: 6px;
  border: 1px solid var(--line);
}
.new-home-wrapper .mockimg--stripes {
  width: 100%; height: 100%;
  background-image:
    repeating-linear-gradient(135deg,
      color-mix(in oklab, var(--g1) 8%, transparent) 0 18px,
      transparent 18px 36px),
    linear-gradient(135deg, color-mix(in oklab, var(--g1) 10%, var(--surface-2)), color-mix(in oklab, var(--g2) 10%, var(--surface-2)));
}

@media (max-width: 1100px) {
  .new-home-wrapper .portfolio { grid-template-columns: repeat(2, 1fr); }
  .new-home-wrapper .pcard--lg { grid-column: span 2; grid-row: auto; }
}
@media (max-width: 620px) {
  .new-home-wrapper .portfolio { grid-template-columns: 1fr; }
  .new-home-wrapper .pcard--lg { grid-column: auto; }
}

/* =========================================================
   Comparison table
   ========================================================= */
.new-home-wrapper .cmp {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  position: relative;
}
.new-home-wrapper .cmp__head {
  display: grid; grid-template-columns: 1.2fr 1fr 1fr;
  background: color-mix(in oklab, var(--surface-2) 70%, var(--surface));
  border-bottom: 1px solid var(--line);
}
.new-home-wrapper .cmp__head > div {
  padding: 20px 28px;
  font-family: var(--font-texar), sans-serif;
  font-weight: 600;
  letter-spacing: -.01em;
  color: var(--mute);
  font-size: 15px;
}
.new-home-wrapper .cmp__us {
  color: var(--ink);
  background: linear-gradient(180deg, color-mix(in oklab, var(--g1) 8%, transparent), transparent);
  display: inline-flex; align-items: center; gap: 10px;
}
.new-home-wrapper .cmp__mark {
  width: 14px; height: 14px; border-radius: 4px;
  background: linear-gradient(135deg, var(--g1), var(--g2));
}
.new-home-wrapper .cmp__row {
  display: grid; grid-template-columns: 1.2fr 1fr 1fr;
  border-top: 1px solid var(--line);
  transition: background .2s var(--ease);
}
.new-home-wrapper .cmp__row:hover { background: color-mix(in oklab, var(--g1) 4%, transparent); }
.new-home-wrapper .cmp__k, .new-home-wrapper .cmp__v { padding: 20px 28px; font-size: 15px; }
.new-home-wrapper .cmp__k { color: var(--ink); font-weight: 500; }
.new-home-wrapper .cmp__v { color: var(--mute); }
.new-home-wrapper .cmp__v--yes {
  color: var(--ink); font-weight: 500;
  position: relative;
}
.new-home-wrapper .cmp__v--yes::before {
  content:""; display:inline-block;
  width: 16px; height: 16px; margin-right: 10px; vertical-align: -3px;
  background: linear-gradient(135deg, var(--g1), var(--g2));
  mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="black" d="M9 16.2l-3.5-3.6L4 14l5 5 11-11-1.4-1.4z"/></svg>') center / contain no-repeat;
  -webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="black" d="M9 16.2l-3.5-3.6L4 14l5 5 11-11-1.4-1.4z"/></svg>') center / contain no-repeat;
}
.new-home-wrapper .cmp__v--no::before {
  content:""; display:inline-block;
  width: 14px; height: 2px; margin-right: 12px; vertical-align: 4px;
  background: var(--mute-2);
}

@media (max-width: 720px) {
  .new-home-wrapper .cmp__head, .new-home-wrapper .cmp__row { grid-template-columns: 1.2fr 1fr 1fr; }
  .new-home-wrapper .cmp__k, .new-home-wrapper .cmp__v, .new-home-wrapper .cmp__head > div { padding: 14px 16px; font-size: 13.5px; }
}

/* =========================================================
   Testimonials
   ========================================================= */
.new-home-wrapper .tcard {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--r-lg);
  padding: 28px;
  box-shadow: var(--shadow-sm);
  display: flex; flex-direction: column; gap: 22px;
  transition: transform .25s var(--ease), box-shadow .25s var(--ease), border-color .25s var(--ease);
  margin: 0;
}
.new-home-wrapper .tcard:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: color-mix(in oklab, var(--g1) 25%, var(--line)); }
.new-home-wrapper .tcard blockquote {
  margin: 0; font-size: 17px; line-height: 1.55;
  color: var(--ink);
  font-family: var(--font-texar), sans-serif;
  letter-spacing: -.005em;
  text-wrap: pretty;
}
.new-home-wrapper .tcard__by { display: flex; align-items: center; gap: 12px; }
.new-home-wrapper .tcard__name { font-weight: 600; font-size: 14px; }
.new-home-wrapper .tcard__org { font-size: 13px; color: var(--mute); }

/* =========================================================
   FAQ
   ========================================================= */
.new-home-wrapper .faq { border-top: 1px solid var(--line); }
.new-home-wrapper .faq__item { border-bottom: 1px solid var(--line); }
.new-home-wrapper .faq__item summary {
  list-style: none; cursor: pointer;
  padding: 22px 4px;
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
  font-family: var(--font-texar), sans-serif;
  font-size: 19px; font-weight: 500;
  color: var(--ink); letter-spacing: -.01em;
  transition: color .2s var(--ease);
}
.new-home-wrapper .faq__item summary::-webkit-details-marker { display: none; }
.new-home-wrapper .faq__item summary:hover { color: var(--g1); }
.new-home-wrapper .faq__plus {
  position: relative; width: 16px; height: 16px; flex-shrink: 0;
}
.new-home-wrapper .faq__plus::before, .new-home-wrapper .faq__plus::after {
  content:""; position: absolute; inset: 50% 0 auto 0; height: 1.75px; background: var(--ink-2);
  transform: translateY(-50%);
  transition: transform .3s var(--ease), background .2s var(--ease);
}
.new-home-wrapper .faq__plus::after { transform: translateY(-50%) rotate(90deg); }
.new-home-wrapper .faq__item[open] .faq__plus::after { transform: translateY(-50%) rotate(0deg); }
.new-home-wrapper .faq__item[open] summary { color: var(--g1); }
.new-home-wrapper .faq__item[open] .faq__plus::before,
.new-home-wrapper .faq__item[open] .faq__plus::after { background: var(--g1); }
.new-home-wrapper .faq__body {
  padding: 0 4px 22px;
  color: var(--mute);
  max-width: 680px;
  font-size: 15.5px; line-height: 1.65;
  animation: faqIn .35s var(--ease-out);
}
@keyframes faqIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: none; }
}

/* =========================================================
   Final CTA
   ========================================================= */
.new-home-wrapper .cta {
  position: relative;
  padding: 120px 0 130px;
  overflow: hidden;
  isolation: isolate;
  text-align: center;
  background: var(--bg-alt);
  border-top: 1px solid var(--line);
}
.new-home-wrapper .cta__inner { max-width: 860px; margin: 0 auto; }
.new-home-wrapper .cta__h { margin: 0 0 18px; }
.new-home-wrapper .cta__p { color: var(--mute); font-size: 18px; max-width: 640px; margin: 0 auto 28px; }
.new-home-wrapper .cta__ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.new-home-wrapper .cta__fine { color: var(--mute-2); font-size: 13px; margin-top: 22px; font-family: var(--font-sora), monospace; }

/* =========================================================
   Footer
   ========================================================= */
.new-home-wrapper .foot {
  background: var(--surface);
  border-top: 1px solid var(--line);
  padding: 70px 0 40px;
}
.new-home-wrapper .foot__inner {
  display: grid;
  grid-template-columns: 1.4fr repeat(3, 1fr);
  gap: 40px;
  padding-bottom: 50px;
  border-bottom: 1px solid var(--line);
}
.new-home-wrapper .foot__brandcol .nav__brand { margin-bottom: 14px; }
.new-home-wrapper .foot__blurb { color: var(--mute); font-size: 14.5px; max-width: 340px; }
.new-home-wrapper .foot__col { display: flex; flex-direction: column; gap: 10px; }
.new-home-wrapper .foot__h {
  font-family: var(--font-sora), monospace;
  font-size: 11.5px; text-transform: uppercase; letter-spacing: .16em;
  color: var(--mute-2);
  margin-bottom: 4px;
}
.new-home-wrapper .foot__col a {
  color: var(--ink-2); font-size: 14.5px;
  transition: color .18s var(--ease);
}
.new-home-wrapper .foot__col a:hover { color: var(--g1); }
.new-home-wrapper .foot__bottom {
  display: flex; justify-content: space-between; gap: 20px;
  padding-top: 24px;
  font-size: 13px; color: var(--mute-2);
  flex-wrap: wrap;
}
.new-home-wrapper .foot__tag { font-family: var(--font-sora), monospace; }

@media (max-width: 900px) {
  .new-home-wrapper .foot__inner { grid-template-columns: 1fr 1fr; gap: 28px; }
}
@media (max-width: 560px) {
  .new-home-wrapper .foot__inner { grid-template-columns: 1fr; }
}

/* =========================================================
   Reveal animations
   ========================================================= */
.new-home-wrapper .reveal {
  opacity: 0;
  transform: translateY(14px);
  transition: opacity .7s var(--ease-out) var(--d, 0s), transform .7s var(--ease-out) var(--d, 0s);
}
.new-home-wrapper .reveal.is-in { opacity: 1; transform: none; }

.new-home-wrapper .reveal-word {
  display: inline-block;
  opacity: 0; transform: translateY(18px);
  animation: wordIn .7s var(--ease-out) forwards;
}
.new-home-wrapper .hero__h1 .reveal-word:nth-child(1) { animation-delay: .1s; }
.new-home-wrapper .hero__h1 .reveal-word:nth-child(2) { animation-delay: .18s; }
.new-home-wrapper .hero__h1 .reveal-word:nth-child(3) { animation-delay: .26s; }
.new-home-wrapper .hero__h1 .reveal-word:nth-child(4) { animation-delay: .34s; }
.new-home-wrapper .hero__h1 .reveal-word:nth-child(5) { animation-delay: .42s; }
.new-home-wrapper .hero__h1 .reveal-word:nth-child(6) { animation-delay: .50s; }
.new-home-wrapper .hero__h1 .reveal-word:nth-child(7) { animation-delay: .62s; }
.new-home-wrapper .hero__h1 .reveal-word:nth-child(8) { animation-delay: .72s; }
@keyframes wordIn { to { opacity: 1; transform: none; } }

@media (prefers-reduced-motion: reduce) {
  .new-home-wrapper *, .new-home-wrapper *::before, .new-home-wrapper *::after { animation-duration: .001ms !important; transition-duration: .001ms !important; }
  .new-home-wrapper .blob { animation: none; }
}

/* =========================================================
   Tweaks panel
   ========================================================= */
.new-home-wrapper .tweaks {
  position: fixed;
  right: 20px; bottom: 20px;
  z-index: 60;
  background: var(--surface);
  border: 1px solid var(--line-2);
  border-radius: 14px;
  box-shadow: var(--shadow-lg);
  padding: 16px 18px;
  min-width: 280px;
  font-size: 13px;
  backdrop-filter: blur(10px);
}
.new-home-wrapper .tweaks[hidden] { display: none; }
.new-home-wrapper .tweaks__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.new-home-wrapper .tweaks__title {
  font-family: var(--font-texar), sans-serif; font-weight: 600; letter-spacing: -.01em;
  font-size: 14px;
}
.new-home-wrapper .tweaks__close { font-size: 18px; color: var(--mute); line-height: 1; padding: 0 4px; }
.new-home-wrapper .tweaks__row {
  display: grid; grid-template-columns: 80px 1fr; align-items: center;
  gap: 10px; margin-bottom: 10px;
}
.new-home-wrapper .tweaks__row label {
  color: var(--mute);
  font-size: 12px;
  font-family: var(--font-sora), monospace;
  text-transform: uppercase;
  letter-spacing: .08em;
}
.new-home-wrapper .seg {
  display: inline-flex;
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
  background: var(--surface-2);
  min-height: 30px;
}
.new-home-wrapper .seg button {
  padding: 6px 10px;
  font-size: 12px;
  color: var(--mute);
  display: inline-flex; align-items: center; gap: 6px;
  transition: background .15s var(--ease), color .15s var(--ease);
}
.new-home-wrapper .seg button[aria-pressed="true"] {
  background: var(--surface);
  color: var(--ink);
  font-weight: 500;
  box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--g1) 30%, var(--line));
}
.new-home-wrapper .dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; }
.new-home-wrapper .dot--signature { background: linear-gradient(135deg, #7c3aed, #2563eb); }
.new-home-wrapper .dot--cool      { background: linear-gradient(135deg, #06b6d4, #4f46e5); }
.new-home-wrapper .dot--warm      { background: linear-gradient(135deg, #ec4899, #7c3aed); }
.new-home-wrapper .tweaks__hint {
  margin: 8px 0 0;
  font-size: 11px;
  color: var(--mute-2);
  font-family: var(--font-sora), monospace;
}
/* hide the global nav and footer on the new landing page */
.new-home-wrapper ~ .layout-navbar,
.new-home-wrapper ~ .layout-footer {
  display: none !important;
}
`;
fs.writeFileSync(path.join(__dirname, "app/new-home.css"), css);
`;
fs.writeFileSync(path.join(__dirname, "scratch-css.js"), code);
