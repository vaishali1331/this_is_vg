import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js';

/**
 * Soft accent disc that follows the pointer (mix-blend spotlight).
 * OS cursor stays visible. Disabled on coarse pointers (phones).
 * `pointer-events: none` so CursorGrid still receives the real pointer.
 *
 * @returns {JSX.Element | null}
 */
export default function CursorSample() {
  const reduced = usePrefersReducedMotion();
  const nodeRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const posRef = useRef({ x: -80, y: -80, tx: -80, ty: -80 });
  const [inside, setInside] = useState(false);
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return !window.matchMedia('(pointer: coarse)').matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const media = window.matchMedia('(pointer: coarse)');
    /** @param {MediaQueryListEvent} event */
    const onChange = (event) => setEnabled(!event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    /** @param {PointerEvent} event */
    const onMove = (event) => {
      posRef.current.tx = event.clientX;
      posRef.current.ty = event.clientY;
      setInside(true);
    };

    const onLeave = () => setInside(false);

    let raf = 0;
    const tick = () => {
      const pos = posRef.current;
      // Reduced motion: snap. Otherwise a short lerp so the disc trails.
      const ease = reduced ? 1 : 0.2;
      pos.x += (pos.tx - pos.x) * ease;
      pos.y += (pos.ty - pos.y) * ease;
      const node = nodeRef.current;
      if (node) {
        node.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }
      raf = window.requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, reduced]);

  if (!enabled) return null;

  return (
    <div
      ref={nodeRef}
      className={`cursor-sample${inside ? ' is-on' : ''}`}
      aria-hidden="true"
    >
      <span className="cursor-sample-dot"></span>
    </div>
  );
}
