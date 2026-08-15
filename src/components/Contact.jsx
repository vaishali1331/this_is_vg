import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';

const EMAIL = 'vaishali13gangwar@gmail.com';
const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent('From your portfolio')}`;
const LINKEDIN = 'https://www.linkedin.com/in/vaishali-gangwar-2323091a0/';

/**
 * Footer / "CONTACT" section. Clicking the email copies the address
 * and flashes "Copied"; mailto (with a pre-filled subject) is the
 * fallback if the clipboard is blocked, and the href for cmd-click.
 */
export default function Contact() {
  const [ref, isVisible] = useScrollReveal();
  const [copied, setCopied] = useState(false);

  /** @param {React.MouseEvent<HTMLAnchorElement>} event */
  const onEmailClick = async (event) => {
    // Modifier / non-primary click: let the browser open mailto as usual.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      window.location.href = MAILTO;
    }
  };

  return (
    <footer
      ref={ref}
      className={`section cta${isVisible ? ' is-visible' : ''}`}
      id="contact"
    >
      <div className="cta-inner">
        <h2>Building something that needs to actually work? Let&apos;s talk.</h2>

        <div className="cta-links">
          <a
            href={MAILTO}
            className="cta-email"
            onClick={onEmailClick}
            aria-label={copied ? 'Email copied to clipboard' : `Copy ${EMAIL}`}
          >
            {copied ? 'Copied' : EMAIL}
          </a>
          <a href={LINKEDIN} className="cta-linkedin">
            linkedin.com/in/vaishali-gangwar
          </a>
        </div>
        <div className="cta-note">No form. Just reach out.</div>

        <div className="footer-bottom">
          <div>&copy; 2026 Vaishali Gangwar</div>
          <div>Full Stack Engineering / AI &amp; Platform</div>
        </div>
      </div>
    </footer>
  );
}
