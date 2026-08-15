import { useEffect, useState } from 'react';

/**
 * Tracks the user's `prefers-reduced-motion` media query so animations
 * (type-in, decrypt, magnetic pull, logo blink) can short-circuit.
 *
 * @returns {boolean} `true` when motion should be skipped.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    /** @param {MediaQueryListEvent} event */
    const onChange = (event) => setReduced(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
