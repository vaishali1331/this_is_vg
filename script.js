// IIFE keeps scroll-reveal logic out of the global scope.
(() => {
  // Every section/element that should fade+slide in on scroll is marked
  // with a `data-reveal` attribute in index.html.
  const sections = document.querySelectorAll('[data-reveal]');

  // Fallback for browsers without IntersectionObserver support (or if
  // there's nothing to reveal): just show everything immediately instead
  // of leaving content invisible.
  if (!('IntersectionObserver' in window) || sections.length === 0) {
    sections.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // Watches each `data-reveal` element and toggles the `is-visible` class
  // (defined in styles.css) once it scrolls into view.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Reveal is one-way: stop observing once it has animated in
          // so we don't keep paying for intersection checks.
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 } // fire once ~12% of the element is visible
  );

  sections.forEach((el) => observer.observe(el));
})();
