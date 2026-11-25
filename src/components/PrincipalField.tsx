import { TextField } from './TextField';

export const PRINCIPAL_INPUT_ID = 'principal-input';

interface PrincipalFieldProps {
  id?: string;
  labelClassName?: string;
  onChange: (value: string) => void;
  value: string;
}

/** Shared ZAR principal input used by create + edit flows. */
export function PrincipalField({
  id,
  labelClassName,
  onChange,
  value,
}: PrincipalFieldProps): React.JSX.Element {
  return (
    <TextField
      id={id}
      className={labelClassName}
      label="Principal (ZAR)"
      type="number"
      min="0.01"
      step="0.01"
      required
      value={value}
      onChange={onChange}
    />
  );
}
