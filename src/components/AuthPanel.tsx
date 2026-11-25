import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { AuthBrand } from './auth/AuthBrand';
import { AuthFooter } from './auth/AuthFooter';
import { AuthForm } from './auth/AuthForm';
import { AuthTabs } from './auth/AuthTabs';
import type { AuthMode } from './auth/types';

interface AuthPanelProps {
  busy: boolean;
  error: string | null;
  onSubmit: (mode: AuthMode, email: string, password: string) => Promise<void>;
}

function authIntroCopy(mode: AuthMode): string {
  if (mode === 'login') {
    return 'Sign in to price a device principal and compare the three term options.';
  }
  return 'Create an account to price a device principal and compare term options.';
}

export function AuthPanel({
  busy,
  error,
  onSubmit,
}: AuthPanelProps): React.JSX.Element {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    await onSubmit(mode, email.trim(), password);
  }

  return (
    <section className="auth">
      <AuthBrand />
      <p className="lede">{authIntroCopy(mode)}</p>
      <AuthTabs mode={mode} onChange={setMode} />
      <AuthForm
        busy={busy}
        email={email}
        error={error}
        mode={mode}
        password={password}
        showPassword={showPassword}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        onTogglePassword={() => {
          setShowPassword((open) => !open);
        }}
      />
      <AuthFooter mode={mode} onSwitch={setMode} />
    </section>
  );
}
