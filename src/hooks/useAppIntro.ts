import { useEffect, useState } from 'react';

const INTRO_MS = 750;

/** Short branded intro: waits for session boot + a minimum splash time. */
export function useAppIntro(sessionReady: boolean): boolean {
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMinElapsed(true);
    }, INTRO_MS);
    return (): void => {
      window.clearTimeout(timer);
    };
  }, []);

  return !(minElapsed && sessionReady);
}
