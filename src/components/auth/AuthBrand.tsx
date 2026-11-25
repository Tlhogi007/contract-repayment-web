import { BrandMark } from '../BrandMark';

export function AuthBrand(): React.JSX.Element {
  return (
    <div className="auth-brand">
      <BrandMark className="auth-mark" size={40} />
      <p className="auth-title">Contract repayment</p>
    </div>
  );
}
