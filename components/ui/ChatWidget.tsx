"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import Image from "next/image";

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    from: "bot",
    text: "Hey! 👋 Welcome to Quishub. We build production-ready AI systems.",
  },
  {
    id: 2,
    from: "bot",
    text: "Want to talk about a project? Drop us a message or book a discovery call — we typically respond within 24 hours.",
  },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [messages, open]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { id: Date.now(), from: "user", text: trimmed }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "bot",
          text: "Thanks for reaching out! Our team will get back to you soon. You can also book a discovery call directly.",
        },
      ]);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[340px] sm:w-[380px] rounded-2xl overflow-hidden"
            style={{
              background: "var(--surface-card-bg)",
              border: "1px solid var(--surface-card-border)",
              boxShadow: "0 24px 64px rgba(22,14,32,0.22)",
            }}
          >
            {/* Header — branding only, no action buttons */}
            <div
              className="flex items-center gap-3 px-4 py-4"
              style={{ background: "var(--button-primary-bg)" }}
            >
              <div
                className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.12)" }}
              >
                <Image
                  src="/favicon.png"
                  alt="Quishub"
                  width={26}
                  height={26}
                  className="rounded-sm"
                />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-quishub-light leading-tight">
                  Quishub
                </p>
                <p className="text-[11px] leading-tight" style={{ color: "rgba(229,230,229,0.6)" }}>
                  AI Product Studio &nbsp;•&nbsp; Typically replies fast
                </p>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex flex-col gap-3 px-4 py-4 overflow-y-auto"
              style={{ maxHeight: "300px" }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.from === "bot" && (
                    <div
                      className="w-6 h-6 rounded-full flex-shrink-0 mr-2 mt-0.5 flex items-center justify-center overflow-hidden"
                      style={{ background: "var(--button-primary-bg)" }}
                    >
                      <Image src="/favicon.png" alt="Q" width={14} height={14} className="rounded-sm" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.from === "user" ? "rounded-br-sm text-quishub-light" : "rounded-bl-sm text-quishub-black"
                    }`}
                    style={
                      msg.from === "user"
                        ? { background: "var(--button-primary-bg)" }
                        : { background: "var(--surface-subtle-bg)", border: "1px solid var(--surface-subtle-border)" }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* CTA strip */}
            <div
              className="px-4 py-2.5 border-t"
              style={{ borderColor: "var(--surface-divider)" }}
            >
              <a
                href="/contact"
                className="text-xs text-quishub-muted hover:text-quishub-black transition-colors duration-200 underline underline-offset-2"
              >
                Book a discovery call directly →
              </a>
            </div>

            {/* Input */}
            <div
              className="flex items-center gap-2 px-4 py-3 border-t"
              style={{ borderColor: "var(--surface-divider)" }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message…"
                className="flex-1 bg-transparent text-sm text-quishub-black placeholder:text-quishub-faint focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ background: "var(--button-primary-bg)" }}
                aria-label="Send message"
              >
                <Send size={14} className="text-quishub-light" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button — toggles open/close */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center cursor-pointer focus:outline-none"
        style={{ background: "var(--button-primary-bg)" }}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="x"
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.18 }}
            >
              <X size={24} className="text-quishub-light" />
            </motion.span>
          ) : (
            <motion.span
              key="logo"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.18 }}
            >
              <Image
                src="/favicon.png"
                alt="Chat with Quishub"
                width={38}
                height={38}
                className="rounded-md"
              />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
