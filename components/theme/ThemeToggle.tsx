"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Theme = "light" | "dark";

const STORAGE_KEY = "quishub-theme";

function readTheme(): Theme {
  if (typeof document === "undefined") {
    return "light";
  }

  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export default function ThemeToggle() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("light");
  const isDark = theme === "dark";

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem(STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  };

  if (pathname.startsWith("/studio")) return null;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      className="theme-toggle-shell fixed right-3 top-1/2 z-[70] flex h-[78px] w-10 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-300 md:right-4"
    >
      <Sun
        size={14}
        className={`theme-toggle-icon absolute top-2.5 transition-colors duration-300 ${!isDark ? "text-quishub-white" : ""}`}
      />
      <Moon
        size={14}
        className={`theme-toggle-icon absolute bottom-2.5 transition-colors duration-300 ${isDark ? "text-quishub-white" : ""}`}
      />
      <span
        className={`theme-toggle-thumb absolute left-1 h-8 w-8 rounded-full transition-transform duration-300 ${isDark ? "translate-y-[18px]" : "-translate-y-[18px]"}`}
      />
    </button>
  );
}
