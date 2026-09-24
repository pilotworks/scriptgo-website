import React, { useEffect, useState } from 'react';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('scriptgo_theme') as 'light' | 'dark' | null;
    const initial =
      saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('scriptgo_theme', next);
  };

  return (
    <button
      type="button"
      id="theme-btn"
      onClick={toggle}
      className="theme-toggle-link"
      aria-label="Toggle theme"
      style={{
        background: 'none',
        border: 'none',
        color: 'var(--fg)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px',
      }}
    >
      {theme === 'dark' ? (
        <svg
          width="22"
          height="22"
          viewBox="0 0 25 25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <path d="M13.5 4v3m9.5 6.5h-3M13.5 23v-3M7 13.5H4M9 9L7 7m13 0l-2 2m2 11l-2-2M7 20l2-2" />
          <circle cx="13.5" cy="13.5" r="4.5" fill="currentColor" />
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 25 25" fill="currentColor" strokeWidth="0">
          <path d="M10.1 6.6a8.08 8.08 0 00.24 11.06 8.08 8.08 0 0011.06.24c-6.46.9-12.2-4.84-11.3-11.3z" />
        </svg>
      )}
    </button>
  );
};
