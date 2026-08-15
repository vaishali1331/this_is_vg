import { useMemo } from 'react';
import { useActiveSection } from '../hooks/useActiveSection.js';
import { useScrollProgress } from '../hooks/useScrollProgress.js';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import Magnet from './Magnet.jsx';

/** Section ids the underline tracks — matches the in-page anchors. */
const NAV_SECTIONS = ['work', 'experience', 'about', 'contact'];

/**
 * Fixed top navigation: logo, scroll-spy links, magnetic CTA, ⌘K,
 * and a 1px accent bar that tracks page scroll.
 */
export default function Nav() {
  const activeId = useActiveSection(NAV_SECTIONS);
  const progress = useScrollProgress();
  const { openPalette } = usePortfolio();

  const links = useMemo(
    () => [
      { href: '#work', id: 'work', label: 'Work' },
      { href: '#experience', id: 'experience', label: 'Experience' },
      { href: '#about', id: 'about', label: 'About' },
    ],
    []
  );

  return (
    <nav className="nav" aria-label="Primary">
      <div
        className="nav-progress"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />
      <div className="logo" aria-hidden="true">
        VG<span className="accent logo-cursor">.</span>
      </div>
      <div className="nav-links">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            className={activeId === link.id ? 'is-active' : undefined}
            aria-current={activeId === link.id ? 'location' : undefined}
          >
            {link.label}
          </a>
        ))}
        <button
          type="button"
          className="nav-cmdk"
          onClick={openPalette}
          aria-label="Open command palette"
          title="Open command palette"
        >
          <span className="nav-cmdk-label">Search</span>
          <kbd className="nav-cmdk-kbd">⌘K</kbd>
        </button>
        <Magnet>
          <a
            href="#contact"
            className={`nav-cta${activeId === 'contact' ? ' is-active' : ''}`}
          >
            Let&apos;s Connect
          </a>
        </Magnet>
      </div>
    </nav>
  );
}
