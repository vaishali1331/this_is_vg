import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal.js';

/**
 * @typedef {Object} TimelineEntry
 * @property {string} date - Date range, e.g. "Jul 2024 — Present".
 * @property {string} role - Job title.
 * @property {string} org - Company/organization name.
 * @property {string} desc - One-line description of the role.
 * @property {string} more - What was owned that year; shown when the row is open.
 */

/** Career start used for the headline year count. */
const CAREER_START = new Date(2021, 0, 1);

/** Word form for 1–12 so the heading stays editorial, not "5 years". */
const YEAR_WORDS = [
  'One', 'Two', 'Three', 'Four', 'Five', 'Six',
  'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
];

/**
 * Full years elapsed from 1 Jan 2021 to today (floors partial years).
 *
 * @param {Date} [now]
 * @returns {number}
 */
function yearsSinceStart(now = new Date()) {
  let years = now.getFullYear() - CAREER_START.getFullYear();
  const beforeAnniversary =
    now.getMonth() < CAREER_START.getMonth() ||
    (now.getMonth() === CAREER_START.getMonth() && now.getDate() < CAREER_START.getDate());
  if (beforeAnniversary) years -= 1;
  return Math.max(1, years);
}

/**
 * @param {number} years
 * @returns {string}
 */
function yearWord(years) {
  return YEAR_WORDS[years - 1] ?? String(years);
}

/** @type {TimelineEntry[]} */
const TIMELINE = [
  {
    date: 'Jul 2024 \u2014 Present',
    role: 'Technical Lead',
    org: 'Inncircles Technologies',
    desc: 'Own architecture decisions across the AI and platform surfaces — leading the RAG and real-time systems from design through production.',
    more: 'Architecture calls across RAG and real-time: what ships, what waits, and what has to hold up for real tenants.',
  },
  {
    date: 'Oct 2021 \u2014 Jun 2024',
    role: 'Product Developer',
    org: 'Inncircles Technologies',
    desc: 'Built core modules of Inncircles Arena end to end — from data model to UI — and shipped the first versions of the AI document pipeline.',
    more: 'Arena end to end, plus the first AI document pipeline — the brief Bob was later built on.',
  },
  {
    date: 'Jan 2021 \u2014 Sep 2021',
    role: 'Product Analyst',
    org: 'TechLearn (formerly - EduGrad)',
    desc: 'Worked closely with construction teams to translate real field workflows into product requirements — the foundation for everything built after.',
    more: 'Sat with construction teams on site. The workflows they actually run became the product requirements.',
  },
];

/**
 * "EXPERIENCE" section: a vertical timeline. Rows cascade in via CSS.
 * Click / Enter opens one extra "owned that year" line; only one row
 * is open at a time so the list stays scannable.
 */
export default function Experience() {
  const [ref, isVisible] = useScrollReveal();
  const [openRole, setOpenRole] = useState(/** @type {string | null} */ (null));

  return (
    <section
      ref={ref}
      className={`section experience${isVisible ? ' is-visible' : ''}`}
      id="experience"
    >
      <div className="kicker">EXPERIENCE</div>
      <h2>{yearWord(yearsSinceStart())} years, one continuous build.</h2>

      <div className="timeline">
        {TIMELINE.map((entry, i) => {
          const isOpen = openRole === entry.role;
          return (
            <button
              type="button"
              className={`timeline-row${i === TIMELINE.length - 1 ? ' timeline-row--last' : ''}${isOpen ? ' is-open' : ''}`}
              key={entry.role}
              aria-expanded={isOpen}
              onClick={() => setOpenRole(isOpen ? null : entry.role)}
            >
              <div className="timeline-date">
                {entry.date}
                <span className="timeline-mark" aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </div>
              <div>
                <div className="timeline-role">
                  {entry.role} <span className="timeline-org">&middot; {entry.org}</span>
                </div>
                <div className="timeline-desc">{entry.desc}</div>
                {isOpen && <p className="timeline-more">{entry.more}</p>}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
