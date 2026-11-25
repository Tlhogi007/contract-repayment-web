import { useEffect, useState } from 'react';

const SHOW_AFTER_PX = 80;

export function ScrollTopButton(): React.JSX.Element | null {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll(): void {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return (): void => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      className="scroll-top"
      aria-label="Scroll to top"
      onClick={() => {
        window.scrollTo({ behavior: 'smooth', top: 0 });
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M9 14.25V3.75M9 3.75 4.5 8.25M9 3.75l4.5 4.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
