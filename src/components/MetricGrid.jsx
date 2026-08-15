/**
 * @typedef {Object} Metric
 * @property {string} value - Headline stat, e.g. "10+" or "Real-time".
 * @property {string} label - Short caption under the stat.
 * @property {boolean} [small] - Use the smaller value size (for longer
 *   text values like "Multi-tenant" that would otherwise overflow).
 */

/**
 * Renders the 3-up grid of highlight metrics under a project's tags.
 *
 * @param {{ metrics: Metric[] }} props
 * @param {Metric[]} props.metrics
 */
export default function MetricGrid({ metrics }) {
  return (
    <div className="metrics">
      {metrics.map((metric) => (
        <div className="metric" key={metric.label}>
          <div className={`metric-value${metric.small ? ' metric-value--sm' : ''}`}>
            {metric.value}
          </div>
          <div className="metric-label">{metric.label}</div>
        </div>
      ))}
    </div>
  );
}
