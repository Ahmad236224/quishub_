"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import HealthcareBookingSystem from "@/components/healthcare/HealthcareBookingSystem";
import FlowPipeline from "@/components/healthcare/FlowPipeline";
import MetricCard from "@/components/healthcare/MetricCard";
import {
  INDUSTRY_METRICS,
  INDUSTRY_SOURCE_NOTE,
  EXISTING_SYSTEMS,
  CAPABILITIES,
  PA_PIPELINE,
  PA_CAPABILITIES,
  RCM_FLOW,
  RCM_CAPABILITIES,
  DENIAL_PATTERNS,
  PATIENT_ACCESS_CAPABILITIES,
  PHONE_AGENT_USE_CASES,
  AFTER_HOURS_FLOW,
  CLINICAL_AI_CAPABILITIES,
  EVIDENCE_EXAMPLE,
  DOCUMENT_PIPELINE,
  OPERATIONAL_SYSTEMS,
  SAAS_PRODUCT_TYPES,
  SAAS_FOUNDATIONS,
  INTEROP_STANDARDS,
  EHR_INTEGRATIONS,
  OTHER_INTEGRATIONS,
  ARCHITECTURE_CHAIN,
  GUARDRAILS,
  SECURITY_CONTROLS,
  SECURITY_NOTE,
  COMPARISON_ROWS,
  PA_BEFORE,
  PA_AFTER,
  SCHEDULING_AFTER_FLOW,
  ROI_METRICS,
  ROI_EXAMPLE,
  PROCESS_STEPS,
  AUDIENCES,
  VERIFIED_PROOF,
} from "./content";

/* ------------------------------------------------------------------ */
/*  Shared motion + icons                                             */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const IconArrow = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

const IconCheck = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m5 12 5 5L20 7" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Reusable local pieces                                              */
/* ------------------------------------------------------------------ */

function Kicker({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-display bg-gradient-to-r from-[#7c3aed] to-[#2563eb] bg-clip-text text-sm font-bold text-transparent">
        {n} —
      </span>
      <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-quishub-muted">
        {title}
      </span>
    </div>
  );
}

function GradientPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-sans inline-flex items-center rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-label text-white shadow-[0_4px_14px_-4px_rgba(124,58,237,0.45)]"
      style={{ background: "linear-gradient(90deg, #7c3aed 0%, #2563eb 100%)" }}
    >
      {children}
    </span>
  );
}

