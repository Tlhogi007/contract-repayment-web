interface TextFieldProps {
  autoComplete?: string;
  className?: string;
  id?: string;
  label: string;
  min?: number | string;
  minLength?: number;
  onChange: (value: string) => void;
  required?: boolean;
  step?: number | string;
  type?: React.HTMLInputTypeAttribute;
  value: string;
}

export function TextField({
  autoComplete,
  className,
  id,
  label,
  min,
  minLength,
  onChange,
  required = false,
  step,
  type = 'text',
  value,
}: TextFieldProps): React.JSX.Element {
  return (
    <label className={className} htmlFor={id}>
      {label}
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        min={min}
        minLength={minLength}
        step={step}
        required={required}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </label>
  );
}
