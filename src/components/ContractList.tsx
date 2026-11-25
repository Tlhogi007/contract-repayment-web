import type { Contract } from '../api/types';
import { ContractCard } from './ContractCard';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { Loader } from './Loader';

interface ContractListProps {
  busy: boolean;
  contracts: Contract[];
  error: string | null;
  loading: boolean;
  nextCursor: string | null;
  onDelete: (contract: Contract) => void;
  onEdit: (contract: Contract) => void;
  onLoadMore: () => void;
  onRefresh: () => void;
}

export function ContractList({
  busy,
  contracts,
  error,
  loading,
  nextCursor,
  onDelete,
  onEdit,
  onLoadMore,
  onRefresh,
}: ContractListProps): React.JSX.Element {
  const showRefresh = !loading && !error && contracts.length > 0;

  let body: React.JSX.Element;
  if (loading) {
    body = <Loader label="Loading contracts" />;
  } else if (error && contracts.length === 0) {
    body = <ErrorState message={error} onRetry={onRefresh} retryBusy={busy} />;
  } else if (contracts.length === 0) {
    body = <EmptyState />;
  } else {
    body = (
      <ul className="contracts">
        {contracts.map((contract) => (
          <ContractCard
            key={contract.id}
            contract={contract}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </ul>
    );
  }

  return (
    <section className="block">
      <div className="list-head">
        <h2>Contracts</h2>
        {showRefresh ? (
          <button
            type="button"
            className="btn ghost"
            onClick={onRefresh}
            disabled={busy}
          >
            Refresh
          </button>
        ) : null}
      </div>

      {body}

      {nextCursor ? (
        <button
          type="button"
          className="btn ghost"
          onClick={onLoadMore}
          disabled={busy}
        >
          Load more
        </button>
      ) : null}
    </section>
  );
}