function PrimaryCTA({ children, href = "#book" }: { children: React.ReactNode; href?: string }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full py-2 pl-7 pr-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
      style={{ background: "linear-gradient(90deg,#7c3aed,#2563eb)" }}
    >
      <span className="relative">{children}</span>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-quishub-light text-quishub-black">
        <IconArrow className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Comparison table that collapses into stacked cards on mobile. */
function ComparisonTable() {
  return (
    <div className="mt-14">
      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-quishub-border">
              <th className="py-4 pr-6 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-quishub-muted">
                Capability
              </th>
              <th className="py-4 pr-6 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#7c3aed]">
                Quishub Custom System
              </th>
              <th className="py-4 pr-6 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-quishub-muted">
                Generic SaaS
              </th>
              <th className="py-4 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-quishub-muted">
                Manual Workflow
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.dimension} className="border-b border-quishub-border/60">
                <td className="py-5 pr-6 text-sm font-semibold text-quishub-black">{row.dimension}</td>
                <td className="py-5 pr-6 text-sm font-medium text-quishub-black">
                  <span className="flex items-start gap-2">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#7c3aed]" />
                    {row.quishub}
                  </span>
                </td>
                <td className="py-5 pr-6 text-sm text-quishub-muted">{row.generic}</td>
                <td className="py-5 text-sm text-quishub-muted">{row.manual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card-stack */}
      <div className="space-y-4 md:hidden">
        {COMPARISON_ROWS.map((row) => (
          <div key={row.dimension} className="surface-card rounded-2xl p-5">
            <div className="text-sm font-semibold text-quishub-black">{row.dimension}</div>
            <dl className="mt-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#7c3aed]">Quishub</dt>
                <dd className="text-right text-[0.85rem] font-medium text-quishub-black">{row.quishub}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-quishub-muted">Generic SaaS</dt>
                <dd className="text-right text-[0.85rem] text-quishub-muted">{row.generic}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-quishub-muted">Manual</dt>
                <dd className="text-right text-[0.85rem] text-quishub-muted">{row.manual}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HealthcarePage() {
  return (
    <div className="min-h-screen bg-quishub-light text-quishub-black selection:bg-[#7c3aed]/20">
      {/* ============================================================ */}
      {/*  01 — HERO                                                    */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-[#7c3aed] opacity-[0.10] blur-[130px]" />
          <div className="absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-[#2563eb] opacity-[0.10] blur-[130px]" />
        </div>

        <div className="relative container-content pt-28 pb-16 md:pt-36 md:pb-24">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
            <Reveal>
              <SectionLabel>Healthcare AI &amp; Software</SectionLabel>

              <h1 className="font-display mt-6 max-w-2xl text-[2.4rem] font-semibold leading-[1.03] tracking-[-0.03em] md:text-[3.6rem] lg:text-[4.2rem]">
                Your clinical team shouldn&rsquo;t be buried in administrative work.
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-[1.6] text-quishub-muted">
                Quishub builds custom healthcare software and AI automation that
                connects fragmented workflows, removes repetitive administrative
                work, and gives clinical and operational teams more time for the
                work that actually needs people.
              </p>

              <p className="mt-5 max-w-xl text-sm font-semibold uppercase tracking-[0.1em] text-quishub-faint">
                Revenue cycle · Prior authorization · Patient access · Clinical
                operations · Voice AI · Healthcare SaaS · Integrations
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <PrimaryCTA>Book a Healthcare Automation Call</PrimaryCTA>
                <Link
                  href="#capabilities"
                  className="inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold text-quishub-black transition-colors hover:text-[#7c3aed]"
                >
                  Explore what we build <IconArrow className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="relative mx-auto w-full max-w-sm lg:max-w-none">
              <div className="relative overflow-hidden rounded-3xl border border-quishub-border shadow-lg">
                <Image
                  src="/images/healthcare/Cross-Location Sync.jpg"
                  alt="Clinical staff reviewing a live operations dashboard on a monitor"
                  width={720}
                  height={640}
                  priority
                  className="h-[420px] w-full object-cover md:h-[520px]"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "linear-gradient(180deg, rgba(22,14,32,0) 55%, rgba(22,14,32,0.55) 100%)" }}
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                  <p className="text-[0.95rem] font-semibold leading-snug text-white">
                    One automation and integration layer connecting the
                    systems your organization already runs.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  02 — PROOF STRIP (verified only)                             */}
      {/* ============================================================ */}
      <section className="border-y border-quishub-border bg-quishub-surfaceAlt">
        <div className="container-content flex flex-col items-center gap-4 py-8 text-center md:flex-row md:justify-between md:text-left">
          <p className="text-sm font-semibold text-quishub-muted">
            Built <span className="text-quishub-black">{VERIFIED_PROOF.product}</span> for{" "}
            <span className="text-quishub-black">{VERIFIED_PROOF.client}</span> — a{" "}
            <span className="text-quishub-black">34% reduction</span> in consultation time,
            measurable in week one.
          </p>
          <span className="shrink-0 rounded-full border border-quishub-border bg-quishub-surface px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-quishub-muted">
            {VERIFIED_PROOF.region}
          </span>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  03 — HEALTHCARE BY THE NUMBERS                               */}
      {/* ============================================================ */}
      <section className="section-light section-padding">
        <div className="container-content">
          <Reveal>
            <Kicker n="02" title="The operational picture" />
            <h2 className="font-display mt-5 max-w-2xl text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[2.8rem]">
              Healthcare, by the numbers.
            </h2>
          </Reveal>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {INDUSTRY_METRICS.map((m, i) => (
              <MetricCard key={m.value + m.label} value={m.value} label={m.label} source={m.source} index={i} />
            ))}
          </motion.div>

          <p className="mt-10 max-w-3xl text-[0.72rem] leading-relaxed text-quishub-faint">
            {INDUSTRY_SOURCE_NOTE}
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  04 — THE WORKFLOW PROBLEM                                    */}
      {/* ============================================================ */}
      <section className="section-padding">
        <div className="container-content">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <Reveal>
              <Kicker n="03" title="Where the friction actually is" />
              <h2 className="font-display mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[2.8rem]">
                Healthcare has a workflow problem.
              </h2>
              <p className="mt-6 text-lg leading-[1.6] text-quishub-muted">
                Most organizations already have an EHR, payer portals, a billing
                platform, a scheduling system, a phone system, fax, email,
                spreadsheets, and a patient portal. The software exists. The
                problem is what happens between those systems — staff copying
                data, calling insurers, checking portals, moving documents,
                following up, updating spreadsheets, contacting patients,
                reconciling status by hand.
              </p>
              <p className="mt-6 text-lg font-semibold leading-[1.5] text-quishub-black">
                Quishub builds the automation and integration layer between
                those systems.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="surface-card rounded-2xl p-7 md:p-8">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-quishub-muted">
                  Systems already in place
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {EXISTING_SYSTEMS.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-quishub-border bg-quishub-surfaceAlt px-3.5 py-1.5 text-[0.78rem] font-medium text-quishub-muted"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex items-center gap-3 border-t border-quishub-border pt-6">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#2563eb)" }}>
                    <IconArrow className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-semibold text-quishub-black">
                    Staff currently do the work of connecting them.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  05 — SIX CAPABILITY CARDS                                    */}
      {/* ============================================================ */}
      <section id="capabilities" className="section-white section-padding">
        <div className="container-content">
          <Reveal>
            <Kicker n="04" title="What we build" />
            <h2 className="font-display mt-5 max-w-2xl text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[2.8rem]">
              Six capability areas, one connected system.
            </h2>
          </Reveal>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {CAPABILITIES.map((c) => (
              <motion.a
                key={c.n}
                href={c.anchor}
                variants={fadeUp}
                className="group surface-card flex flex-col rounded-2xl p-7 transition-all duration-300 hover:border-[#7c3aed]/30"
              >
                <span className="font-display bg-gradient-to-br from-[#7c3aed] to-[#2563eb] bg-clip-text text-2xl font-bold text-transparent">
                  {c.n}
                </span>
                <h3 className="mt-4 text-lg font-semibold leading-snug tracking-[-0.01em]">{c.title}</h3>
                <p className="mt-2.5 text-[0.9rem] leading-[1.55] text-quishub-muted">{c.body}</p>
                <ul className="mt-5 space-y-2 border-t border-quishub-border pt-5">
                  {c.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-[0.82rem] text-quishub-muted">
                      <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7c3aed]" />
                      {p}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-[#7c3aed] opacity-0 transition-opacity group-hover:opacity-100">
                  Read more <IconArrow className="h-3 w-3" />
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  06 — PRIOR AUTHORIZATION DEEP DIVE                           */}
      {/* ============================================================ */}
      <section id="prior-authorization" className="section-padding scroll-mt-20">
        <div className="container-content">
          <Reveal>
            <Kicker n="05" title="Prior authorization" />
            <h2 className="font-display mt-5 max-w-2xl text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[2.8rem]">
              Authorization that stops living in a portal queue.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-[1.6] text-quishub-muted">
              From requirement detection through appeal, every stage of a prior
              authorization request tracked as a monitored workflow instead of
              a stack of open tabs.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-14">
            <p className="mb-5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-quishub-muted">
              Request lifecycle
            </p>
            <FlowPipeline steps={PA_PIPELINE} numbered />
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-quishub-border bg-quishub-border md:grid-cols-2">
            {PA_CAPABILITIES.map((c) => (
              <div key={c.title} className="bg-quishub-light p-7">
                <h3 className="text-[0.98rem] font-semibold leading-snug tracking-[-0.01em]">{c.title}</h3>
                <p className="mt-2.5 text-[0.88rem] leading-[1.55] text-quishub-muted">{c.body}</p>
              </div>
            ))}
          </div>

          <Reveal delay={0.15} className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="surface-card-strong rounded-2xl p-7 md:p-8">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#7c3aed]">Why now</p>
              <p className="mt-4 text-[0.98rem] leading-[1.6] text-quishub-black">
                CMS requires impacted payers to implement and maintain Prior
                Authorization APIs beginning in 2027 — exact compliance timing
                varies by payer type. Organizations that build the workflow
                layer now are modernizing ahead of the requirement, not
                reacting to it.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-quishub-border">
              <Image
                src="/images/healthcare/Prior Authorization Tracking System.jpg"
                alt="Prior authorization tracking interface showing requests moving through submission and status stages"
                width={640}
                height={480}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  07 — REVENUE CYCLE MANAGEMENT (incl. denial management)      */}
      {/* ============================================================ */}
      <section id="revenue-cycle" className="section-white section-padding scroll-mt-20">
        <div className="container-content">
          <Reveal>
            <Kicker n="06" title="Revenue cycle" />
            <h2 className="font-display mt-5 max-w-2xl text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[2.8rem]">
              Revenue that doesn&rsquo;t depend on someone remembering to follow up.
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="mt-14">
            <FlowPipeline steps={RCM_FLOW} />
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Reveal>
              <h3 className="text-lg font-semibold tracking-[-0.01em]">What we automate</h3>
              <ul className="mt-5 space-y-3">
                {RCM_CAPABILITIES.map((c) => (
                  <li key={c} className="flex items-start gap-2.5 text-[0.92rem] text-quishub-muted">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#7c3aed]" />
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="surface-card rounded-2xl p-7 md:p-8">
                <h3 className="text-lg font-semibold tracking-[-0.01em]">Denial intelligence</h3>
                <p className="mt-2.5 text-[0.9rem] leading-[1.55] text-quishub-muted">
                  Recurring denial reasons classified automatically, so staff
                  work the pattern instead of re-diagnosing every claim from
                  scratch.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {DENIAL_PATTERNS.map((d) => (
                    <span
                      key={d}
                      className="rounded-full border border-quishub-border bg-quishub-surfaceAlt px-3 py-1.5 text-[0.76rem] font-medium text-quishub-muted"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  08 — PATIENT ACCESS (intake + referral automation merged)    */}
      {/* ============================================================ */}
      <section id="patient-access" className="section-padding scroll-mt-20">
        <div className="container-content">
          <Reveal>
            <Kicker n="07" title="Patient access" />
            <h2 className="font-display mt-5 max-w-2xl text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[2.8rem]">
              Front-of-house workflows that don&rsquo;t bottleneck on two people.
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PATIENT_ACCESS_CAPABILITIES.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.04} className="surface-card rounded-2xl p-6">
                <h3 className="text-[0.98rem] font-semibold leading-snug tracking-[-0.01em]">{c.title}</h3>
                <p className="mt-2.5 text-[0.86rem] leading-[1.55] text-quishub-muted">{c.body}</p>
              </Reveal>
            ))}

            <Reveal delay={0.2} className="relative overflow-hidden rounded-2xl border border-quishub-border md:col-span-2 lg:col-span-1">
              <Image
                src="/images/healthcare/Smart Multilingual Patient Reminders.png"
                alt="Automated multilingual patient reminder and confirmation interface"
                width={640}
                height={480}
                className="h-full w-full object-cover"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  09 — AI HEALTHCARE PHONE AGENTS                              */}
      {/* ============================================================ */}
      <section id="phone-agents" className="section-white section-padding scroll-mt-20">
        <div className="container-content">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <Kicker n="08" title="AI healthcare phone agents" />
              <h2 className="font-display mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[2.6rem]">
                Voice automation connected to the workflow, not a demo bot.
              </h2>
              <p className="mt-6 text-[1.05rem] leading-[1.6] text-quishub-muted">
                Our phone agents check real availability, read and write to
                your systems, and hand off to a human the moment a call needs
                judgment — not a disconnected voice assistant reading a
                script.
              </p>
              <ul className="mt-7 space-y-2.5">
                {PHONE_AGENT_USE_CASES.map((u) => (
                  <li key={u} className="flex items-start gap-2.5 text-[0.9rem] text-quishub-muted">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#7c3aed]" />
                    {u}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[0.88rem] leading-[1.55] text-quishub-muted">
                Every call produces a conversation summary, captured intent,
                follow-up tasks, and an escalation path to a human when the
                call needs one.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mb-5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-quishub-muted">
                After-hours call flow
              </p>
              <FlowPipeline steps={AFTER_HOURS_FLOW} numbered />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  10 — CLINICAL & DOCUMENT INTELLIGENCE                        */}
      {/* ============================================================ */}
      <section id="clinical-intelligence" className="section-padding scroll-mt-20">
        <div className="container-content">
          <Reveal>
            <Kicker n="09" title="Clinical &amp; document intelligence" />
            <h2 className="font-display mt-5 max-w-2xl text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[2.8rem]">
              AI that shows its work.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-[1.6] text-quishub-muted">
              Healthcare AI output should point back to a source, not present
              unsupported text. Every finding links to the record it came
              from, so a reviewer can inspect the evidence instead of
              trusting a generated summary blindly.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Reveal>
              <ul className="space-y-3">
                {CLINICAL_AI_CAPABILITIES.map((c) => (
                  <li key={c} className="flex items-start gap-2.5 text-[0.92rem] text-quishub-muted">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#7c3aed]" />
                    {c}
                  </li>
                ))}
              </ul>
              <div className="mt-8 relative overflow-hidden rounded-2xl border border-quishub-border">
                <Image
                  src="/images/healthcare/Pre-Visit Patient Summary.jpg"
                  alt="Pre-visit patient summary interface drawing from longitudinal record history"
                  width={640}
                  height={420}
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>

            {/* Evidence-linked AI example mockup */}
            <Reveal delay={0.1}>
              <div className="surface-card-strong rounded-2xl p-7 md:p-8">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-quishub-muted">
                  Evidence-linked AI — example
                </p>
                <div className="mt-5 rounded-xl border border-quishub-border bg-quishub-surface p-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#2563eb)" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                        <path d="M12 8v4m0 4h.01M12 3l9 16H3z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-quishub-faint">
                        AI finding
                      </p>
                      <p className="mt-1 text-[0.95rem] font-medium leading-snug text-quishub-black">
                        &ldquo;{EVIDENCE_EXAMPLE.finding}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-quishub-border pt-4">
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-quishub-faint">
                      Source chain — click to inspect
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {EVIDENCE_EXAMPLE.sourceChain.map((s, i) => (
                        <span key={s} className="flex items-center gap-2">
                          <span className="rounded-lg border border-quishub-border bg-quishub-surfaceAlt px-2.5 py-1 text-[0.76rem] font-semibold text-quishub-black">
                            {s}
                          </span>
                          {i < EVIDENCE_EXAMPLE.sourceChain.length - 1 && (
                            <IconArrow className="h-3 w-3 text-quishub-faint" />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-5 text-[0.82rem] leading-[1.55] text-quishub-muted">
                  A reviewer can open the underlying clinical note instead of
                  accepting the summary on faith — the model shows where the
                  finding came from.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="mt-16">
            <p className="mb-5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-quishub-muted">
              Document processing pipeline
            </p>
            <FlowPipeline steps={DOCUMENT_PIPELINE} />
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  11 — OPERATIONAL HEALTHCARE SYSTEMS                          */}
      {/* ============================================================ */}
      <section className="section-white section-padding">
        <div className="container-content">
          <Reveal>
            <Kicker n="10" title="Operational systems" />
            <h2 className="font-display mt-5 max-w-2xl text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[2.8rem]">
              The operational layer around clinical work.
            </h2>
          </Reveal>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-quishub-border bg-quishub-border md:grid-cols-2 lg:grid-cols-3"
          >
            {OPERATIONAL_SYSTEMS.map((s) => (
              <motion.div key={s.title} variants={fadeUp} className="bg-quishub-light p-7">
                <h3 className="text-[0.95rem] font-semibold leading-snug tracking-[-0.01em]">{s.title}</h3>
                <p className="mt-2.5 text-[0.86rem] leading-[1.55] text-quishub-muted">{s.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  12 — HEALTHCARE SAAS & PRODUCT DEVELOPMENT                   */}
      {/* ============================================================ */}
      <section id="healthcare-saas" className="section-padding scroll-mt-20">
        <div className="container-content">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <Kicker n="11" title="Healthcare SaaS &amp; product development" />
              <h2 className="font-display mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[2.6rem]">
                For companies building healthcare products, too.
              </h2>
              <p className="mt-6 text-[1.05rem] leading-[1.6] text-quishub-muted">
                Not every client is automating internal operations — some are
                building the product. We design and ship multi-tenant
                healthcare platforms, telehealth and remote patient
                monitoring, and the foundations that make a healthcare SaaS
                product sellable: subscriptions, tenant isolation, RBAC,
                audit logs, configurable workflows, white-labeling.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {SAAS_FOUNDATIONS.map((f) => (
                  <span key={f} className="rounded-full border border-quishub-border bg-quishub-surfaceAlt px-3.5 py-1.5 text-[0.78rem] font-medium text-quishub-muted">
                    {f}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="surface-card rounded-2xl p-7 md:p-8">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-quishub-muted">
                  What we build
                </p>
                <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {SAAS_PRODUCT_TYPES.map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-[0.86rem] text-quishub-muted">
                      <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7c3aed]" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  13 — INTEROPERABILITY & INTEGRATIONS                         */}
      {/* ============================================================ */}
      <section className="section-white section-padding">
        <div className="container-content">
          <Reveal>
            <Kicker n="12" title="Interoperability &amp; integrations" />
            <h2 className="font-display mt-5 max-w-2xl text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[2.8rem]">
              Built around the systems you already run.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-[1.6] text-quishub-muted">
              We connect to the platforms already in your stack instead of
              asking you to migrate onto ours — subject to what each
              vendor&rsquo;s API and access model actually allows.
            </p>
          </Reveal>

          {/* Ecosystem hub diagram */}
          <Reveal delay={0.1} className="mt-14">
            <div className="surface-card rounded-2xl p-7 md:p-10">
              <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto_1fr]">
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-quishub-muted">
                    Standards
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {INTEROP_STANDARDS.map((s) => (
                      <span key={s} className="rounded-full border border-quishub-border bg-quishub-surfaceAlt px-3 py-1.5 text-[0.76rem] font-medium text-quishub-muted">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className="mx-auto flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xs font-bold text-white shadow-lg"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#2563eb)" }}
                  aria-hidden="true"
                >
                  API
                </div>

                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-quishub-muted">
                    EHR integration capability
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {EHR_INTEGRATIONS.map((s) => (
                      <span key={s} className="rounded-full border border-quishub-border bg-quishub-surfaceAlt px-3 py-1.5 text-[0.76rem] font-medium text-quishub-muted">
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-[0.72rem] leading-relaxed text-quishub-faint">
                    Integration capability, subject to each vendor&rsquo;s API and
                    access availability — not a formal partnership or
                    certification.
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-quishub-border pt-6">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-quishub-muted">
                  Also integrated
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {OTHER_INTEGRATIONS.map((s) => (
                    <span key={s} className="rounded-full border border-quishub-border bg-quishub-surfaceAlt px-3 py-1.5 text-[0.76rem] font-medium text-quishub-muted">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  14 — AI ARCHITECTURE: RULES + AI + HUMANS                    */}
      {/* ============================================================ */}
      <section className="section-padding">
        <div className="container-content">
          <Reveal className="max-w-2xl">
            <Kicker n="13" title="AI architecture" />
            <h2 className="font-display mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[2.8rem]">
              Not &ldquo;AI does everything.&rdquo; Rules, AI, and human judgment,
              working together.
            </h2>
            <p className="mt-6 text-lg leading-[1.6] text-quishub-muted">
              Reliable healthcare systems combine deterministic software, AI,
              and human review — each doing the part it&rsquo;s actually reliable
              at.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-14 surface-card-strong rounded-2xl p-7 md:p-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {(["Deterministic", "AI", "Human"] as const).map((layer) => (
                <div key={layer} className="rounded-xl border border-quishub-border bg-quishub-surface p-5">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#7c3aed]">
                    {layer === "Deterministic" ? "Deterministic software" : layer === "AI" ? "AI" : "Human review"}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {ARCHITECTURE_CHAIN.filter((c) => c.layer === layer).map((c) => (
                      <li key={c.label} className="text-[0.86rem] leading-snug text-quishub-black">
                        {c.label}
                        <span className="block text-[0.74rem] font-normal text-quishub-muted">{c.sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-quishub-border pt-6">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-quishub-muted">
                Example chain, in order
              </p>
              <div className="mt-5">
                <FlowPipeline
                  steps={ARCHITECTURE_CHAIN.map((c) => ({ label: c.label, sub: c.sub }))}
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="mt-10">
            <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-quishub-muted">
              Guardrails
            </p>
            <div className="flex flex-wrap gap-2.5">
              {GUARDRAILS.map((g) => (
                <span key={g} className="rounded-full border border-quishub-border bg-quishub-surfaceAlt px-3.5 py-1.5 text-[0.8rem] font-medium text-quishub-muted">
                  {g}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  15 — SECURITY & HIPAA-READY ARCHITECTURE                     */}
      {/* ============================================================ */}
      <section className="section-white section-padding">
        <div className="container-content">
          <Reveal>
            <Kicker n="14" title="Security" />
            <h2 className="font-display mt-5 max-w-2xl text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[2.8rem]">
              HIPAA-ready architecture, not a marketing claim.
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SECURITY_CONTROLS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.04} className="surface-card rounded-2xl p-6">
                <h3 className="text-[0.95rem] font-semibold leading-snug tracking-[-0.01em]">{s.title}</h3>
                <p className="mt-2.5 text-[0.86rem] leading-[1.55] text-quishub-muted">{s.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-10 max-w-3xl border-l-2 border-[#7c3aed] pl-6">
            <p className="text-[0.92rem] leading-[1.6] text-quishub-muted">{SECURITY_NOTE}</p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  16 — COMPARISON                                              */}
      {/* ============================================================ */}
      <section className="section-padding">
        <div className="container-content">
          <Reveal>
            <Kicker n="15" title="How this compares" />
            <h2 className="font-display mt-5 max-w-2xl text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[2.8rem]">
              A custom system, generic software, or more headcount.
            </h2>
          </Reveal>
          <ComparisonTable />
        </div>
      </section>

      {/* ============================================================ */}
      {/*  17 — BEFORE / AFTER                                          */}
      {/* ============================================================ */}
      <section className="section-white section-padding">
        <div className="container-content">
          <Reveal>
            <Kicker n="16" title="Before / after" />
            <h2 className="font-display mt-5 max-w-2xl text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[2.8rem]">
              What the workflow looks like, before and after.
            </h2>
            <p className="mt-4 max-w-2xl text-[0.85rem] leading-relaxed text-quishub-faint">
              These process flows illustrate how a workflow is restructured —
              staff still review and decide on sensitive or clinical steps.
            </p>
          </Reveal>

          <div className="mt-14 space-y-14">
            <Reveal>
              <h3 className="text-lg font-semibold tracking-[-0.01em]">Prior authorization</h3>
              <div className="mt-6 space-y-8">
                <div>
                  <p className="mb-4 flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-quishub-faint">
                    Before
                  </p>
                  <FlowPipeline steps={PA_BEFORE} tone="light" />
                </div>
                <div>
                  <p className="mb-4 flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#7c3aed]">
                    After
                  </p>
                  <FlowPipeline steps={PA_AFTER} tone="light" />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h3 className="text-lg font-semibold tracking-[-0.01em]">After-hours AI scheduling</h3>
              <div className="mt-6">
                <FlowPipeline steps={SCHEDULING_AFTER_FLOW} numbered />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  18 — ROI / WORK REMOVED                                      */}
      {/* ============================================================ */}
      <section className="section-padding">
        <div className="container-content">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <Kicker n="17" title="Measuring impact" />
              <h2 className="font-display mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[2.6rem]">
                Measure ROI in work removed.
              </h2>
              <p className="mt-6 text-[1.05rem] leading-[1.6] text-quishub-muted">
                Every workflow we ship is measured against the same
                framework: how much repetitive work actually left the team&rsquo;s
                desk.
              </p>
              <ul className="mt-7 space-y-2.5">
                {ROI_METRICS.map((m) => (
                  <li key={m} className="flex items-start gap-2.5 text-[0.9rem] text-quishub-muted">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#7c3aed]" />
                    {m}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="surface-card-strong rounded-2xl p-7 md:p-8">
                <p className="inline-flex rounded-full border border-quishub-border bg-quishub-surfaceAlt px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-quishub-muted">
                  {ROI_EXAMPLE.label}
                </p>
                <div className="mt-6 space-y-4">
                  {ROI_EXAMPLE.lines.map((line, i) => (
                    <div key={line} className="flex items-start gap-3">
                      <span className="font-display mt-0.5 text-sm font-bold text-quishub-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-[0.95rem] leading-[1.55] text-quishub-black">{line}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  19 — DELIVERY PROCESS (8 steps)                              */}
      {/* ============================================================ */}
      <section className="section-white section-padding">
        <div className="container-content">
          <Reveal>
            <Kicker n="18" title="How delivery works" />
            <h2 className="font-display mt-5 max-w-2xl text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[2.8rem]">
              We prove value on one workflow before expanding.
            </h2>
          </Reveal>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {PROCESS_STEPS.map((p) => (
              <motion.div key={p.n} variants={fadeUp} className="surface-card rounded-2xl p-6">
                <span className="font-display bg-gradient-to-r from-[#7c3aed] to-[#2563eb] bg-clip-text text-xl font-bold text-transparent">
                  {p.n}
                </span>
                <h3 className="mt-3 text-[0.98rem] font-semibold tracking-[-0.01em]">{p.title}</h3>
                <p className="mt-2.5 text-[0.84rem] leading-[1.5] text-quishub-muted">{p.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  20 — WHO WE BUILD FOR                                        */}
      {/* ============================================================ */}
      <section className="section-padding">
        <div className="container-content">
          <Reveal>
            <Kicker n="19" title="Who we build for" />
            <h2 className="font-display mt-5 max-w-2xl text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[2.8rem]">
              Organizations we build for.
            </h2>
          </Reveal>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-12 flex flex-wrap gap-3"
          >
            {AUDIENCES.map((a) => (
              <motion.span
                key={a}
                variants={fadeUp}
                className="rounded-full border border-quishub-border bg-quishub-surfaceAlt px-4 py-2.5 text-[0.88rem] font-medium text-quishub-black"
              >
                {a}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  21 — PROOF / CASE STUDY                                      */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden border-y border-quishub-border bg-quishub-surfaceAlt">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-[#7c3aed] opacity-[0.08] blur-[130px]" />
        </div>

        <div className="relative container-content section-padding">
          <Reveal className="max-w-3xl">
            <SectionLabel>Measured in practice</SectionLabel>
            <h2 className="font-display mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[2.8rem]">
              {VERIFIED_PROOF.product} cut consultation time by{" "}
              <span className="bg-gradient-to-r from-[#7c3aed] to-[#2563eb] bg-clip-text font-bold text-transparent">
                34%
              </span>
              .
            </h2>
          </Reveal>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4"
          >
            {VERIFIED_PROOF.metrics.map((m) => (
              <motion.div key={m.label} variants={fadeUp} className="border-t border-quishub-border pt-5">
                <div className="font-display text-[2.1rem] font-bold leading-none tracking-[-0.02em] text-quishub-black">
                  {m.value}
                </div>
                <p className="mt-3 text-sm leading-[1.5] text-quishub-muted">{m.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <Reveal delay={0.1} className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <figure className="border-l-2 border-[#7c3aed] pl-6">
              <blockquote className="text-lg leading-[1.6] text-quishub-black">
                &ldquo;{VERIFIED_PROOF.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm text-quishub-muted">{VERIFIED_PROOF.attribution}</figcaption>
              <p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-quishub-faint">
                {VERIFIED_PROOF.region}
              </p>
            </figure>
            <div className="relative overflow-hidden rounded-2xl border border-quishub-border">
              <Image
                src="/images/healthcare/Real Systems.jpg"
                alt="NurMed clinical documentation system in real use"
                width={640}
                height={480}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  22 — BOOKING                                                 */}
      {/* ============================================================ */}
      <section id="book" className="container-content section-padding scroll-mt-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-[2rem] font-semibold leading-[1.08] tracking-[-0.025em] md:text-[2.6rem]">
            Book a{" "}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#2563eb] bg-clip-text font-bold text-transparent">
              healthcare automation call
            </span>
            .
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-quishub-muted">
            Tell us where the work is getting stuck. We&rsquo;ll send back a
            written diagnostic within 48 hours and a private video room for
            the call.
          </p>
        </Reveal>

        <div className="mt-14">
          <HealthcareBookingSystem />
        </div>
      </section>

      {/* ============================================================ */}
      {/*  23 — FINAL CTA + FOOTER                                      */}
      {/* ============================================================ */}
      <section className="relative border-t border-quishub-border bg-quishub-surfaceAlt text-quishub-black">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-[#7c3aed] opacity-[0.10] blur-[120px]" />
          <div className="absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-[#2563eb] opacity-[0.10] blur-[120px]" />
        </div>

        <div className="relative container-content section-padding">
          <Reveal className="text-center">
            <div className="mb-8 flex justify-center">
              <SectionLabel>Next step</SectionLabel>
            </div>

            <h2 className="font-display mx-auto max-w-4xl text-[2.4rem] font-semibold leading-[0.98] tracking-[-0.03em] md:text-[4.2rem] lg:text-[5rem]">
              Start with one{" "}
              <span className="bg-gradient-to-r from-[#7c3aed] to-[#2563eb] bg-clip-text font-bold text-transparent">
                expensive workflow.
              </span>
            </h2>

            <p className="mx-auto mt-10 max-w-xl text-base leading-[1.55] text-quishub-muted md:text-lg">
              Find the process creating the most administrative work, patient
              friction, revenue delay, manual follow-up, or staff pressure.
              Map it. Fix it. Measure it. Then expand.
            </p>

            <div className="mt-14">
              <PrimaryCTA>Book a Healthcare Automation Call</PrimaryCTA>
            </div>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-quishub-muted">
              Tell us where the work is getting stuck. We&rsquo;ll map the
              workflow and identify where software, AI, or integration can
              remove unnecessary administrative work.
            </p>
          </Reveal>

          <div className="mt-24 border-t border-quishub-border pt-10 md:mt-32">
            <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-4 md:gap-4">
              <div className="md:col-span-2">
                <div className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-quishub-faint">
                  Direct Line
                </div>
                <div className="text-xl font-semibold tracking-[-0.015em] text-quishub-black">
                  Muhammad Mujtaba Rehman
                </div>
                <div className="font-ui mt-0.5 text-sm text-quishub-muted">Founder, Quishub</div>
              </div>

              <a href="mailto:hello@quishub.com" className="group block">
                <div className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-quishub-faint">
                  Email
                </div>
                <div className="text-sm font-semibold text-quishub-black transition-all group-hover:bg-gradient-to-r group-hover:from-[#7c3aed] group-hover:to-[#2563eb] group-hover:bg-clip-text group-hover:text-transparent">
                  hello@quishub.com
                </div>
              </a>

              <a href="tel:+15162667724" className="group block">
                <div className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-quishub-faint">
                  Phone
                </div>
                <div className="text-sm font-semibold text-quishub-black transition-all group-hover:bg-gradient-to-r group-hover:from-[#7c3aed] group-hover:to-[#2563eb] group-hover:bg-clip-text group-hover:text-transparent">
                  +1 (516) 266-7724
                </div>
              </a>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-quishub-border pt-6 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-quishub-faint md:flex-row">
            <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
              <div>© {new Date().getFullYear()} Quishub</div>
              <div className="flex items-center gap-4 text-xs font-medium normal-case tracking-normal text-quishub-muted">
                <Link href="/privacy" className="transition-colors hover:text-quishub-black hover:underline">
                  Privacy Policy
                </Link>
                <span className="text-quishub-border">|</span>
                <Link href="/terms" className="transition-colors hover:text-quishub-black hover:underline">
                  Terms &amp; Conditions
                </Link>
              </div>
            </div>
            <div className="font-ui text-sm normal-case tracking-normal text-quishub-muted">
              Healthcare software and AI automation for hospitals, practices, and healthcare SaaS teams.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
