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
 * @param {'view' | 'mount' | 'hover'} [props.animateOn='view'] - Start on intersect, immediately, or when `play` increments.
 * @param {number} [props.play=0] - Hover mode: increment to replay the scramble (0 = show final text).
 * @param {boolean} [props.announce=true] - When false, skip the sr-only copy (parent already labels).
 */
export default function DecryptedText({
  text,
  speed = 32,
  delay = 0,
  className = '',
  animateOn = 'view',
  play = 0,
  announce = true,
}) {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef(/** @type {HTMLSpanElement | null} */ (null));
  const hoverIdle = animateOn === 'hover';
  const [started, setStarted] = useState(animateOn === 'mount' || reduced);
  const [revealedCount, setRevealedCount] = useState(
    reduced || hoverIdle ? text.length : 0
  );
  const [tick, setTick] = useState(0);

  // Hover/focus replay: parent increments `play`. Skip the initial 0.
  useEffect(() => {
    if (animateOn !== 'hover' || reduced || play === 0) return undefined;
    setRevealedCount(0);
    setStarted(true);
    return undefined;
  }, [animateOn, play, reduced]);

  // Kick off when the node scrolls into view (default) or on mount.
  useEffect(() => {
    if (animateOn === 'hover') return undefined;
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

  // `play` is in the deps so hover replays restart the interval even when
  // `started` is already true from a previous enter.
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
  }, [started, reduced, text, speed, delay, play]);

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
      {announce && <span className="sr-only">{text}</span>}
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
