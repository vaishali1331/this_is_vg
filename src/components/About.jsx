import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import DecryptedText from './DecryptedText.jsx';

/** @typedef {'currently' | 'taste' | 'offline' | 'want'} AboutKey */

/**
 * Closer sentences swapped by the about.yaml key row.
 * The lead paragraph never changes — only this line does.
 *
 * @type {Record<AboutKey, string>}
 */
const CLOSERS = {
  currently:
    'Hyderabad. Production tenants. Construction data that is messy on purpose. I build agents that have to work in that — not around it.',
  taste:
    'I do not care if it looks like AI. I care if it is still right at 3am, on a bad network, with last quarter\'s schema. Typed contracts, queues that drain, an API that survives the third rewrite. Everything else is optional.',
  offline:
    "Outside of that: a fairly opinionated cat, a sketchbook I don't fill often enough, and a gym habit I take as seriously as production deploys.",
  want:
    'Later: a small cottage on some mountain, a view, wifi that actually holds, work that is changing something, and more pets than is reasonable.',
};

/** @type {AboutKey[]} */
const KEY_ORDER = ['currently', 'taste', 'offline', 'want'];

/**
 * "ABOUT" section: identity lead (always visible), an about.yaml key
 * row that swaps the closer, and a decrypting kicker. Mode is shared
 * with the command palette via PortfolioContext.
 */
export default function About() {
  const [ref, isVisible] = useScrollReveal();
  const { aboutKey, setAboutKey } = usePortfolio();

  return (
    <section
      ref={ref}
      className={`section about${isVisible ? ' is-visible' : ''}`}
      id="about"
    >
      <div className="kicker">
        <DecryptedText text="ABOUT" animateOn="view" speed={40} />
      </div>
      <p className="about-lead">
        I&apos;m Vaishali Gangwar, a full stack engineer in Hyderabad. Lately that
        means <span className="about-phrase">agents</span>: multi-step,
        tool-using systems that have to hold up in production, not just in a
        demo. I like the unglamorous parts: the{' '}
        <span className="about-phrase">pipeline that has to run at 3am</span>,
        the schema that has to hold up in{' '}
        <span className="about-phrase">year three</span>, the system nobody
        notices because it just works.
      </p>

      <div className="about-yaml">
        <div className="about-yaml-file">about.yaml</div>
        <div
          className="mode-toggle"
          role="radiogroup"
          aria-label="About yaml key"
          onKeyDown={(event) => {
            // Arrow keys cycle currently → taste → offline → want, matching
            // native radio behavior so the row is usable without a pointer.
            if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
            event.preventDefault();
            const index = KEY_ORDER.indexOf(aboutKey);
            const step = event.key === 'ArrowRight' ? 1 : -1;
            const next = KEY_ORDER[(index + step + KEY_ORDER.length) % KEY_ORDER.length];
            setAboutKey(next);
            const nextBtn = event.currentTarget.querySelector(
              `[data-about-key="${next}"]`
            );
            if (nextBtn instanceof HTMLButtonElement) nextBtn.focus();
          }}
        >
          {KEY_ORDER.map((key) => (
            <button
              key={key}
              type="button"
              role="radio"
              data-about-key={key}
              aria-checked={aboutKey === key}
              tabIndex={aboutKey === key ? 0 : -1}
              className={`mode-toggle-btn${aboutKey === key ? ' is-active' : ''}`}
              onClick={() => setAboutKey(key)}
            >
              {key}:
            </button>
          ))}
        </div>
      </div>

      <p className="about-sub">{CLOSERS[aboutKey]}</p>
    </section>
  );
}
