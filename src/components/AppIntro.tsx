import { BrandMark } from './BrandMark';

export function AppIntro(): React.JSX.Element {
  return (
    <div
      className="app-intro"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <BrandMark className="loader-mark intro-mark" size={48} />
      <p className="intro-label">Contract repayment</p>
    </div>
  );
}
