import type { Contract } from '../api/types';
import { ActionRow } from './ActionRow';

interface ContractActionsProps {
  contract: Contract;
  onDelete: (contract: Contract) => void;
  onEdit: (contract: Contract) => void;
}

export function ContractActions({
  contract,
  onDelete,
  onEdit,
}: ContractActionsProps): React.JSX.Element {
  return (
    <ActionRow>
      <button
        type="button"
        className="btn ghost"
        onClick={() => {
          onEdit(contract);
        }}
      >
        Edit
      </button>
      <button
        type="button"
        className="btn danger"
        onClick={() => {
          onDelete(contract);
        }}
      >
        Delete
      </button>
    </ActionRow>
  );
}
