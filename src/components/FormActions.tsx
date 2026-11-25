import { ActionRow } from './ActionRow';

interface FormActionsProps {
  busy?: boolean;
  busyLabel?: string;
  cancelLabel?: string;
  onCancel: () => void;
  submitLabel?: string;
}

/** Cancel + primary submit row for dialogs and multi-step forms. */
export function FormActions({
  busy = false,
  busyLabel = 'Saving…',
  cancelLabel = 'Cancel',
  onCancel,
  submitLabel = 'Save',
}: FormActionsProps): React.JSX.Element {
  return (
    <ActionRow align="end">
      <button type="button" className="btn ghost" onClick={onCancel}>
        {cancelLabel}
      </button>
      <button type="submit" className="btn primary" disabled={busy}>
        {busy ? busyLabel : submitLabel}
      </button>
    </ActionRow>
  );
}
