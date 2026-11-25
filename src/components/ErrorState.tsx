import { StatusPanel } from './StatusPanel';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  retryBusy?: boolean;
}

export function ErrorState({
  message,
  onRetry,
  retryBusy = false,
}: ErrorStateProps): React.JSX.Element {
  return (
    <StatusPanel
      role="alert"
      tone="danger"
      title="Couldn’t load contracts"
      copy={message}
      action={
        <button
          type="button"
          className="btn ghost"
          onClick={onRetry}
          disabled={retryBusy}
        >
          {retryBusy ? 'Retrying…' : 'Try again'}
        </button>
      }
    />
  );
}
