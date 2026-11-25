interface BrandMarkProps {
  className?: string;
  size?: number;
}

/** CR = Contract Repayment. */
export function BrandMark({
  className,
  size = 32,
}: BrandMarkProps): React.JSX.Element {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="6" fill="currentColor" />
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fontFamily="IBM Plex Sans, system-ui, sans-serif"
        fontSize="13"
        fontWeight="700"
        fill="var(--surface)"
        letterSpacing="0.5"
      >
        CR
      </text>
    </svg>
  );
}
