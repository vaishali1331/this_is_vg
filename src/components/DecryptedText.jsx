import { useEffect, useMemo, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js';

/** Glyphs cycled while a character is still "encrypted". */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!<>-_/[]{}—=+*^?#';

/**
 * Hacker-style decrypt: random glyphs resolve left-to-right into `text`.
 * Lightweight stand-in for React Bits DecryptedText (no motion/gsap).
 * Screen readers get the final string immediately via a visually-hidden copy.
 *
 * @param {Object} props
 * @param {string} props.text - Final string to reveal.
 * @param {number} [props.speed=32] - Ms between reveal ticks.
 * @param {number} [props.delay=0] - Ms to wait before starting.
 * @param {string} [props.className] - Class on the visible wrapper.
 * @param {'view' | 'mount'} [props.animateOn='view'] - Start on intersect or immediately.
 */
export default function DecryptedText({
  text,
  speed = 32,
  delay = 0,
  className = '',
  animateOn = 'view',
}) {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef(/** @type {HTMLSpanElement | null} */ (null));
  const [started, setStarted] = useState(animateOn === 'mount' || reduced);
  const [revealedCount, setRevealedCount] = useState(reduced ? text.length : 0);
  const [tick, setTick] = useState(0);

  // Kick off when the node scrolls into view (default) or on mount.
  useEffect(() => {
    if (reduced || started) return undefined;
    if (animateOn === 'mount') {
      setStarted(true);
      return undefined;
    }

    const node = containerRef.current;
    if (!node || !('IntersectionObserver' in window)) {
      setStarted(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [animateOn, reduced, started]);

  useEffect(() => {
    if (!started || reduced) return undefined;

    let count = 0;
    /** @type {ReturnType<typeof setInterval> | undefined} */
    let interval;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        count += 1;
        setRevealedCount(count);
        setTick((n) => n + 1);
        if (count >= text.length) {
          clearInterval(interval);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [started, reduced, text, speed, delay]);

  const chars = useMemo(
    () =>
      text.split('').map((char, index) => {
        if (char === ' ' || char === '\n') return char;
        if (index < revealedCount) return char;
        return GLYPHS[(index + tick) % GLYPHS.length];
      }),
    [text, revealedCount, tick]
  );

  return (
    <span ref={containerRef} className={`decrypted${className ? ` ${className}` : ''}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {chars.map((char, index) => (
          <span
            key={`${text}-${index}`}
            className={index < revealedCount || char === ' ' ? undefined : 'decrypted-encrypted'}
          >
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}
