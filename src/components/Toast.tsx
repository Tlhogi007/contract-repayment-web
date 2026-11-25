import type { ToastTone } from '../hooks/useToast';

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
  tone?: ToastTone;
}

export function Toast({
  message,
  onDismiss,
  tone = 'ok',
}: ToastProps): React.JSX.Element | null {
  if (!message) {
    return null;
  }
  return (
    <p
      className={tone === 'error' ? 'toast toast-error' : 'toast'}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <span>{message}</span>
      <button type="button" className="btn ghost" onClick={onDismiss}>
        Dismiss
      </button>
    </p>
  );
}
