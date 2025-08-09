import { useEffect, useState } from 'react';

function applyTheme(dark: boolean) {
  const root = document.documentElement;
  if (dark) {
    root.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    root.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const initial = localStorage.getItem('theme') ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const darkPref = initial === 'dark';
    setDark(darkPref);
    applyTheme(darkPref);
  }, []);

  return (
    <button
      aria-label="Toggle theme"
      className="ml-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
      onClick={() => {
        setDark((d) => {
          applyTheme(!d);
          return !d;
        });
      }}
    >
      {dark ? '🌙' : '☀️'}
    </button>
  );
}