import { useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js';

/**
 * Nudges its child toward the pointer (magnetic button).
 * Transform is applied on the wrapper so the child's own hover styles
 * keep working. Disabled when the user prefers reduced motion.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.strength=0.28] - How far the wrapper follows the pointer (0–1).
 * @param {string} [props.className]
 */
export default function Magnet({ children, strength = 0.28, className = '' }) {
  const ref = useRef(/** @type {HTMLDivElement | null} */ (null));
  const reduced = usePrefersReducedMotion();

  /** @param {React.PointerEvent<HTMLDivElement>} event */
  const onPointerMove = (event) => {
    const el = ref.current;
    if (!el || reduced) return;
    const box = el.getBoundingClientRect();
    const x = event.clientX - box.left - box.width / 2;
    const y = event.clientY - box.top - box.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onPointerLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0px, 0px)';
  };

  return (
    <div
      ref={ref}
      className={`magnet${className ? ` ${className}` : ''}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </div>
  );
}
