import { StatusPanel } from './StatusPanel';

export function EmptyState(): React.JSX.Element {
  return (
    <StatusPanel
      title="Nothing priced yet"
      copy="Create a contract above to compare 12 / 24 / 36-month quotes at 6.5%."
    />
  );
}
