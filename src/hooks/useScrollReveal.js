import { useEffect, useRef, useState } from 'react';

/**
 * React port of the old `script.js` scroll-reveal logic.
 *
 * Watches the returned `ref` element with an IntersectionObserver and
 * flips `isVisible` to `true` the first time it scrolls into view. The
 * consuming component is expected to conditionally add an `is-visible`
 * class (see index.css) so the existing CSS transitions handle the
 * actual fade/slide animation — this hook only tracks *when* to reveal.
 *
 * Falls back to `isVisible = true` immediately when IntersectionObserver
 * isn't available, so content is never left invisible.
 *
 * @param {number} [threshold=0.12] - Fraction of the element that must be
 *   visible before it is considered "revealed" (matches the original
 *   `{ threshold: 0.12 }` used in script.js).
 * @returns {[React.RefObject<HTMLElement>, boolean]} A ref to attach to the
 *   element you want to observe, and whether it has been revealed yet.
 */
export function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Reveal is one-way: stop observing once it has animated in
            // so we don't keep paying for intersection checks.
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}
