import { API_BASE } from '../../api/client';
import type { AuthMode } from './types';

interface AuthFooterProps {
  mode: AuthMode;
  onSwitch: (mode: AuthMode) => void;
}

export function AuthFooter({
  mode,
  onSwitch,
}: AuthFooterProps): React.JSX.Element {
  const docsHref = `${API_BASE}/api/docs`;

  return (
    <footer className="auth-footer">
      <p className="auth-switch">
        {mode === 'register' ? (
          <>
            I already have an account.{' '}
            <button
              type="button"
              className="text-link"
              onClick={() => {
                onSwitch('login');
              }}
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            New here?{' '}
            <button
              type="button"
              className="text-link"
              onClick={() => {
                onSwitch('register');
              }}
            >
              Create an account
            </button>
          </>
        )}
      </p>
      <p className="hint">
        <a href={docsHref} target="_blank" rel="noreferrer">
          API docs
        </a>
      </p>
    </footer>
  );
}
