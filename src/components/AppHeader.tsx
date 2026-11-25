import type { Theme } from '../hooks/useTheme';
import { MoonIcon, SunIcon } from './icons';

interface AppHeaderProps {
  email: string | null;
  onSignOut: () => void;
  onToggleTheme: () => void;
  signedIn: boolean;
  theme: Theme;
}

export function AppHeader({
  email,
  onSignOut,
  onToggleTheme,
  signedIn,
  theme,
}: AppHeaderProps): React.JSX.Element {
  return (
    <header className="top">
      <div>
        <p className="brand">Contract repayment</p>
        <p className="brand-sub">12 / 24 / 36 · 6.5%</p>
      </div>
      <div className="top-actions">
        {signedIn ? <span className="muted">{email}</span> : null}
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={
            theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
          }
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
        {signedIn ? (
          <button type="button" className="btn ghost" onClick={onSignOut}>
            Sign out
          </button>
        ) : null}
      </div>
    </header>
  );
}
