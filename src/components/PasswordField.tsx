import { EyeIcon, EyeOffIcon } from './icons';

interface PasswordFieldProps {
  autoComplete: string;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
  showPassword: boolean;
  value: string;
}

export function PasswordField({
  autoComplete,
  onChange,
  onToggleVisibility,
  showPassword,
  value,
}: PasswordFieldProps): React.JSX.Element {
  return (
    <label>
      Password
      <span className="password-field">
        <input
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          minLength={8}
          required
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        />
        <button
          type="button"
          className="password-toggle"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-pressed={showPassword}
          onClick={onToggleVisibility}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </span>
    </label>
  );
}
