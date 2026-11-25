import type { Contract } from '../api/types';
import { ContractActions } from './ContractActions';
import { ContractOptionsTable } from './ContractOptionsTable';
import { ContractSummary } from './ContractSummary';

interface ContractCardProps {
  contract: Contract;
  onDelete: (contract: Contract) => void;
  onEdit: (contract: Contract) => void;
}

export function ContractCard({
  contract,
  onDelete,
  onEdit,
}: ContractCardProps): React.JSX.Element {
  return (
    <li className="contract">
      <div className="contract-head">
        <ContractSummary contract={contract} />
        <ContractActions
          contract={contract}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </div>
      <ContractOptionsTable options={contract.options} />
    </li>
  );
}
