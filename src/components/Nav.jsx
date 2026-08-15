/**
 * Fixed top navigation bar: logo + in-page anchor links.
 * Purely presentational — no state, so it's a plain function component.
 */
export default function Nav() {
  return (
    <nav className="nav">
      <div className="logo">VG<span className="accent">.</span></div>
      <div className="nav-links">
        <a href="#work">Work</a>
        <a href="#experience">Experience</a>
        <a href="#about">About</a>
        <a href="#contact" className="nav-cta">Let&apos;s Connect</a>
      </div>
    </nav>
  );
}
