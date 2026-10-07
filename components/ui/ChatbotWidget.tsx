"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ─── CONFIG ─── */
const BRAND = {
  name: "Quishub",
  tagline: "Ask about your workflow",
  status: "Typically replies fast",
  botReply:
    "Thanks for reaching out! Our team will get back to you soon. You can also book a discovery call directly.",
  calendlyUrl: "https://calendly.com/your-link",
  welcomeMessages: [
    "Hi, this is Quishub. Ask about our work, or tell us what's slowing your business down.",
    "Want to talk about a project? Drop us a message or book a discovery call. We typically respond within 24 hours.",
  ],
};

const QUICK_ACTIONS = [
  { label: "Book Discovery Call", icon: "calendar", action: "calendly" },
  { label: "Contact Support", icon: "headset", action: "support" },
];

const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

/* ─── ICONS (inline SVG) ─── */
const Icons: Record<string, React.ReactNode> = {
  chat: (
    <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  close: (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  send: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  ),
  calendar: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  headset: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a5 5 0 01-.354-7.426M3 21l2.636-2.636m0 0a9 9 0 010-12.728" />
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  ),
  sound: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6l-4 4H4v4h4l4 4V6z" />
    </svg>
  ),
  mute: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
  ),
  sun: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="5"/><path strokeLinecap="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  ),
  moon: (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
    </svg>
  ),
};

/* ─── HELPERS ─── */
const ts = () => {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const playPop = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {}
};

const renderMessageText = (text: string) => {
  if (!text) return "";
  let processed = text.replace(/(^|\n)\*\s+/g, "$1• ");
  processed = processed.replace(/(^|\n)-\s+/g, "$1• ");
  const parts = processed.split("**");
  if (parts.length === 1) return processed;
  return parts.map((part, index) => {
    if (index % 2 !== 0) {
      return (
        <strong key={index} style={{ fontWeight: 700, color: "inherit" }}>
          {part}
        </strong>
      );
    }
    return part;
  });
};

interface Message {
  from: "bot" | "user";
  text: string;
  time: string;
}

/* ─── MAIN COMPONENT ─── */
import { useRouter } from "next/navigation";

