import { useScrollReveal } from '../hooks/useScrollReveal.js';

/**
 * "ABOUT" section: lead identity + how you work, then a personal closer.
 * No staggered children; just the section slide-in.
 */
export default function About() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`section about${isVisible ? ' is-visible' : ''}`}
      id="about"
    >
      <div className="kicker">ABOUT</div>
      <p className="about-lead">
        I&apos;m Vaishali Gangwar, a full stack engineer in Hyderabad. Lately that
        means agents: multi-step, tool-using systems that have to hold up in
        production, not just in a demo. I like the unglamorous parts: the
        pipeline that has to run at 3am, the schema that has to hold up in year
        three, the system nobody notices because it just works.
      </p>
      <p className="about-sub">
        Outside of that: a fairly opinionated cat, a sketchbook I don&apos;t fill
        often enough, and a gym habit I take as seriously as production deploys.
      </p>
    </section>
  );
}
