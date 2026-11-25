import type { ReactNode } from 'react';

type StatusTone = 'neutral' | 'danger';

interface StatusPanelProps {
  action?: ReactNode;
  children?: ReactNode;
  copy?: string;
  role?: 'status' | 'alert';
  title?: string;
  tone?: StatusTone;
}

/** Shared empty / error / loading shell (composition over duplicated panels). */
export function StatusPanel({
  action,
  children,
  copy,
  role = 'status',
  title,
  tone = 'neutral',
}: StatusPanelProps): React.JSX.Element {
  const className =
    tone === 'danger' ? 'status-panel status-panel-danger' : 'status-panel';

  return (
    <div
      className={className}
      role={role}
      aria-live={role === 'status' ? 'polite' : undefined}
    >
      {children}
      {title ? <p className="status-title">{title}</p> : null}
      {copy ? <p className="status-copy">{copy}</p> : null}
      {action}
    </div>
  );
}
