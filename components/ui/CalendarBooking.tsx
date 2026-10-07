"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Globe, Check, CalendarDays } from "lucide-react";

// ── Available time slots (Mon–Fri) ──────────────────────────────────────────
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
  minDate.setDate(today.getDate() + 1); // at least tomorrow
  if (date < minDate) return false;
  const dow = date.getDay();
  return dow >= 1 && dow <= 5; // Mon–Fri only
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

export default function CalendarBooking() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDow = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  // Don't go before current month
  const canGoPrev =
    year > today.getFullYear() ||
    (year === today.getFullYear() && month > today.getMonth());

  const handleDateClick = (day: number) => {
    const d = new Date(year, month, day);
    if (!isAvailableDay(d)) return;
    setSelectedDate(d);
    setSelectedTime(null);
    setConfirmed(false);
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime || !clientName.trim() || !clientEmail.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: clientName.trim(),
          email: clientEmail.trim(),
          date: formatDate(selectedDate),
          time: selectedTime,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Booking failed");
      setConfirmed(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Build calendar grid cells
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full rows
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="rounded-lg overflow-hidden w-full border border-line bg-surface-2">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr]">
        {/* ── Calendar ──────────────────────────────────── */}
        <div className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-label-wide text-quishub-muted mb-1">
            Select a Day
          </p>

          {/* Month navigation */}
          <div className="flex items-center justify-between mt-4 mb-5">
            <button
              onClick={prevMonth}
              disabled={!canGoPrev}
              className="w-8 h-8 rounded-full flex items-center justify-center text-quishub-muted hover:text-quishub-black hover:bg-quishub-border/30 transition-colors duration-150 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-quishub-black">
              {MONTHS[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="w-8 h-8 rounded-full flex items-center justify-center text-quishub-muted hover:text-quishub-black hover:bg-quishub-border/30 transition-colors duration-150 cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-semibold uppercase tracking-label-wide text-quishub-muted py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Date grid */}
          <div className="grid grid-cols-7 gap-y-1 gap-x-1">
            {cells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />;
              const d = new Date(year, month, day);
              const available = isAvailableDay(d);
              const isSelected = selectedDate ? sameDay(d, selectedDate) : false;
              const isToday = sameDay(d, today);

              return (
                <motion.button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  disabled={!available}
                  whileHover={available && !isSelected ? { scale: 1.05 } : {}}
                  whileTap={available && !isSelected ? { scale: 0.95 } : {}}
                  className={`relative flex items-center justify-center h-10 w-full rounded-md text-sm font-medium transition-all duration-300 ${!available ? "cursor-default" : "cursor-pointer"}`}
                  style={
                    isSelected
                      ? {
                          background: "var(--ink)",
                          color: "var(--bg)",
                          border: "1px solid transparent"
                        }
                      : available
                      ? { 
                          color: "rgb(var(--quishub-black-rgb))",
                          background: "transparent",
                          border: "1px solid transparent"
                        }
                      : { 
                          color: "rgb(var(--quishub-faint-rgb))",
                          background: "transparent"
                        }
                  }
                  onMouseEnter={(e) => {
                    if (available && !isSelected) {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-subtle-bg)";
                      (e.currentTarget as HTMLButtonElement).style.border = "1px solid var(--surface-subtle-border)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (available && !isSelected) {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.border = "1px solid transparent";
                    }
                  }}
                >
                  {/* Today indicator */}
                  {isToday && !isSelected && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "var(--button-primary-bg)" }}
                    />
                  )}
                  {day}
                </motion.button>
              );
            })}
          </div>

          {/* Timezone */}
          <div className="mt-6 pt-5 border-t" style={{ borderColor: "var(--surface-divider)" }}>
            <p className="text-xs font-semibold uppercase tracking-label-wide text-quishub-muted mb-2">
              Time zone
            </p>
            <div className="flex items-center gap-2 text-sm text-quishub-muted">
              <Globe size={14} className="flex-shrink-0" />
              <span>Pakistan Standard Time (PKT, UTC+5)</span>
            </div>
          </div>
        </div>

        {/* Vertical divider */}
        <div style={{ background: "var(--surface-divider)" }} />

        {/* ── Time slots / Confirm ──────────────────────── */}
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {!selectedDate ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[260px] text-center gap-3"
              >
                <CalendarDays
                  size={36}
                  style={{ color: "rgb(var(--quishub-faint-rgb))" }}
                />
                <p className="text-sm text-quishub-muted">
                  Select an available date<br />to see open time slots.
                </p>
              </motion.div>
            ) : confirmed ? (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center h-full min-h-[260px] text-center gap-4"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: "var(--button-primary-bg)" }}
                >
                  <Check size={24} className="text-[#E5E5E4]" />
                </div>
                <div>
                  <p className="text-base font-semibold text-quishub-black">Request sent!</p>
                  <p className="mt-2 text-sm text-quishub-muted leading-body max-w-[240px] mx-auto">
                    Check your email app — a draft was prepared for{" "}
                    <span className="text-quishub-black font-medium">{selectedTime}</span> on{" "}
                    <span className="text-quishub-black font-medium">
                      {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                    </span>
                    .
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedDate(null);
                    setSelectedTime(null);
                    setConfirmed(false);
                  }}
                  className="text-xs text-quishub-muted hover:text-quishub-black transition-colors duration-150 underline underline-offset-2 cursor-pointer"
                >
                  Pick a different time
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={selectedDate.toISOString()}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22 }}
              >
                <p className="text-xs font-semibold uppercase tracking-label-wide text-quishub-muted mb-1">
                  Available times
                </p>
                <p className="text-sm font-medium text-quishub-black mb-5">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long", month: "long", day: "numeric",
                  })}
                </p>

                <div className="grid grid-cols-2 gap-2 mb-6">
                  {TIME_SLOTS.map((slot) => (
                    <motion.button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      whileHover={selectedTime !== slot ? { scale: 1.02 } : {}}
                      whileTap={{ scale: 0.98 }}
                      className="px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer"
                      style={
                        selectedTime === slot
                          ? {
                              background: "var(--ink)",
                              color: "var(--bg)",
                              border: "1px solid transparent"
                            }
                          : { 
                              background: "var(--surface-subtle-bg)", 
                              color: "rgb(var(--quishub-black-rgb))", 
                              border: "1px solid var(--surface-subtle-border)" 
                            }
                      }
                    >
                      {slot}
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence>
                  {selectedTime && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="flex flex-col gap-3"
                    >
                      <input
                        type="text"
                        placeholder="Your name"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg text-sm border transition-colors duration-200 outline-none focus:ring-2 focus:ring-[var(--signal-soft)]"
                        style={{
                          background: "var(--surface-subtle-bg)",
                          borderColor: "var(--surface-subtle-border)",
                          color: "rgb(var(--quishub-black-rgb))",
                        }}
                      />
                      <input
                        type="email"
                        placeholder="Your email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg text-sm border transition-colors duration-200 outline-none focus:ring-2 focus:ring-[var(--signal-soft)]"
                        style={{
                          background: "var(--surface-subtle-bg)",
                          borderColor: "var(--surface-subtle-border)",
                          color: "rgb(var(--quishub-black-rgb))",
                        }}
                      />
                      {error && (
                        <p className="text-xs text-red-400 text-center">{error}</p>
                      )}
                      <motion.button
                        onClick={handleConfirm}
                        disabled={loading || !clientName.trim() || !clientEmail.trim()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 rounded-md text-sm font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background: "var(--quishub-black)",
                          color: "var(--quishub-light)",
                          boxShadow: "var(--surface-card-shadow)",
                        }}
                      >
                        {loading ? "Booking..." : `Confirm — ${selectedTime}`}
                      </motion.button>
                      <p className="text-xs text-quishub-muted text-center">
                        We&apos;ll send a confirmation to your email
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
