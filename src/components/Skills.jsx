import { useScrollReveal } from '../hooks/useScrollReveal.js';

/**
 * @typedef {Object} SkillCell
 * @property {string} key - The "yaml key" label, e.g. "front_end:".
 * @property {string[]} items - Bullet lines, rendered joined by <br/>.
 * @property {boolean} [wide] - Span all 3 grid columns (system_design row).
 */

/** @type {SkillCell[]} */
const SKILL_CELLS = [
  { key: 'front_end:', items: ['React', 'Angular', 'TypeScript', 'React Native'] },
  { key: 'back_end:', items: ['Python / FastAPI', 'Node.js / Fastify', 'Express.js', 'Microservices'] },
  { key: 'ai_ml:', items: ['LangChain', 'RAG pipelines', 'Embeddings', 'LLM orchestration'] },
  { key: 'databases:', items: ['MongoDB', 'PostgreSQL', 'Milvus', 'Redis'] },
  { key: 'cloud_devops:', items: ['AWS', 'Docker', 'CI/CD', 'RabbitMQ / Dramatiq'] },
  { key: 'real_time:', items: ['WebSockets', 'Socket.IO', 'Redis Pub/Sub', 'Event-driven sync'] },
  {
    key: 'system_design:',
    items: ['Multi-tenant architecture', 'Distributed task queues', 'API design', 'Scalable data pipelines'],
    wide: true,
  },
];

/**
 * "STACK" section: a YAML-styled skills grid. Cells cascade in via the
 * `:nth-child` transition-delay rules in index.css once revealed.
 */
export default function Skills() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section ref={ref} className={`section skills${isVisible ? ' is-visible' : ''}`}>
      <div className="kicker">STACK</div>
      <h2>config.stack.yaml</h2>

      <div className="skills-grid">
        {SKILL_CELLS.map((cell) => (
          <div
            className={`skill-cell${cell.wide ? ' skill-cell--wide' : ''}`}
            key={cell.key}
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
          </div>
        ))}
      </div>
    </section>
  );
}
