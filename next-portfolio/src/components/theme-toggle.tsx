"use client";

import { useEffect, useState } from "react";
import { MoonStar, SunMedium } from "lucide-react";

const storageKey = "portfolio-theme";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextTheme = !root.classList.contains("dark");

    root.classList.toggle("dark", nextTheme);
    localStorage.setItem(storageKey, nextTheme ? "dark" : "light");
    setIsDark(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--background)_80%,var(--accent))] px-4 py-2 text-sm font-semibold text-[color:var(--accent-foreground)] shadow-[var(--shadow-soft)] transition-transform duration-300 hover:-translate-y-0.5"
      aria-label="Toggle color theme"
    >
      {isDark ? <MoonStar className="size-4" /> : <SunMedium className="size-4" />}
      <span className="font-mono text-xs uppercase tracking-[0.22em]">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
