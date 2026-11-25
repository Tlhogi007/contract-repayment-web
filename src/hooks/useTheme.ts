import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function readStoredTheme(): Theme | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : null;
}

function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

export function resolveInitialTheme(): Theme {
  return readStoredTheme() ?? systemTheme();
}

export function useTheme(): {
  theme: Theme;
  toggleTheme: () => void;
} {
  const [theme, setTheme] = useState<Theme>(() => resolveInitialTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (): void => {
      if (readStoredTheme() !== null) {
        return;
      }
      const next = media.matches ? 'dark' : 'light';
      applyTheme(next);
      setTheme(next);
    };
    media.addEventListener('change', onChange);
    return (): void => {
      media.removeEventListener('change', onChange);
    };
  }, []);

  return {
    theme,
    toggleTheme: (): void => {
      setTheme((current): Theme => {
        const next = current === 'light' ? 'dark' : 'light';
        localStorage.setItem(STORAGE_KEY, next);
        return next;
      });
    },
  };
}
