# Qushub Website Documentation

Sep 25, 2026 · @Qushub

## Overview

Qushub is the company's marketing and lead-generation website, built as a single Next.js 14 (App Router) application that actually ships **two distinct experiences** from one codebase:

- The main **quishub.xyz** marketing site — home, about, services, work/case studies, blog, contact, privacy, and terms.
- A separate **healthcare.\*** subdomain experience, detected server-side from the request `Host` header in `app/layout.tsx`, which swaps in a stripped-down layout (its own header/footer, forced light theme, no navbar/chatbot/theme toggle) for a healthcare-specific landing page and booking flow.

The site's goals are to present Qushub's services and portfolio (AI/software products for legal, healthcare, and publishing clients), capture leads through a contact form and discovery-call booking system (with Google Calendar/Meet integration), publish blog content via an embedded Sanity Studio CMS, and offer an AI chatbot for visitor support and lead qualification.

## Tech Stack

- **Framework**: Next.js 14.2.35 (App Router), React 18.3.1, TypeScript 5.9.3 (strict mode, `@/*` path alias).
- **Styling**: Tailwind CSS 3.4.19 + `styled-components` + plain CSS files, with a custom design-token system (CSS variables for color, brand gradient, and fonts) and dark mode via a `data-theme` attribute.
- **CMS**: Sanity 3.59.1 + `next-sanity` (embedded Studio at `/studio`) for blog content.
- **AI chat**: Google `@google-cloud/vertexai` / `@google/genai` / `@google/generative-ai` — powers the site's chatbot.
- **Email**: `nodemailer` (SMTP) for contact, booking, and healthcare-booking notifications.
- **Animation**: `framer-motion`.
- **UI utilities**: `@heroicons/react`, `lucide-react`, `clsx`, `tailwind-merge`.
- **Fonts**: `geist` (GeistMono) plus local Sora, TT Lakes Neue, and Texar fonts via `next/font/local`.
- **Config notes**: `next.config.js` whitelists `images.unsplash.com` for remote images and marks the `sanity` package as a server-external package to avoid a webpack chunk-naming collision; a `Qushub-main` folder (an apparent legacy/backup copy of the project) is excluded from TypeScript compilation.

## Project Structure

- **`app/`** — Next.js App Router: pages, layouts, API routes, global CSS, and the embedded Sanity Studio (`app/studio/`). Includes a route group `app/(main-site)/` for the blog.
- **`components/`** — all React components, organized into `layout/`, `ui/`, `sections/`, `healthcare/`, `theme/`, `brand/`, `animations/`, plus several standalone decorative background components at the root.
- **`lib/`** — server-side integration helpers: `email.ts` (SMTP/email templating), `googleCalendar.ts` (Google Calendar/Meet OAuth), `utils.ts` (general utilities, e.g. class-name merging).
- **`sanity/`** — Sanity CMS config: `lib/` (client, image URL builder, GROQ queries, types) and `schemaTypes/` (schema index + blog post schema).
- **`public/`** — static assets (fonts, images, favicons, logo).
- **Root config** — `sanity.config.ts` (Studio config), `next.config.js`, `tailwind.config.ts`, `tsconfig.json`, `postcss.config.js`, `.eslintrc.json`, `.env.local` (secrets).
- **`Qushub-main/`** — an apparent duplicate/legacy copy of the project, excluded from the TypeScript build.

## Pages & Routes

**Marketing pages**

- `/` (`app/page.tsx`) — home page, main marketing landing page (hero, sections).
- `/about` — About page (value cards: Quality, Scalability, Honesty).
- `/services` — Services page (Intelligent Automation, Digital Product Launch, Enterprise Infrastructure).
- `/contact` — Contact page with contact form and booking widget.
- `/work` — Work/portfolio index of case studies.
- `/work/fictionpub` — case study: FictionPub, a publishing/writing product (market fit, world-building, structural plotting).
- `/work/nurmed` — case study: NurMed, an AI medical scribe (ambient capture, entity recognition, RAG generation).
- `/work/paklawassist` — case study: PakLawAssist, a RAG-based legal AI assistant.
- `/work/senteez` — case study: Senteez, an NLP review/feedback-intelligence platform.
- `/privacy` — Privacy Policy.
- `/terms` — Terms of Service.

**Healthcare subdomain**

- `/healthcare` — healthcare-focused landing page, served with a distinct layout when the request host is `healthcare.*`.

**Blog (Sanity-backed, route group `app/(main-site)/blog`)**

- `/blog` — blog index, listing posts pulled from Sanity.
- `/blog/[slug]` — individual blog post page (dynamic metadata title: "{post.title} | Quishub Insights").

**CMS**

- `/studio` (`app/studio/[[...tool]]/page.tsx`) — catch-all route mounting the embedded Sanity Studio UI.

