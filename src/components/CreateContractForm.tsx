import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { errorMessage } from '../lib/errors';
import { zarToCents } from '../lib/money';
import { PRINCIPAL_INPUT_ID, PrincipalField } from './PrincipalField';

export { PRINCIPAL_INPUT_ID };

interface CreateContractFormProps {
  busy: boolean;
  onCreate: (principalCents: number) => void;
  onInvalid: (message: string) => void;
}

export function CreateContractForm({
  busy,
  onCreate,
  onInvalid,
}: CreateContractFormProps): React.JSX.Element {
  const [principal, setPrincipal] = useState('1000.00');

  function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();
    try {
      onCreate(zarToCents(principal));
    } catch (err) {
      onInvalid(errorMessage(err));
    }
  }

  return (
    <section className="block">
      <h2>New contract</h2>
      <form className="inline-form" onSubmit={handleSubmit}>
        <PrincipalField
          id={PRINCIPAL_INPUT_ID}
          labelClassName="grow"
          value={principal}
          onChange={setPrincipal}
        />
        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? 'Creating…' : 'Create'}
        </button>
      </form>
    </section>
  );
}
