import type { ReactNode } from 'react';

interface ActionRowProps {
  align?: 'start' | 'end';
  children: ReactNode;
}

/** Shared button-row layout used by card and form action groups. */
export function ActionRow({
  align = 'start',
  children,
}: ActionRowProps): React.JSX.Element {
  return <div className={align === 'end' ? 'row end' : 'row'}>{children}</div>;
}