**API routes (`app/api/*/route.ts`)**

- `POST /api/booking` — validates name/email/date/time, creates a Google Meet event, and sends notification + confirmation emails for discovery-call bookings.
- `POST /api/chat` — powers the chatbot; calls Vertex AI with a hard-coded "Quishub AI" system prompt describing the company, and detects email/phone patterns for lead handoff.
- `POST /api/contact` — validates name/email/message from the contact form and sends notification/confirmation email.
- `POST /api/healthcare-book` — healthcare-specific booking: builds branded confirmation/notification emails and creates a Calendar/Meet event, defaulting the admin inbox to `HEALTHCARE_NOTIFY_EMAIL`/`SMTP_USER`.

## Key Components

**Layout** (`components/layout/`)

- `Navbar.tsx` — site navigation bar.
- `Footer.tsx` — site footer.
- `BackgroundMesh.tsx` — decorative background mesh/gradient rendered globally.

**UI primitives** (`components/ui/`)

- `Button.tsx`, `Badge.tsx`, `SectionLabel.tsx` — generic building blocks.
- `ChatbotWidget.tsx` — main floating AI chatbot (FAB + panel), talks to `/api/chat`, supports theme, sound effects, and quick actions (book a call, contact support).
- `ChatWidget.tsx` — an earlier/alternate chat widget variant.
- `DelayedChatbot.tsx` — lazy-loads `ChatbotWidget` 2s after page load for performance; hidden on `/studio`.
- `CalendarBooking.tsx` — front-end booking/calendar UI.
- `MouseTracker.tsx` — cursor-follow interactive effect (client-only).
- `SideGradients.tsx` — decorative side gradient effects.

**Sections** (`components/sections/`)

- `Hero.tsx`, `CTA.tsx`, `CaseStudy.tsx`, `FAQ.tsx`, `HowItWorks.tsx`, `Products.tsx`, `Services.tsx`, `Testimonials.tsx`, `WhyQuishub.tsx` — marketing page section blocks composed into landing pages.
- `HomeEffects.tsx` — visual/animation effects specific to the home page.

**Healthcare** (`components/healthcare/`)

- `HealthcareBookingSystem.tsx` — booking flow for the healthcare vertical.
- `FlowPipeline.tsx` — visual pipeline diagram for clinical workflow steps.
- `MetricCard.tsx` — stat/metric display card.

**Theme & brand**

- `theme/ThemeToggle.tsx` — light/dark mode toggle.
- `brand/Logo.tsx` — Quishub logo.
- `brand/QWatermark.tsx` — decorative "Q" brand watermark.

**Animation** (`components/animations/`)

- `RevealOnScroll.tsx`, `motionPresets.ts` — scroll-triggered reveal wrapper and shared Framer Motion presets.

**Decorative backgrounds (root of `components/`)**

- `AntigravityBackground.tsx`, `AscensionGridBackground.tsx`, `FloatingPicturesBackground.tsx`, `GravityGridBackground.tsx`, `InteractiveGridBackground.tsx`, `NetworkBackground.tsx`, `NexusGridBackground.tsx` — a suite of animated background effects used on different pages/sections.
- `OctacsTheme.tsx` — theme-provider-style wrapper around Navbar + main content.
- `GlowButton.tsx`, `GlowLayout.tsx` — glow-styled button and layout wrapper.

## Environment Variables

The API routes and integrations read configuration from `.env.local` (not committed). Based on usage in `lib/email.ts`, `lib/googleCalendar.ts`, and the API routes:

