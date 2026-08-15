import { useScrollReveal } from '../hooks/useScrollReveal.js';

/**
 * Footer / "CONTACT" section: closing CTA heading, the two contact
 * links (staggered in via index.css), and the copyright bottom bar.
 */
export default function Contact() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <footer
      ref={ref}
      className={`section cta${isVisible ? ' is-visible' : ''}`}
      id="contact"
    >
      <div className="cta-inner">
        <h2>Building something that needs to actually work? Let&apos;s talk.</h2>

        <div className="cta-links">
          <a href="mailto:vaishali13gangwar@gmail.com" className="cta-email">
            vaishali13gangwar@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/vaishali-gangwar-2323091a0/"
            className="cta-linkedin"
          >
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
