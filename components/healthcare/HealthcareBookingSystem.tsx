"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Clock, MessageSquare, CheckCircle, Phone, CalendarDays } from "lucide-react";
import Link from "next/link";

const IconArrow = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM",
];

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function isAvailableDay(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 1);
  if (date < minDate) return false;
  const dow = date.getDay();
  return dow >= 1 && dow <= 5;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDateTime(date: Date, time: string): string {
  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
  return `${dateStr} at ${time}`;
}

/** ISO (yyyy-mm-dd) using local date parts — avoids UTC off-by-one from toISOString(). */
function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export interface SelectedSlot {
  /** Human-readable label for display, e.g. "Mon, Jan 5, 2026 at 10:00 AM". */
  label: string;
  /** ISO date (yyyy-mm-dd) for the Calendar API. */
  isoDate: string;
  /** Time in the "hh:mm AM/PM" format the Calendar API expects. */
  time: string;
}

function HealthcareCalendarPicker({
  onSelect,
  onClose
}: {
  onSelect: (slot: SelectedSlot) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const canGoPrev =
    year > today.getFullYear() ||
    (year === today.getFullYear() && month > today.getMonth());

  const handleDateClick = (day: number) => {
    const d = new Date(year, month, day);
    if (!isAvailableDay(d)) return;
    setSelectedDate(d);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onSelect({
        label: formatDateTime(selectedDate, selectedTime),
        isoDate: toIsoDate(selectedDate),
        time: selectedTime,
      });
    }
  };

  return (
    <div className="absolute z-50 mt-2 rounded-2xl border border-quishub-border bg-quishub-surface shadow-2xl p-4 w-[320px] md:w-[360px]">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="p-2 rounded-lg hover:bg-quishub-surfaceAlt disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="text-sm font-semibold text-quishub-black">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-quishub-surfaceAlt transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[0.65rem] font-semibold text-quishub-faint py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDow }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(year, month, day);
          const available = isAvailableDay(date);
          const isSelected = selectedDate && sameDay(date, selectedDate);

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDateClick(day)}
              disabled={!available}
              className={`h-8 w-8 rounded-lg text-sm font-medium transition-all ${
                isSelected
                  ? "bg-gradient-to-r from-[#7c3aed] to-[#2563eb] text-quishub-white"
                  : available
                  ? "hover:bg-quishub-surfaceAlt text-quishub-black"
                  : "text-quishub-faint cursor-not-allowed"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-4 pt-4 border-t border-quishub-border">
          <p className="text-xs font-semibold text-quishub-muted mb-3 uppercase tracking-wider">
            Select time slot
          </p>
          <div className="grid grid-cols-3 gap-2 max-h-[120px] overflow-y-auto">
            {TIME_SLOTS.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => handleTimeSelect(time)}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedTime === time
                    ? "bg-gradient-to-r from-[#7c3aed] to-[#2563eb] text-quishub-white"
                    : "bg-quishub-surfaceAlt hover:bg-quishub-border/50 text-quishub-black"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-quishub-border">
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-medium text-quishub-muted hover:text-quishub-black transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedTime}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#2563eb] text-quishub-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default function HealthcareBookingSystem() {
  const [activeTab, setActiveTab] = useState<"calendar" | "form">("calendar");
  
  const [bookingForm, setBookingForm] = useState({
    name: "",
    practice: "",
    email: "",
    phone: "",
    schedule: "",
    isoDate: "",
    time: "",
  });
  const [bookingState, setBookingState] = useState<{status: string; meetingLink?: string; message?: string}>({ status: "idle" });
  const [showCalendar, setShowCalendar] = useState(false);

  const [messageForm, setMessageForm] = useState({
    name: "",
    email: "",
    phone: "",
    practiceName: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [messageSubmitted, setMessageSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const updateBooking = (k: keyof typeof bookingForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setBookingForm((f) => ({ ...f, [k]: e.target.value }));

  const handleDateTimeSelect = (slot: SelectedSlot) => {
    setBookingForm((f) => ({ ...f, schedule: slot.label, isoDate: slot.isoDate, time: slot.time }));
    setShowCalendar(false);
  };

  const onBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingState.status === "loading") return;
    setBookingState({ status: "loading" });
    try {
      const res = await fetch("/api/healthcare-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bookingForm.name,
          practice: bookingForm.practice,
          email: bookingForm.email,
          phone: bookingForm.phone,
          schedule: bookingForm.schedule,
          isoDate: bookingForm.isoDate,
          time: bookingForm.time,
          bottleneck: "Scheduled via calendar booking",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBookingState({ status: "error", message: data?.error || "Submission failed." });
        return;
      }
      setBookingState({ status: "success", meetingLink: data.meetingLink });
      setBookingForm({ name: "", practice: "", email: "", phone: "", schedule: "", isoDate: "", time: "" });
    } catch {
      setBookingState({ status: "error", message: "Network error. Please try again." });
    }
  };

  const handleMessageSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    if (!messageForm.name.trim()) newErrors.name = true;
    if (!messageForm.email.trim() || !messageForm.email.includes("@"))
      newErrors.email = true;
    if (!messageForm.message.trim()) newErrors.message = true;

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
          name: messageForm.name,
          email: messageForm.email,
          phone: messageForm.phone,
          company: messageForm.practiceName,
          projectType: "Healthcare Diagnostic",
          budget: "",
          message: `Healthcare Practice: ${messageForm.practiceName}\n\nOperational Bottleneck:\n${messageForm.message}`,
        }),
      });

      if (response.ok) {
        setMessageSubmitted(true);
        setMessageForm({ name: "", email: "", phone: "", practiceName: "", message: "" });
      } else {
        setSubmitError("Failed to send message. Please try again or email us directly.");
      }
    } catch (error) {
      setSubmitError("Network error. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = "w-full rounded-xl border border-quishub-border bg-quishub-surfaceAlt text-quishub-black placeholder:text-quishub-faint px-4 py-3 text-[0.95rem] outline-none transition-all focus:border-[#2563eb] focus:bg-quishub-surface focus:ring-4 focus:ring-[#2563eb]/10";
  const labelCls = "block text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-quishub-muted mb-2";

  if (bookingState.status === "success") {
    return (
      <div className="rounded-2xl border border-quishub-border bg-quishub-surface p-8 md:p-12 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#7c3aed] to-[#2563eb] text-quishub-white">
          <CheckCircle size={24} />
        </div>
        <h3 className="font-semibold tracking-[-0.02em] text-2xl md:text-3xl text-quishub-black">You&apos;re booked.</h3>
        <p className="mt-3 text-quishub-muted max-w-md mx-auto leading-relaxed">
          A confirmation email is on its way to <span className="font-semibold text-quishub-black">{bookingForm.email}</span> with your meeting link.
        </p>
        <a href={bookingState.meetingLink} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#2563eb] px-6 py-3 text-sm font-semibold text-quishub-white hover:bg-gradient-to-r hover:from-[#7c3aed] hover:to-[#2563eb] transition-all">
          Join the diagnostic call<IconArrow className="h-3.5 w-3.5" />
        </a>
      </div>
    );
  }

  if (messageSubmitted) {
    return (
      <div className="rounded-2xl border border-quishub-border bg-quishub-surface p-8 md:p-12 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#7c3aed] to-[#2563eb] text-quishub-white">
          <CheckCircle size={24} />
        </div>
        <h3 className="font-semibold tracking-[-0.02em] text-2xl md:text-3xl text-quishub-black">Message sent!</h3>
        <p className="mt-3 text-quishub-muted max-w-md mx-auto leading-relaxed">
          We&apos;ll review your operational bottleneck and get back to you within 48 hours.
        </p>
        <button onClick={() => { setMessageSubmitted(false); setActiveTab("calendar"); }} className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#2563eb] px-6 py-3 text-sm font-semibold text-quishub-white hover:bg-gradient-to-r hover:from-[#7c3aed] hover:to-[#2563eb] transition-all">
          Book a call instead<IconArrow className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-quishub-border bg-quishub-surface p-8 md:p-10">
      <div className="flex justify-center mb-10">
        <div className="inline-flex rounded-xl p-1.5 relative bg-quishub-surfaceAlt border border-quishub-border">
          <button onClick={() => setActiveTab("calendar")} className={`relative z-10 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-300 cursor-pointer ${activeTab === "calendar" ? "text-quishub-white" : "text-quishub-muted hover:text-quishub-black"}`}>
            {activeTab === "calendar" && (<motion.div layoutId="healthcare-tab-indicator" className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#2563eb] shadow-[0_4px_14px_rgba(124,58,237,0.3)] -z-10" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />)}
            Book a Call
          </button>
          <button onClick={() => setActiveTab("form")} className={`relative z-10 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-300 cursor-pointer ${activeTab === "form" ? "text-quishub-white" : "text-quishub-muted hover:text-quishub-black"}`}>
            {activeTab === "form" && (<motion.div layoutId="healthcare-tab-indicator" className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#2563eb] shadow-[0_4px_14px_rgba(124,58,237,0.3)] -z-10" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />)}
            Send a Message
          </button>
        </div>
      </div>

      {activeTab === "calendar" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="grid grid-cols-1 lg:grid-cols-[1fr_2.4fr] gap-10 items-start">
          <div>
            <h2 className="font-semibold tracking-[-0.02em] text-quishub-black" style={{ fontSize: "clamp(22px, 3vw, 32px)" }}>
              Book a <span className="bg-gradient-to-r from-[#7c3aed] to-[#2563eb] bg-clip-text text-transparent">diagnostic call</span>
            </h2>
            <p className="mt-3 text-sm text-quishub-muted leading-relaxed">Select a date and time that works for you. We&apos;ll send a calendar invite with a meeting link immediately.</p>
            <ul className="mt-8 space-y-4">
              {[{icon: CalendarDays, text: "Pick a time that works for you"}, {icon: MessageSquare, text: "15-minute diagnostic call"}, {icon: CheckCircle, text: "Written diagnostic within 48 hours"}, {icon: Phone, text: "Private video room included"}].map((item) => {
                const Icon = item.icon;
                return (<li key={item.text} className="flex items-center gap-3 text-sm text-quishub-muted"><span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-quishub-surfaceAlt border border-quishub-border"><Icon size={15} className="text-quishub-black" /></span>{item.text}</li>);
              })}
            </ul>
            <div className="mt-8 rounded-xl border border-quishub-border bg-quishub-surfaceAlt p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-quishub-muted mb-2">Prefer email instead?</p>
              <a href="mailto:hello@quishub.com" className="text-sm text-quishub-black hover:opacity-70 transition-opacity duration-200">hello@quishub.com</a>
            </div>
          </div>
          <div>
            <form onSubmit={onBookingSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className={labelCls}>Full Name <span className="text-quishub-black">*</span></label><input type="text" required value={bookingForm.name} onChange={updateBooking("name")} placeholder="Dr. Jane Doe" className={inputCls} /></div>
                <div><label className={labelCls}>Practice / Hospital <span className="text-quishub-black">*</span></label><input type="text" required value={bookingForm.practice} onChange={updateBooking("practice")} placeholder="Acme Family Medicine" className={inputCls} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className={labelCls}>Professional Email <span className="text-quishub-black">*</span></label><input type="email" required value={bookingForm.email} onChange={updateBooking("email")} placeholder="jane@acmemed.com" className={inputCls} /></div>
                <div><label className={labelCls}>Phone Number</label><input type="tel" name="phone" value={bookingForm.phone} onChange={updateBooking("phone")} placeholder="Business Phone Number" className={inputCls} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <label className={labelCls}>Preferred Date &amp; Time <span className="text-quishub-black">*</span></label>
                  <button type="button" onClick={() => setShowCalendar(!showCalendar)} className={`${inputCls} text-left flex items-center justify-between ${!bookingForm.schedule ? "text-quishub-faint" : "text-quishub-black"}`}>
                    <span>{bookingForm.schedule || "Select date and time"}</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-quishub-muted"><path d="M8 2v4M16 2v4M3 8h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  {showCalendar && (<HealthcareCalendarPicker onSelect={handleDateTimeSelect} onClose={() => setShowCalendar(false)} />)}
                </div>
              </div>
              {bookingState.status === "error" && (<div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{bookingState.message}</div>)}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
                <p className="text-xs text-quishub-muted max-w-md">We respond within 48 hours with a written diagnostic. No pitch, no follow-up sequence.</p>
                <button type="submit" disabled={bookingState.status === "loading" || !bookingForm.schedule} className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#7c3aed] to-[#2563eb] px-7 py-3 text-sm font-semibold text-quishub-white whitespace-nowrap transition-all duration-300 hover:shadow-[0_18px_36px_-10px_rgba(37,99,235,0.45)] disabled:opacity-70 disabled:cursor-not-allowed">
                  <span className="absolute inset-0 bg-gradient-to-r from-[#7c3aed] to-[#2563eb] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  {bookingState.status === "loading" ? (<><svg viewBox="0 0 24 24" className="relative h-4 w-4 animate-spin" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" /><path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg><span className="relative">Booking...</span></>) : (<span className="relative">Book diagnostic call →</span>)}
                </button>
              </div>
              <p className="text-[11px] md:text-xs text-quishub-muted leading-normal mt-3 block text-left">
                By providing your phone number and clicking Submit, you agree to receive SMS messages from Quishub under our Terms and Conditions and Privacy Policy. Message and data rates may apply. Message frequency varies. You can opt out at any time by replying STOP, END, QUIT, UNSUBSCRIBE, or CANCEL.
              </p>
            </form>
          </div>
        </motion.div>
      )}

      {activeTab === "form" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch max-w-[960px] mx-auto">
          <div>
            <h2 className="font-semibold tracking-[-0.02em] text-quishub-black" style={{ fontSize: "clamp(22px, 3vw, 32px)" }}>Tell us about your <span className="bg-gradient-to-r from-[#7c3aed] to-[#2563eb] bg-clip-text text-transparent">operational challenge</span>.</h2>
            <p className="mt-3 text-sm text-quishub-muted leading-relaxed">Prefer to write it out first? Fill in the details and we&apos;ll get back to you within 24 hours. By submitting this form you agree to our <Link href="/privacy" className="underline hover:text-[#2563eb] transition-colors">Privacy Policy</Link> and <Link href="/terms" className="underline hover:text-[#2563eb] transition-colors">Terms & Conditions</Link>.</p>
            <div className="mt-8 space-y-4">
              <a href="mailto:hello@quishub.com" className="flex items-center gap-3 rounded-xl border border-quishub-border bg-quishub-surfaceAlt px-5 py-3 transition-all duration-300 hover:shadow-sm hover:border-[#7c3aed]/30 group">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-quishub-surfaceAlt border border-quishub-border text-[#7c3aed] transition-colors duration-300 group-hover:bg-gradient-to-br group-hover:from-[#7c3aed] group-hover:to-[#2563eb] group-hover:text-quishub-white"><Mail size={18} /></div>
                <span className="text-sm font-medium text-quishub-black">hello@quishub.com</span>
              </a>
              <div className="flex items-center gap-3 rounded-xl border border-quishub-border bg-quishub-surfaceAlt px-5 py-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-quishub-surfaceAlt border border-quishub-border text-[#7c3aed]"><Clock size={18} /></div>
                <span className="text-sm font-medium text-quishub-black">Written diagnostic within 48 hours</span>
              </div>
            </div>
            <div className="mt-10 rounded-xl border border-quishub-border bg-quishub-surfaceAlt p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-quishub-muted mb-2">Rather speak directly?</p>
              <button onClick={() => setActiveTab("calendar")} className="text-sm text-quishub-black hover:opacity-70 transition-opacity duration-200 cursor-pointer underline underline-offset-2">Book a diagnostic call  →</button>
            </div>
          </div>
          <div>
            <form onSubmit={handleMessageSubmit} className="space-y-5">
              <div><label className={labelCls}>Full Name <span className="text-quishub-black">*</span></label><input type="text" required placeholder="Dr. Jane Doe" className={`${inputCls} ${errors.name ? "border-red-500" : ""}`} value={messageForm.name} onChange={(e) => setMessageForm({ ...messageForm, name: e.target.value })} /></div>
              <div><label className={labelCls}>Email <span className="text-quishub-black">*</span></label><input type="email" required placeholder="jane@acmemed.com" className={`${inputCls} ${errors.email ? "border-red-500" : ""}`} value={messageForm.email} onChange={(e) => setMessageForm({ ...messageForm, email: e.target.value })} /></div>
              <div><label className={labelCls}>Phone number</label><p className="text-[11px] text-quishub-muted mb-1">(optional, for SMS follow-up)</p><input type="tel" name="phone" placeholder="Business Phone Number" className={inputCls} value={messageForm.phone} onChange={(e) => setMessageForm({ ...messageForm, phone: e.target.value })} /></div>
              <div><label className={labelCls}>PRACTICE / HOSPITAL</label><input type="text" placeholder="e.g., Acme Family Medicine" className={inputCls} value={messageForm.practiceName} onChange={(e) => setMessageForm({ ...messageForm, practiceName: e.target.value })} /></div>
              <div><label className={labelCls}>OPERATIONAL BOTTLENECK <span className="text-quishub-black">*</span></label><textarea rows={5} required placeholder="Where is your practice losing the most hours?" className={`${inputCls} resize-none ${errors.message ? "border-red-500" : ""}`} value={messageForm.message} onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })} /></div>
              {submitError && (<div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-600">{submitError}</div>)}
              <p className="text-[12px] md:text-[13px] text-quishub-muted font-normal leading-normal mb-4 block text-left">
                By providing your phone number and clicking Send Message, you agree to receive SMS messages from Quishub regarding scheduling consultations, follow-ups, sharing relevant materials, and responding to inquiries about Quishub workflow software. Message frequency may vary. Standard message and data rates may apply. Reply STOP to opt out. Reply HELP for help. Consent is not a condition of purchase. Your mobile information will not be sold or shared with third parties for promotional or marketing purposes. See our Privacy Policy at <Link href="/privacy" className="underline hover:text-[#2563eb] transition-colors">https://quishub.com/privacy</Link>.
              </p>
              <button type="submit" disabled={isSubmitting} className="w-full group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#7c3aed] to-[#2563eb] px-7 py-3 text-sm font-semibold text-quishub-white transition-all duration-300 hover:shadow-[0_18px_36px_-10px_rgba(37,99,235,0.45)] disabled:opacity-70 disabled:cursor-not-allowed">
                <span className="absolute inset-0 bg-gradient-to-r from-[#7c3aed] to-[#2563eb] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                {isSubmitting ? (<><svg viewBox="0 0 24 24" className="relative h-4 w-4 animate-spin" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" /><path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg><span className="relative">Sending...</span></>) : (<span className="relative">Send Message →</span>)}
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
}
