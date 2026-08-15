import { useEffect, useState } from 'react';

/**
 * Scroll-spy: watches the given section ids and returns whichever is
 * currently sitting in the "active" band under the fixed nav.
 *
 * @param {readonly string[]} sectionIds - Element ids to observe, in page order.
 * @returns {string} The id of the in-view section, or `''` near the hero.
 */
export function useActiveSection(sectionIds) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        // Prefer the most-visible intersecting section so two overlapping
        // observers (e.g. work + experience) don't flicker the underline.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Shrink the root so "active" means "near the upper third",
        // matching where the eye lands under the fixed nav.
        rootMargin: '-28% 0px -55% 0px',
        threshold: [0, 0.2, 0.45, 0.75, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
