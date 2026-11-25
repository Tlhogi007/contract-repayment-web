import type { AuthMode } from './types';

interface AuthTabsProps {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
}

export function AuthTabs({ mode, onChange }: AuthTabsProps): React.JSX.Element {
  return (
    <div
      className="tabs"
      role="tablist"
      aria-label="Auth mode"
      data-mode={mode}
    >
      <button
        type="button"
        role="tab"
        className={mode === 'login' ? 'tab active' : 'tab'}
        aria-selected={mode === 'login'}
        onClick={() => {
          onChange('login');
        }}
      >
        Sign in
      </button>
      <button
        type="button"
        role="tab"
        className={mode === 'register' ? 'tab active' : 'tab'}
        aria-selected={mode === 'register'}
        onClick={() => {
          onChange('register');
        }}
      >
        Register
      </button>
      <span className="tabs-indicator" aria-hidden="true" />
    </div>
  );
}
