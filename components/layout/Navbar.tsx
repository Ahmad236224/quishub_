"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Logo from "@/components/brand/Logo";
import Arrow from "@/components/system/Arrow";

const links = [
  { href: "/work", label: "Work", match: "/work" },
  { href: "/services", label: "Services", match: "/services" },
  { href: "/about", label: "About", match: "/about" },
  { href: "/healthcare?from=quishub", label: "Healthcare", match: "/healthcare" },
  { href: "/blog", label: "Insights", match: "/blog" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // True while a section marked data-nav-theme="dark" (the home hero) sits under the bar.
  const [overDark, setOverDark] = useState(false);
  const [open, setOpen] = useState(false);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const dark = document.querySelector<HTMLElement>('[data-nav-theme="dark"]')?.getBoundingClientRect();
      setOverDark(Boolean(dark && dark.top <= 0 && dark.bottom > 60));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    document.body.dataset.menu = "open";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      delete document.body.dataset.menu;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (pathname.startsWith("/studio")) return null;

  const isActive = (m: string) => pathname === m || pathname.startsWith(m + "/");

  return (
    <header
      data-theme={overDark && !open ? "dark" : undefined}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-b border-line bg-[var(--nav-bg-scrolled)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className={cn("wrap flex items-center justify-between transition-[height] duration-300", scrolled ? "h-[60px]" : "h-[72px] md:h-[84px]")} aria-label="Main">
        <Link href="/" className="-m-2 p-2" aria-label="Quishub home">
          <Logo priority className="h-7 md:h-8" />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={isActive(l.match) ? "page" : undefined}
                className={cn(
                  "relative font-ui text-[15px] transition-colors",
                  isActive(l.match) ? "text-ink" : "text-mute hover:text-ink",
                  "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-ink after:transition-transform after:duration-300",
                  isActive(l.match) ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="group hidden h-10 items-center gap-2 rounded-md bg-ink px-4 font-ui text-[14.5px] font-medium text-background transition-colors hover:bg-ink-2 lg:inline-flex"
          >
            Start a project <Arrow className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span className="relative block h-3 w-6" aria-hidden="true">
              <span className={cn("absolute left-0 h-px w-6 bg-ink transition-transform duration-300", open ? "top-1.5 rotate-45" : "top-0")} />
              <span className={cn("absolute left-0 h-px w-6 bg-ink transition-transform duration-300", open ? "top-1.5 -rotate-45" : "top-3")} />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className={cn(
          "overflow-y-auto border-t border-line bg-background lg:hidden",
          scrolled ? "h-[calc(100dvh-60px)]" : "h-[calc(100dvh-72px)]"
        )}
      >
        <div className="wrap flex h-full flex-col justify-between py-8">
          <ul>
            {links.map((l, i) => (
              <li key={l.href} className="border-b border-line">
                <Link
                  ref={i === 0 ? firstLink : undefined}
                  href={l.href}
                  aria-current={isActive(l.match) ? "page" : undefined}
                  className="flex items-baseline justify-between py-4 font-display text-[34px] font-medium tracking-[-0.02em] text-ink"
                >
                  {l.label}
                  <span className="font-mono text-[12px] text-mute">{String(i + 1).padStart(2, "0")}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="space-y-5 pt-10">
            <Link href="/contact" className="flex h-12 items-center justify-center gap-2 rounded-md bg-ink font-ui text-[16px] font-medium text-background">
              Start a project <Arrow />
            </Link>
            <a href="mailto:hello@quishub.com" className="block text-center font-mono text-[13px] text-mute">
              hello@quishub.com
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
