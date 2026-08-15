import { useScrollReveal } from '../hooks/useScrollReveal.js';
import TagList from './TagList.jsx';
import MetricGrid from './MetricGrid.jsx';
import CodePanel from './CodePanel.jsx';

// Decorative snippet: ASK vs AGENT routing on the LangGraph / Deep Agent
// runtime — mirrors the InnDocs.AI write-up, not a real production file.
const CODE_SNIPPET = `graph = build_agent(mode, tools)

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
    return stream.token(state.reply)`;

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

const METRICS = [
  { value: 'ASK / AGENT', label: 'two modes, one runtime', small: true },
  { value: 'HITL', label: 'prompt review and source validation', small: true },
  { value: 'Multi-agent', label: 'LangGraph / Deep Agent graph', small: true },
];

/**
 * "PROJECT 01" section — InnDocs.AI (Bob, the construction agent).
 * Uses `useScrollReveal` to add the `is-visible` class once the section
 * scrolls into view, which drives the slide-in + staggered child
 * animations defined in index.css.
 */
export default function ProjectInnDocs() {
  const [ref, isVisible] = useScrollReveal();

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
            RAG, project search, connectors, canvas, and skills without shared state. ASK
            is low-latency Q&amp;A with Milvus RAG over contracts and uploads; AGENT is the
            full loop — Modal sandbox execution, S3-backed files, long-term memory, and
            human-in-the-loop review. Thread lifecycle (run, resume, stop, edit-and-retry)
            sits on Dramatiq + RabbitMQ + MongoDB checkpoints, with source validation,
            token/cost tracking, and real-time streaming.
          </p>

          <TagList tags={TAGS} />
          <MetricGrid metrics={METRICS} />
        </div>

        <CodePanel filename="agent_graph.py" code={CODE_SNIPPET} />
      </div>
    </section>
  );
}
