import { useCallback, useEffect, useRef, useState } from 'react';
import { errorMessage } from '../lib/errors';

const SUCCESS_MS = 3200;

export type ToastTone = 'ok' | 'error';

export interface ToastState {
  message: string;
  tone: ToastTone;
}

export interface UseToastResult {
  dismissToast: () => void;
  showError: (err: unknown) => void;
  showToast: (message: string) => void;
  toast: ToastState | null;
}

export function useToast(): UseToastResult {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback((): void => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = null;
  }, []);

  const dismissToast = useCallback((): void => {
    clearTimer();
    setToast(null);
  }, [clearTimer]);

  const showToast = useCallback(
    (message: string): void => {
      clearTimer();
      setToast({ message, tone: 'ok' });
      timerRef.current = setTimeout(() => {
        setToast(null);
        timerRef.current = null;
      }, SUCCESS_MS);
    },
    [clearTimer],
  );

  const showError = useCallback(
    (err: unknown): void => {
      clearTimer();
      // Errors stay until dismissed — user should read them.
      setToast({ message: errorMessage(err), tone: 'error' });
    },
    [clearTimer],
  );

  useEffect(() => {
    return (): void => {
      clearTimer();
    };
  }, [clearTimer]);

  return { dismissToast, showError, showToast, toast };
}
