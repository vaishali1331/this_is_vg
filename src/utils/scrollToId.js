/**
 * Scrolls an in-page section into view. Uses instant scrolling when the
 * user prefers reduced motion so we don't fight that setting with a
 * `behavior: 'smooth'` override.
 *
 * @param {string} id - Element id (without '#').
 */
export function scrollToId(id) {
  const node = document.getElementById(id);
  if (!node) return;
  const reduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  node.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}
