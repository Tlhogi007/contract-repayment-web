import type { SubmitEvent } from 'react';
import { PasswordField } from '../PasswordField';
import { TextField } from '../TextField';
import type { AuthMode } from './types';

interface AuthFormProps {
  busy: boolean;
  email: string;
  error: string | null;
  mode: AuthMode;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  onTogglePassword: () => void;
  password: string;
  showPassword: boolean;
}

export function AuthForm({
  busy,
  email,
  error,
  mode,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onTogglePassword,
  password,
  showPassword,
}: AuthFormProps): React.JSX.Element {
  return (
    <form key={mode} className="stack auth-form" onSubmit={onSubmit}>
      <TextField
        label="Email"
        type="email"
        autoComplete="username"
        required
        value={email}
        onChange={onEmailChange}
      />
      <PasswordField
        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        showPassword={showPassword}
        value={password}
        onChange={onPasswordChange}
        onToggleVisibility={onTogglePassword}
      />
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className="btn primary" disabled={busy}>
        {busy ? 'Working…' : mode === 'login' ? 'Sign in' : 'Create account'}
      </button>
    </form>
  );
}
