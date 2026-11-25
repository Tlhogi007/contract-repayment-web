import type { ContractOption } from '../api/types';
import { centsToZar } from '../lib/money';

interface ContractOptionsTableProps {
  options: ContractOption[];
}

export function ContractOptionsTable({
  options,
}: ContractOptionsTableProps): React.JSX.Element {
  return (
    <table>
      <thead>
        <tr>
          <th>Term</th>
          <th>Monthly</th>
          <th>Total</th>
          <th>Interest</th>
        </tr>
      </thead>
      <tbody>
        {options.map((opt) => (
          <tr key={opt.termMonths}>
            <td>{opt.termMonths} mo</td>
            <td className="money">{centsToZar(opt.monthlyPaymentCents)}</td>
            <td className="money">{centsToZar(opt.totalPayableCents)}</td>
            <td className="money">{centsToZar(opt.totalInterestCents)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
