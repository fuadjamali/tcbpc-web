"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("falcon-theme", isDark ? "dark" : "light");
}

// Light/dark switch: a moon in light mode, a sun in dark mode (driven by the `.dark` class, so it
// is right on first paint with no client state).
export default function ThemeToggle({ className = "" }) {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Switch light or dark mode"
      title="Light / dark mode"
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-surface-alt ${className}`}
    >
      <IconMoon size={18} className="dark:hidden" />
      <IconSun size={18} className="hidden dark:block" />
    </button>
  );
}
