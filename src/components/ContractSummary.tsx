import type { Contract } from '../api/types';
import { centsToZar } from '../lib/money';

interface ContractSummaryProps {
  contract: Contract;
}

export function ContractSummary({
  contract,
}: ContractSummaryProps): React.JSX.Element {
  return (
    <div>
      <p className="money">{centsToZar(contract.principalCents)}</p>
      <p className="muted">
        {(contract.annualRate * 100).toFixed(1)}% amortized
      </p>
    </div>
  );
}