export default function ChatbotWidget() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [sound, setSound] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [awaitingSupportEmail, setAwaitingSupportEmail] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* welcome messages on first open */
  const hasGreeted = useRef(false);
  useEffect(() => {
    if (open && !hasGreeted.current) {
      hasGreeted.current = true;
      BRAND.welcomeMessages.forEach((text, i) => {
        setTimeout(() => {
          setMessages((prev) => [...prev, { from: "bot", text, time: ts() }]);
          if (sound) playPop();
        }, (i + 1) * 700);
      });
    }
  }, [open, sound]);

  /* auto-scroll */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  /* mount animation */
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
    }
  }, [open]);

  /* focus input on open */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 350);
  }, [open]);

  const botReply = useCallback(
    (text: string) => {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [...prev, { from: "bot", text, time: ts() }]);
        if (sound) playPop();
      }, 1400);
    },
    [sound]
  );

  const handleSend = async () => {
  const trimmed = input.trim();
  if (!trimmed) return;

  const newUserMessage: Message = { from: "user", text: trimmed, time: ts() };
  const nextMessages = [...messages, newUserMessage];
  setMessages(nextMessages);
  setInput("");
  setTyping(true);

  try {
    if (awaitingSupportEmail && !emailRegex.test(trimmed)) {
      setMessages((prev) => [...prev, { from: "bot", text: "Please share a valid email address so our team can contact you.", time: ts() }]);
      setTyping(false);
      return;
    }

    const payloadMessages = nextMessages
      .filter((message) => message.text.trim())
      .slice(-12)
      .map((message) => ({
        role: message.from === "user" ? "user" : "model",
        content: message.text,
      }));

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ messages: payloadMessages, supportRequest: awaitingSupportEmail && emailRegex.test(trimmed) }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      throw new Error(data.error || "Backend failed");
    }

    setMessages((prev) => [...prev, { from: "bot", text: data.text, time: ts() }]);
    if (awaitingSupportEmail && emailRegex.test(trimmed)) {
      setAwaitingSupportEmail(false);
    }

  } catch (error) {
    console.error("Frontend Connection Error:", error);
    setMessages((prev) => [...prev, { from: "bot", text: "Connecting with Qushub AI and live support...", time: ts() }]);
  } finally {
    setTyping(false);
  }
};
  const handleQuickAction = (action: string) => {
    if (action === "calendly") {
      setOpen(false);
      router.push("/contact");
      return;
    }
    if (action === "support") {
      setAwaitingSupportEmail(true);
      setMessages((prev) => [
        ...prev,
        { from: "user", text: "I'd like to contact support.", time: ts() },
        { from: "bot", text: "Sure — please share your email address and I'll send it directly to our support team.", time: ts() },
      ]);
    }
  };

  /* ─── THEME TOKENS ─── */
  const t = dark
    ? {
        // Matches the site's ink sections
        panel: "rgba(18,16,20,0.97)",
        panelSolid: "#121014",
        header: "#121014",
        bubbleBot: "rgba(241,238,232,0.07)",
        bubbleBotText: "#f1eee8",
        bubbleUser: "#f1eee8",
        bubbleUserText: "#121014",
        inputBg: "rgba(241,238,232,0.05)",
        inputBorder: "rgba(241,238,232,0.14)",
        inputText: "#f1eee8",
        placeholder: "rgba(241,238,232,0.4)",
        border: "rgba(241,238,232,0.1)",
        muted: "rgba(241,238,232,0.55)",
        accent: "#6f9bff",
        accentHover: "#9ab8ff",
        quickBg: "transparent",
        quickBorder: "rgba(241,238,232,0.2)",
        quickText: "#f1eee8",
        scrollThumb: "rgba(241,238,232,0.14)",
        fabGradient: "#f1eee8",
        shadow: "0 24px 60px rgba(0,0,0,0.5)",
        backdrop: "blur(20px)",
      }
    : {
        // Matches the site's paper & ink palette
        panel: "rgba(244,242,238,0.97)",
        panelSolid: "#f4f2ee",
        header: "#f4f2ee",
        bubbleBot: "rgba(22,14,32,0.06)",
        bubbleBotText: "#160e20",
        bubbleUser: "#160e20",
        bubbleUserText: "#f4f2ee",
        inputBg: "#faf9f6",
        inputBorder: "rgba(22,14,32,0.14)",
        inputText: "#160e20",
        placeholder: "rgba(22,14,32,0.4)",
        border: "rgba(22,14,32,0.1)",
        muted: "rgba(22,14,32,0.55)",
        accent: "#2563eb",
        accentHover: "#1d4fc4",
        quickBg: "transparent",
        quickBorder: "rgba(22,14,32,0.18)",
        quickText: "#160e20",
        scrollThumb: "rgba(22,14,32,0.15)",
        fabGradient: "#160e20",
        shadow: "0 24px 60px -20px rgba(22,14,32,0.3)",
        backdrop: "blur(20px)",
      };
  const fabInk = dark ? "#121014" : "#f4f2ee";

  /* ─── STYLES ─── */
  const css: Record<string, any> = {
    wrapper: {
      position: "fixed",
      bottom: "var(--chat-wrapper-bottom, 24px)",
      right: "var(--chat-wrapper-right, 24px)",
      zIndex: 99999,
      fontFamily: "var(--font-sora), system-ui, -apple-system, sans-serif",
    },
    fab: {
      width: 52,
      height: 52,
      borderRadius: 14,
      background: open ? t.panelSolid : t.fabGradient,
      border: `1px solid ${open ? t.inputBorder : "transparent"}`,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: open ? t.inputText : fabInk,
      boxShadow: "0 8px 24px -10px rgba(22,14,32,0.45)",
      transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), background 0.2s, color 0.2s",
      transform: "scale(1)",
      opacity: 1,
      position: "absolute",
      bottom: 0,
      right: 0,
      zIndex: 9999,
    },
    panel: {
      position: "absolute",
      bottom: "var(--chat-panel-bottom, 76px)",
      right: 0,
      width: "var(--chat-panel-width, 380px)",
      maxWidth: "var(--chat-panel-max-width, calc(100vw - 32px))",
      height: "var(--chat-panel-height, 560px)",
      maxHeight: "var(--chat-panel-max-height, calc(100vh - 120px))",
      background: t.panel,
      backdropFilter: t.backdrop,
      WebkitBackdropFilter: t.backdrop,
      borderRadius: 14,
      boxShadow: t.shadow,
      border: `1px solid ${t.border}`,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      transformOrigin: "bottom right",
      transform: mounted ? "scale(1) translateY(0)" : "scale(0.75) translateY(20px)",
      opacity: mounted ? 1 : 0,
      transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease",
      pointerEvents: open ? "auto" : "none",
    },
    header: {
      background: t.header,
      padding: "18px 20px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      borderBottom: `1px solid ${t.border}`,
      flexShrink: 0,
    },
    avatar: {
      width: 42,
      height: 42,
      borderRadius: 10,
      background: t.bubbleBot,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: t.inputText,
      fontSize: 18,
      fontWeight: 700,
      flexShrink: 0,
    },
    headerInfo: { flex: 1, minWidth: 0 },
    headerName: {
      fontSize: 15,
      fontWeight: 700,
      color: dark ? "#e5e5e4" : "#160e20",
      letterSpacing: "-0.01em",
    },
    headerSub: { fontSize: 12, color: t.muted, marginTop: 1 },
    headerBtn: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: "transparent",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: t.muted,
      transition: "all 0.2s",
      flexShrink: 0,
    },
    body: {
      flex: 1,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      padding: "16px 16px 8px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      scrollbarWidth: "thin",
      scrollbarColor: `${t.scrollThumb} transparent`,
    },
    msgRow: (isUser: boolean) => ({
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      alignItems: "flex-end",
      gap: 8,
      animation: "msgIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
    }),
    botIcon: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: t.bubbleBot,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: t.inputText,
      fontSize: 11,
      fontWeight: 800,
      flexShrink: 0,
    },
    bubble: (isUser: boolean) => ({
      maxWidth: "78%",
      padding: "10px 14px",
      borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
      background: isUser ? t.bubbleUser : t.bubbleBot,
      color: isUser ? t.bubbleUserText : t.bubbleBotText,
      fontSize: 13.5,
      lineHeight: 1.55,
      wordBreak: "break-word",
      whiteSpace: "pre-wrap",
    }),
    time: {
      fontSize: 10,
      color: t.muted,
      marginTop: 2,
      padding: "0 4px",
    },
    typingWrap: {
      display: "flex",
      alignItems: "flex-end",
      gap: 8,
      animation: "msgIn 0.3s ease both",
    },
    typingBubble: {
      padding: "12px 18px",
      borderRadius: "16px 16px 16px 4px",
      background: t.bubbleBot,
      display: "flex",
      gap: 5,
      alignItems: "center",
    },
    dot: (i: number) => ({
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: t.accent,
      opacity: 0.6,
      animation: `bounce 1.2s ${i * 0.15}s ease-in-out infinite`,
    }),
    quickActions: {
      padding: "8px 16px 12px",
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      borderTop: `1px solid ${t.border}`,
      flexShrink: 0,
    },
    quickBtn: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "7px 13px",
      borderRadius: 10,
      background: t.quickBg,
      border: `1px solid ${t.quickBorder}`,
      color: t.quickText,
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s",
      whiteSpace: "nowrap",
    },
    inputArea: {
      padding: "12px 16px",
      borderTop: `1px solid ${t.border}`,
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexShrink: 0,
    },
    input: {
      flex: 1,
      background: t.inputBg,
      border: `1px solid ${t.inputBorder}`,
      borderRadius: 12,
      padding: "10px 14px",
      fontSize: "var(--chat-input-font-size, 13.5px)",
      color: t.inputText,
      outline: "none",
      transition: "border-color 0.2s",
      fontFamily: "inherit",
    },
    sendBtn: {
      width: 40,
      height: 40,
      borderRadius: 10,
      background: t.fabGradient,
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: fabInk,
      transition: "all 0.2s",
      flexShrink: 0,
      opacity: input.trim() ? 1 : 0.4,
    },
  };

  const keyframes = `
    @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
    @keyframes msgIn { from{opacity:0;transform:translateY(8px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }

    @media (max-width: 640px) {
      .chatbot-widget {
        --chat-wrapper-bottom: 16px;
        --chat-wrapper-right: 16px;
        --chat-panel-bottom: 72px;
        --chat-panel-width: calc(100vw - 32px);
        --chat-panel-max-width: 380px;
        --chat-panel-max-height: calc(100vh - 100px);
        --chat-input-font-size: 16px;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      <div style={css.wrapper} className="chatbot-widget">
        {/* ── PANEL ── */}
        {open && (
          <div style={css.panel}>
            <div style={css.header}>
              <div style={css.avatar}>
                <img src="/favicon.png" alt="Quishub Logo" width="24" height="24" style={{ borderRadius: '50%' }} />
              </div>
              <div style={css.headerInfo}>
                <div style={css.headerName}>{BRAND.name}</div>
                <div style={css.headerSub}>
                  {BRAND.tagline} · {BRAND.status}
                </div>
              </div>
              <button
                style={css.headerBtn}
                onClick={() => setSound(!sound)}
                title={sound ? "Mute" : "Unmute"}
                onMouseEnter={(e) => (e.currentTarget.style.background = t.quickBg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {sound ? Icons.sound : Icons.mute}
              </button>
              <button
                style={css.headerBtn}
                onClick={() => setDark(!dark)}
                title={dark ? "Light mode" : "Dark mode"}
                onMouseEnter={(e) => (e.currentTarget.style.background = t.quickBg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {dark ? Icons.sun : Icons.moon}
              </button>
            </div>

            {/* messages */}
            <div style={css.body} ref={scrollRef}>
              {messages.map((m, i) => (
                <div key={i}>
                  <div style={css.msgRow(m.from === "user")}>
                    {m.from === "bot" && (
                      <div style={css.botIcon}>
                        <img src="/favicon.png" alt="Quishub Logo" width="16" height="16" />
                      </div>
                    )}
                    <div style={css.bubble(m.from === "user")}>{renderMessageText(m.text)}</div>
                  </div>
                  <div
                    style={{
                      ...css.time,
                      textAlign: m.from === "user" ? "right" : "left",
                      paddingLeft: m.from === "bot" ? 38 : 4,
                    }}
                  >
                    {m.time}
                  </div>
                </div>
              ))}
              {typing && (
                <div style={css.typingWrap}>
                  <div style={css.botIcon}>
                    <img src="/favicon.png" alt="Quishub Logo" width="16" height="16" />
                  </div>
                  <div style={css.typingBubble}>
                    <div style={css.dot(0)} />
                    <div style={css.dot(1)} />
                    <div style={css.dot(2)} />
                  </div>
                </div>
              )}
            </div>

            {/* quick actions */}
            <div style={css.quickActions}>
              {QUICK_ACTIONS.map((qa) => (
                <button
                  key={qa.action}
                  style={css.quickBtn}
                  onClick={() => handleQuickAction(qa.action)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = t.fabGradient;
                    e.currentTarget.style.color = fabInk;
                    e.currentTarget.style.borderColor = t.fabGradient;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = t.quickBg;
                    e.currentTarget.style.color = t.quickText;
                    e.currentTarget.style.borderColor = t.quickBorder;
                  }}
                >
                  {Icons[qa.icon]}
                  {qa.label}
                </button>
              ))}
            </div>

            {/* input */}
            <div style={css.inputArea}>
              <input
                ref={inputRef}
                aria-label="Message"
                style={css.input}
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                onFocus={(e) => (e.target.style.borderColor = t.accent)}
                onBlur={(e) => (e.target.style.borderColor = t.inputBorder)}
              />
              <button
                style={css.sendBtn}
                onClick={handleSend}
                disabled={!input.trim()}
                aria-label="Send message"
                onMouseEnter={(e) =>
                  input.trim() && (e.currentTarget.style.transform = "scale(1.08)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {Icons.send}
              </button>
            </div>
          </div>
        )}

        {/* ── FAB ── */}
        <button
          style={css.fab}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close chat" : "Chat with Quishub"}
          aria-expanded={open}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          {open ? Icons.close : Icons.chat}
        </button>
      </div>
    </>
  );
}
