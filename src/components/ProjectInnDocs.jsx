import { useScrollReveal } from '../hooks/useScrollReveal.js';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import TagList from './TagList.jsx';
import MetricGrid from './MetricGrid.jsx';
import CodePanel from './CodePanel.jsx';

/** @typedef {'ASK' | 'AGENT'} InnDocsMode */

/**
 * Mode-specific snippet, metrics, and the one sentence that swaps
 * when the ASK / AGENT control is toggled.
 *
 * @type {Record<InnDocsMode, { filename: string, code: string, blurb: string, metrics: { value: string, label: string, small?: boolean }[] }>}
 */
const MODES = {
  ASK: {
    filename: 'ask_route.py',
    code: `graph = build_agent("ASK", tools=["rag"])

@graph.node
async def route(state):
    return milvus.rag(state.query, k=8)

@graph.node
async def stream(state):
    return stream.token(state.reply)`,
    blurb:
      'ASK is low-latency Q&A with Milvus RAG over contracts and uploads — no sandbox, no long loop. One retrieve, one answer, streamed back in chat.',
    metrics: [
      { value: 'ASK', label: 'low-latency Q&A', small: true },
      { value: 'Milvus RAG', label: 'contracts and uploads', small: true },
      { value: 'k=8', label: 'retrieve then answer', small: true },
    ],
  },
  AGENT: {
    filename: 'agent_graph.py',
    code: `graph = build_agent(mode, tools)

@graph.node
async def route(state):
    if state.mode == "ASK":
        return milvus.rag(state.query, k=8)
    return await agent.loop(
        tools=state.tools,
        sandbox=modal.run,
        files=s3.namespace(state.thread),
    )

@graph.node
async def hitl(state):
    if state.needs_review:
        await checkpoint.pause(state)
    return stream.token(state.reply)`,
    blurb:
      'AGENT is the full loop — Modal sandbox execution, S3-backed files, long-term memory, and human-in-the-loop review. Thread lifecycle sits on Dramatiq + RabbitMQ + MongoDB checkpoints.',
    metrics: [
      { value: 'AGENT', label: 'full tool-using loop', small: true },
      { value: 'HITL', label: 'prompt review and source validation', small: true },
      { value: 'Multi-agent', label: 'LangGraph / Deep Agent graph', small: true },
    ],
  },
};

/** @type {InnDocsMode[]} */
const MODE_ORDER = ['ASK', 'AGENT'];

const TAGS = [
  'LangGraph',
  'LangChain',
  'DeepAgents',
  'FastAPI',
  'Dramatiq',
  'RabbitMQ',
  'Modal',
  'MongoDB',
  'Milvus',
  'S3',
];

/**
 * "PROJECT 01" — InnDocs.AI. The ASK / AGENT control swaps the snippet,
 * the metric row, and one sentence of copy. Mode is shared with the
 * command palette via PortfolioContext.
 */
export default function ProjectInnDocs() {
  const [ref, isVisible] = useScrollReveal();
  const { innDocsMode, setInnDocsMode } = usePortfolio();
  const mode = MODES[innDocsMode];

  return (
    <section
      ref={ref}
      className={`section project${isVisible ? ' is-visible' : ''}`}
      id="work"
    >
      <div className="kicker">PROJECT 01</div>
      <h2>InnDocs.AI</h2>

      <div className="project-grid">
        <div>
          <p>
            Bob is InnDocs.AI&apos;s general-purpose construction agent — a multi-step,
            tool-using assistant that acts as a project manager. It reads drawings and
            contracts, runs analysis in a sandbox, and streams results back in chat.
          </p>
          <p>
            I designed and shipped it on a shared LangGraph / Deep Agent runtime:
            request-scoped middleware so each chat can turn on web search, knowledge-base
            RAG, project search, connectors, canvas, and skills without shared state.
          </p>
          <p className="mode-blurb">{mode.blurb}</p>

          <div
            className="mode-toggle"
            role="radiogroup"
            aria-label="InnDocs runtime mode"
            onKeyDown={(event) => {
              // Arrow keys flip ASK ↔ AGENT so the radiogroup is usable
              // without a pointer, matching native radio behavior.
              if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
              event.preventDefault();
              const next = innDocsMode === 'ASK' ? 'AGENT' : 'ASK';
              setInnDocsMode(next);
              const nextBtn = event.currentTarget.querySelector(
                `[role="radio"][aria-checked="false"]`
              );
              if (nextBtn instanceof HTMLButtonElement) nextBtn.focus();
            }}
          >
            {MODE_ORDER.map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={innDocsMode === value}
                tabIndex={innDocsMode === value ? 0 : -1}
                className={`mode-toggle-btn${innDocsMode === value ? ' is-active' : ''}`}
                onClick={() => setInnDocsMode(value)}
              >
                {value}
              </button>
            ))}
          </div>

          <TagList tags={TAGS} project="inndocs" />
          <MetricGrid metrics={mode.metrics} />
        </div>

        <CodePanel
          key={innDocsMode}
          filename={mode.filename}
          code={mode.code}
          play={isVisible}
        />
      </div>
    </section>
  );
}
