import { useScrollReveal } from '../hooks/useScrollReveal.js';
import TagList from './TagList.jsx';
import MetricGrid from './MetricGrid.jsx';
import CodePanel from './CodePanel.jsx';

const CODE_SNIPPET = `io.of("/project").use(tenantAuth);

io.of("/project").on("connection", (socket) => {
  const { tenantId, projectId } = socket.handshake;
  socket.join(\`tenant:\${tenantId}:\${projectId}\`);

  socket.on("task:update", async (payload) => {
    const task = await Task.updateOne(payload);
    redis.publish(
      \`project:\${projectId}\`,
      JSON.stringify(task)
    );
  });
});

redisSub.on("message", (channel, msg) => {
  io.of("/project").to(channel).emit("sync", msg);
});`;

const TAGS = ['Angular', 'Node.js', 'TypeScript', 'React Native', 'MongoDB', 'Redis', 'AWS'];

const METRICS = [
  { value: 'Multi-tenant', label: 'multi-client architecture', small: true },
  { value: 'Real-time', label: 'WebSocket sync', small: true },
  { value: 'Web + Mobile', label: 'one shared experience', small: true },
];

/**
 * "PROJECT 02" section — Inncircles Arena. The code panel and copy swap
 * column order on wide screens (`.project-02` grid rules in index.css),
 * which is why CodePanel gets `reorder` and the text column gets the
 * matching `text-reorder` class here.
 */
export default function ProjectArena() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`section project project-02${isVisible ? ' is-visible' : ''}`}
    >
      <div className="kicker">PROJECT 02</div>
      <h2>Inncircles Arena</h2>

      <div className="project-grid">
        <CodePanel filename="socket-gateway.ts" code={CODE_SNIPPET} reorder />

        <div className="text-reorder">
          <p>
            Inncircles Arena is a construction-management SaaS used across multiple clients and
            tenants at once — scheduling, task tracking, and field updates that need to stay in
            sync in real time, on web and mobile.
          </p>
          <p>
            I worked across the full stack: multi-tenant architecture, WebSocket-based sync so a
            change on-site shows up instantly on every connected screen, and a shared React
            Native app so field teams get the same experience as the web dashboard.
          </p>

          <TagList tags={TAGS} />
          <MetricGrid metrics={METRICS} />
        </div>
      </div>
    </section>
  );
}
