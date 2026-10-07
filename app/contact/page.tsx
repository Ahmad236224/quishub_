"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import CalendarBooking from "@/components/ui/CalendarBooking";
import Label from "@/components/system/Label";
import Arrow from "@/components/system/Arrow";
import { situations } from "@/lib/content/services";
import { cn } from "@/lib/utils";

const projectTypes = [...situations.map((s) => s.title), "Something else"];

const budgetRanges = ["Under $5k", "$5k–$15k", "$15k–$50k", "$50k+"];

const nextSteps = [
  { title: "A 30-minute call", text: "You walk us through how the work happens today." },
  { title: "We map it", text: "We sketch the workflow and point out what should become software." },
  { title: "A straight answer", text: "Scope, timeline and cost, or a clear note that we're not the right fit." },
];

const faqs = [
  {
    q: "What kind of businesses do you work with?",
    a: "Healthcare, legal, hospitality, publishing, fintech and education so far. Anywhere a process runs on people copying things between tools. We turn down work we can't make work.",
  },
  {
    q: "How long does a project take?",
    a: "From the first call to something measurable is usually two to six weeks. Larger platforms are scoped in phases, and you see progress every week.",
  },
  {
    q: "Can you work on our existing software?",
    a: "Often. We audit it, stabilise it, then extend it. Expect a readable architecture diagram and a prioritised plan in the first week.",
  },
  {
    q: "What's the smallest engagement?",
    a: "A two-week architecture sprint. If you need less than that, we'll point you to a better fit.",
  },
  {
    q: "Do you stay on after launch?",
    a: "Yes. Retainers cover on-call support, model and dependency upgrades, cost tuning and a monthly review of the system.",
  },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    budget: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"calendar" | "form">("calendar");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    if (!formState.name.trim()) newErrors.name = true;
    if (!formState.email.trim() || !formState.email.includes("@")) newErrors.email = true;
    if (!formState.message.trim()) newErrors.message = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          company: formState.company,
          projectType: formState.projectType,
          budget: formState.budget,
          message: formState.message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormState({ name: "", email: "", phone: "", company: "", projectType: "", budget: "", message: "" });
      } else {
        setSubmitError("Failed to send message. Please try again or email us directly.");
      }
    } catch (error) {
      setSubmitError("Network error. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const field =
    "w-full rounded-md border border-line-2 bg-surface-2 px-4 py-3 text-[15px] text-ink placeholder:text-mute-2 transition-colors duration-200 focus:border-ink focus:outline-none";
  const labelCls = "mb-2 block font-mono text-[11.5px] uppercase tracking-[0.06em] text-mute";

  return (
    <>
      <section className="pb-12 pt-[128px] md:pb-16 md:pt-[180px]">
        <div className="wrap">
          <Label>Start a project</Label>
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <h1 className="max-w-[14ch] font-display text-display-2xl font-semibold lg:col-span-8">
              Show us how the work happens today.
            </h1>
            <div className="lg:col-span-4 lg:self-end">
              <p className="max-w-[36ch] text-lede text-mute">
                Book a free 30-minute call, or write it down if that&apos;s easier. We reply within 24 hours.
              </p>
              <a href="mailto:hello@quishub.com" className="mt-5 inline-block font-ui text-[18px] text-ink">
                <span className="link-draw pb-0.5">hello@quishub.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line py-16 md:py-24">
        <div className="wrap grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <aside className="lg:col-span-4">
            <p className="label-mono">What happens next</p>
            <ol className="mt-6 border-t border-ink">
              {nextSteps.map((s, i) => (
                <li key={s.title} className="flex gap-4 border-b border-line py-5">
                  <span className="font-mono text-[12px] text-mute">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="font-ui text-[17px] font-medium">{s.title}</p>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-mute">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </aside>

          <div className="lg:col-span-8">
            <div role="tablist" aria-label="How to reach us" className="flex gap-8 border-b border-line">
              {(
                [
                  ["calendar", "Book a call"],
                  ["form", "Send a message"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  role="tab"
                  type="button"
                  aria-selected={activeTab === id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "-mb-px border-b pb-3 font-ui text-[16px] transition-colors",
                    activeTab === id ? "border-ink text-ink" : "border-transparent text-mute hover:text-ink"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="pt-8" role="tabpanel">
              {activeTab === "calendar" && (
                <>
                  <CalendarBooking />
                  <p className="mt-4 text-[14px] text-mute">
                    You&apos;ll get a calendar invite with a Google Meet link as soon as you book.
                  </p>
                </>
              )}

              {activeTab === "form" &&
                (submitted ? (
                  <div className="rounded-lg border border-line bg-surface-2 p-10">
                    <p className="label-mono">Sent</p>
                    <p className="mt-3 font-display text-display-md font-semibold">Thanks. We&apos;ll be in touch within 24 hours.</p>
                    <p className="mt-3 text-[15px] text-mute">We&apos;ll read how the process works today and come back with questions or a time to talk.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className={labelCls}>
                          Full name *
                        </label>
                        <input
                          id="name"
                          type="text"
                          autoComplete="name"
                          aria-invalid={errors.name || undefined}
                          className={cn(field, errors.name && "border-red-600")}
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className={labelCls}>
                          Email *
                        </label>
                        <input
                          id="email"
                          type="email"
                          autoComplete="email"
                          aria-invalid={errors.email || undefined}
                          className={cn(field, errors.email && "border-red-600")}
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className={labelCls}>
                          Phone <span className="normal-case tracking-normal">(optional, for SMS follow-up)</span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          autoComplete="tel"
                          placeholder="Business phone number"
                          className={field}
                          value={formState.phone}
                          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="company" className={labelCls}>
                          Company <span className="normal-case tracking-normal">(optional)</span>
                        </label>
                        <input
                          id="company"
                          type="text"
                          autoComplete="organization"
                          className={field}
                          value={formState.company}
                          onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="projectType" className={labelCls}>
                          Closest situation
                        </label>
                        <select
                          id="projectType"
                          className={cn(field, "cursor-pointer")}
                          value={formState.projectType}
                          onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                        >
                          <option value="">Select one</option>
                          {projectTypes.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="budget" className={labelCls}>
                          Budget range
                        </label>
                        <select
                          id="budget"
                          className={cn(field, "cursor-pointer")}
                          value={formState.budget}
                          onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
                        >
                          <option value="">Select range</option>
                          {budgetRanges.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className={labelCls}>
                        How does it work today? *
                      </label>
                      <textarea
                        id="message"
                        rows={6}
                        aria-invalid={errors.message || undefined}
                        placeholder="Who does what, which tools are involved, and where it gets stuck."
                        className={cn(field, "resize-y", errors.message && "border-red-600")}
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      />
                    </div>

                    {submitError && (
                      <p role="alert" className="rounded-md border border-red-600/30 bg-red-600/5 p-3 text-[14px] text-red-700">
                        {submitError}
                      </p>
                    )}

                    <p className="text-[12.5px] leading-relaxed text-mute">
                      By providing your phone number and clicking Send Message, you agree to receive SMS messages from Quishub regarding scheduling consultations, follow-ups, sharing relevant materials, and responding to inquiries about Quishub workflow software. Message frequency may vary. Standard message and data rates may apply. Reply STOP to opt out. Reply HELP for help. Consent is not a condition of purchase. Your mobile information will not be sold or shared with third parties for promotional or marketing purposes. See our Privacy Policy at{" "}
                      <Link href="/privacy" className="underline hover:text-ink">
                        https://quishub.com/privacy
                      </Link>
                      .
                    </p>
                    <p className="text-[12.5px] text-mute">
                      By submitting this form you agree to our{" "}
                      <Link href="/privacy" className="underline hover:text-ink">
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link href="/terms" className="underline hover:text-ink">
                        Terms & Conditions
                      </Link>
                      .
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group inline-flex h-12 items-center gap-2.5 rounded-md bg-ink px-6 font-ui text-[15px] font-medium text-background transition-colors hover:bg-ink-2 disabled:opacity-50"
                    >
                      {isSubmitting ? "Sending…" : "Send Message"}
                      {!isSubmitting && <Arrow className="transition-transform group-hover:translate-x-0.5" />}
                    </button>
                  </form>
                ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line py-20 md:py-28" aria-labelledby="faq-title">
        <div className="wrap grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Label>Questions</Label>
            <h2 id="faq-title" className="mt-5 font-display text-display-md font-semibold">
              Before you get in touch.
            </h2>
          </div>
          <div className="border-t border-ink lg:col-span-8">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-ui text-[18px] font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden="true" className="font-mono text-[16px] text-mute transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-[60ch] pb-6 text-[15.5px] leading-relaxed text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
