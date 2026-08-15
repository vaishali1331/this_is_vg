import { useScrollReveal } from '../hooks/useScrollReveal.js';

/**
 * @typedef {Object} SkillUsedIn
 * @property {string} href - In-page target, e.g. "#work".
 * @property {string} label - Project name shown on hover.
 *
 * @typedef {Object} SkillCell
 * @property {string} key - The "yaml key" label, e.g. "front_end:".
 * @property {string[]} items - Bullet lines, rendered joined by <br/>.
 * @property {boolean} [wide] - Span all 3 grid columns (system_design row).
 * @property {'inndocs' | 'arena'} [spotlight] - Dims other project tags while hovered.
 * @property {SkillUsedIn} [usedIn] - Cross-link shown on hover.
 */

/** @type {SkillCell[]} */
const SKILL_CELLS = [
  { key: 'front_end:', items: ['React', 'Angular', 'TypeScript', 'React Native'] },
  { key: 'back_end:', items: ['Python / FastAPI', 'Node.js / Fastify', 'Express.js', 'Microservices'] },
  {
    key: 'ai_ml:',
    items: ['LangChain', 'RAG pipelines', 'Embeddings', 'LLM orchestration'],
    spotlight: 'inndocs',
    usedIn: { href: '#work', label: 'InnDocs.AI' },
  },
  { key: 'databases:', items: ['MongoDB', 'PostgreSQL', 'Milvus', 'Redis'] },
  { key: 'cloud_devops:', items: ['AWS', 'Docker', 'CI/CD', 'RabbitMQ / Dramatiq'] },
  {
    key: 'real_time:',
    items: ['WebSockets', 'Socket.IO', 'Redis Pub/Sub', 'Event-driven sync'],
    spotlight: 'arena',
    usedIn: { href: '#arena', label: 'Arena' },
  },
  {
    key: 'system_design:',
    items: ['Multi-tenant architecture', 'Distributed task queues', 'API design', 'Scalable data pipelines'],
    wide: true,
  },
];

/**
 * Lights matching project tags (and dims the rest) while a skill cell
 * with a `spotlight` is hovered. Cleared on leave so the page never
 * stays in a half-dimmed state.
 *
 * @param {'inndocs' | 'arena' | undefined} spotlight
 */
function setSpotlight(spotlight) {
  if (spotlight) {
    document.body.dataset.spotlight = spotlight;
  } else {
    delete document.body.dataset.spotlight;
  }
}

/**
 * "STACK" section: a YAML-styled skills grid. Cells cascade in via the
 * `:nth-child` transition-delay rules in index.css once revealed.
 * `ai_ml` and `real_time` cross-link to the matching project write-up.
 */
export default function Skills() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`section skills${isVisible ? ' is-visible' : ''}`}
      id="stack"
    >
      <div className="kicker">STACK</div>
      <h2>config.stack.yaml</h2>

      <div className="skills-grid">
        {SKILL_CELLS.map((cell) => (
          <div
            className={`skill-cell${cell.wide ? ' skill-cell--wide' : ''}`}
            key={cell.key}
            onMouseEnter={() => setSpotlight(cell.spotlight)}
            onMouseLeave={() => setSpotlight(undefined)}
            onFocus={() => setSpotlight(cell.spotlight)}
            onBlur={() => setSpotlight(undefined)}
          >
            <div className="skill-key">{cell.key}</div>
            <div className="skill-list">
              {cell.items.map((item, i) => (
                <span key={item}>
                  - {item}
                  {i < cell.items.length - 1 && (cell.wide ? '\u00A0\u00A0' : <br />)}
                </span>
              ))}
            </div>
            {cell.usedIn && (
              <a className="skill-used-in" href={cell.usedIn.href}>
                used in {cell.usedIn.label}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
