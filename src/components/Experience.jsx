import { useScrollReveal } from '../hooks/useScrollReveal.js';

/**
 * @typedef {Object} TimelineEntry
 * @property {string} date - Date range, e.g. "Jul 2024 — Present".
 * @property {string} role - Job title.
 * @property {string} org - Company/organization name.
 * @property {string} desc - One-line description of the role.
 */

/** @type {TimelineEntry[]} */
const TIMELINE = [
  {
    date: 'Jul 2024 \u2014 Present',
    role: 'Technical Lead',
    org: 'Inncircles Technologies',
    desc: 'Own architecture decisions across the AI and platform surfaces — leading the RAG and real-time systems from design through production.',
  },
  {
    date: 'Oct 2021 \u2014 Jun 2024',
    role: 'Senior Product Developer',
    org: 'Inncircles Technologies',
    desc: 'Built core modules of Inncircles Arena end to end — from data model to UI — and shipped the first versions of the AI document pipeline.',
  },
  {
    date: 'Jan 2021 \u2014 Sep 2021',
    role: 'Product Analyst',
    org: 'Inncircles Technologies',
    desc: 'Worked closely with construction teams to translate real field workflows into product requirements — the foundation for everything built after.',
  },
];

/**
 * "EXPERIENCE" section: a vertical timeline. Rows cascade in one after
 * another via the `:nth-child` transition-delay rules in index.css once
 * this section gets its `is-visible` class.
 */
export default function Experience() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`section experience${isVisible ? ' is-visible' : ''}`}
      id="experience"
    >
      <div className="kicker">EXPERIENCE</div>
      <h2>Six years, one continuous build.</h2>

      <div className="timeline">
        {TIMELINE.map((entry, i) => (
          <div
            className={`timeline-row${i === TIMELINE.length - 1 ? ' timeline-row--last' : ''}`}
            key={entry.role}
          >
            <div className="timeline-date">{entry.date}</div>
            <div>
              <div className="timeline-role">
                {entry.role} <span className="timeline-org">&middot; {entry.org}</span>
              </div>
              <div className="timeline-desc">{entry.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
