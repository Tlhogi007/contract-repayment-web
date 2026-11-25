import { useState } from 'react';
import type { SubmitEvent } from 'react';
import type { Contract } from '../api/types';
import { centsToZar, zarToCents } from '../lib/money';
import { FormActions } from './FormActions';
import { PrincipalField } from './PrincipalField';

interface EditDialogProps {
  busy: boolean;
  contract: Contract | null;
  onClose: () => void;
  onSave: (principalCents: number, expectedUpdatedAt: string) => Promise<void>;
}

export function EditDialog({
  busy,
  contract,
  onClose,
  onSave,
}: EditDialogProps): React.JSX.Element | null {
  if (!contract) {
    return null;
  }

  return (
    <EditDialogForm
      key={contract.id}
      busy={busy}
      contract={contract}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

interface EditDialogFormProps {
  busy: boolean;
  contract: Contract;
  onClose: () => void;
  onSave: (principalCents: number, expectedUpdatedAt: string) => Promise<void>;
}

function editIntroCopy(principalCents: number): string {
  return `Current ${centsToZar(principalCents)}. If someone else saved first, we’ll refresh the list.`;
}

function EditDialogHeader({
  principalCents,
}: {
  principalCents: number;
}): React.JSX.Element {
  return (
    <div>
      <h2 id="edit-dialog-title">Update principal</h2>
      <p className="muted">{editIntroCopy(principalCents)}</p>
    </div>
  );
}

function EditDialogForm({
  busy,
  contract,
  onClose,
  onSave,
}: EditDialogFormProps): React.JSX.Element {
  const [principal, setPrincipal] = useState(
    (contract.principalCents / 100).toFixed(2),
  );

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const cents = zarToCents(principal);
    await onSave(cents, contract.updatedAt);
  }

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onClick={onClose}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          onClose();
        }
      }}
    >
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-dialog-title"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <form className="stack" onSubmit={handleSubmit}>
          <EditDialogHeader principalCents={contract.principalCents} />
          <PrincipalField value={principal} onChange={setPrincipal} />
          <FormActions busy={busy} onCancel={onClose} />
        </form>
      </div>
    </div>
  );
}