- **Email (SMTP)**: `SMTP_HOST` (defaults to `smtp.gmail.com`), `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`. `lib/email.ts` creates its transporter lazily so a missing config doesn't fail the build; `isEmailConfigured()` guards each send.
- **Google Calendar / Meet**: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` — an OAuth2 refresh-token flow against `oauth2.googleapis.com/token`, used by `/api/booking` and `/api/healthcare-book` to create Calendar events with an attached Google Meet link.
- **Healthcare booking**: `HEALTHCARE_NOTIFY_EMAIL` — admin inbox for healthcare booking notifications (falls back to `SMTP_USER` if unset).
- **Sanity CMS**: project ID / dataset / API version consumed by `sanity/lib/client.ts` and `sanity.config.ts`.
- **AI chatbot**: Google Cloud credentials for `@google-cloud/vertexai` (project/location and service-account credentials, per standard Vertex AI setup).

## Integrations

**Email** (`lib/email.ts`) — a Nodemailer SMTP wrapper. Exports `isEmailConfigured()`, `fromAddress()`, and `sendEmail()` (never throws; returns `{success, data|error}`), plus a shared branded HTML email layout builder (`BRAND` constants, `escapeHtml()`, `emailInfoBlock()`, `emailButton()`, `renderEmailLayout()`). Used by `/api/booking`, `/api/contact`, and `/api/healthcare-book`.

**Google Calendar** (`lib/googleCalendar.ts`) — OAuth2 refresh-token flow. Exports `createEventTimes()` (converts a date + 12-hour time string into Asia/Karachi ISO datetimes) and `createGoogleMeetEvent()`, which creates a Calendar event with an attached Google Meet conference and polls (`waitForConferenceLink`) until the Meet link is confirmed live before returning it — avoiding handing out a not-yet-ready meeting link.

**Sanity CMS** — `sanity.config.ts` defines the Studio (`name: "quishub-blog"`, `basePath: "/studio"`) with the structure and vision tools; schema lives in `sanity/schemaTypes/` (index + blog post type). `sanity/lib/client.ts` exports the project ID/dataset/API version and a Sanity client, `sanity/lib/image.ts` builds image URLs, and `sanity/lib/queries.ts` holds the GROQ queries. The Studio UI mounts in-app at `/studio`; blog pages under `app/(main-site)/blog/` consume this data via `next-sanity` and `@portabletext/react` for rich-text rendering.

**Chatbot** — `components/ui/ChatbotWidget.tsx` is the client-side chat UI; it posts conversation history to `/api/chat`, which uses `@google-cloud/vertexai` with an extensive hard-coded "Quishub AI" system prompt (company facts, leadership, services, values) to answer as a support/sales bot, and detects email/phone patterns to hand off qualified leads. `DelayedChatbot.tsx` dynamically imports the widget client-side only, delaying its mount ~2s after page load for performance, and hides it on `/studio` routes.

## Styling & Theming

- **`app/globals.css`** — Tailwind base/components/utilities directives plus the site's design-token system: CSS custom properties for the color palette (`--bg`, `--ink`, `--g1`/`--g2` brand gradient, etc.) and decorative keyframe animations for ambient background glow. This is the single source of truth for design tokens, reused elsewhere.
- **`app/new-home.css`** — a large, page-scoped stylesheet for the homepage (a "Linear/Vercel-flavoured" design system), explicitly built to reuse tokens from `globals.css` rather than redeclare them, avoiding the homepage drifting off-brand. Defines attribute-based theme variants (`data-accent`, `data-density`) and homepage-specific classes.
- **`tailwind.config.ts`** — dark mode via `class` or `[data-theme="dark"]`; content scanned from `app/**` and `components/**`; an extensive `extend` block mapping Tailwind tokens (color/font/spacing) to the CSS custom properties in `globals.css`, including the `quishub.*` brand palette (`rgb(var(...) / <alpha-value>)` for opacity support), custom fonts (`sans`/`body` = Sora, `ui` = TT Lakes, `display` = Texar), and custom keyframe/animation utilities (marquee, slow-float, pulse-glow, drift1/drift2) used by the decorative background components.
- **`components/theme/ThemeToggle.tsx`** — a fixed pill-shaped Sun/Moon toggle. Reads/writes theme via `document.documentElement.dataset.theme` and persists the choice to `localStorage` under `"quishub-theme"`; hidden on `/studio` routes.
- **Two-experience layout** — `app/layout.tsx` reads the request `Host` header to detect a `healthcare.*` subdomain. For that subdomain it renders a stripped-down layout (fixed header "Quishub Healthcare Architecture", no navbar/chatbot/theme toggle, forced `data-theme="light"`); otherwise it renders the full marketing layout (Navbar, BackgroundMesh, MouseTracker, the `OctacsTheme` wrapper, ThemeToggle, DelayedChatbot). An inline `themeScript` runs before hydration to avoid a flash of unstyled theme (defaults to `"dark"` when no stored preference exists).

## Configuration & Deployment

- **`next.config.js`** — whitelists `images.unsplash.com` under `images.remotePatterns`; marks the `sanity` package as a `serverComponentsExternalPackages` entry to avoid a webpack chunk-naming collision between the `sanity` package and the `@sanity/*` scope.
- **`tsconfig.json`** — strict mode enabled, `moduleResolution: bundler`, `@/*` path alias to the project root; excludes `node_modules` and the legacy `Qushub-main` folder from the build.
- **Multi-domain routing** — the app is deployed as a single Next.js build but serves two brand experiences based on the request host (main site vs. `healthcare.*` subdomain), handled entirely in `app/layout.tsx` rather than via separate deployments.
- **Secrets** — SMTP, Google OAuth, Sanity, and Vertex AI credentials are expected in `.env.local` (see Environment Variables above) and must be configured in the hosting platform for booking, contact, and chatbot features to function in production.
- **CMS deployment** — the Sanity Studio ships as part of the same Next.js app (mounted at `/studio`), so no separate Studio hosting/deploy step is required; content is authored directly against the production Sanity dataset.
