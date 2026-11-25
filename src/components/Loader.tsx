import { BrandMark } from './BrandMark';
import { StatusPanel } from './StatusPanel';

interface LoaderProps {
  label?: string;
}

export function Loader({ label = 'Loading' }: LoaderProps): React.JSX.Element {
  return (
    <StatusPanel>
      <BrandMark className="loader-mark" size={40} />
      <span className="sr-only">{label}</span>
    </StatusPanel>
  );
}
