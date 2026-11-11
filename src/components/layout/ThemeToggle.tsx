'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);

    if (nextIsDark) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('theme', 'dark');
      } catch (_) {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('theme', 'light');
      } catch (_) {}
    }
  };

  if (!mounted) {
    return (
      <div className="h-8 w-8 rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)]" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme (default white)' : 'Switch to dark theme'}
      className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--gh-border)] bg-[var(--gh-bg-secondary)] text-[var(--gh-text-muted)] hover:text-[var(--yellow-bright)] hover:border-[var(--yellow-primary)]/60 transition active:scale-95 shadow-sm"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-[var(--yellow-bright)]" />
      ) : (
        <Moon className="h-4 w-4 text-[var(--gh-text)]" />
      )}
    </button>
  );
}
