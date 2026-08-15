/**
 * Renders a row of tech-stack "chips" (e.g. "Python", "FastAPI").
 * Shared by both project sections so the tag markup/styling only lives
 * in one place. `project` lets the skills grid spotlight matching chips.
 *
 * @param {Object} props
 * @param {string[]} props.tags - Labels to render, in display order.
 * @param {'inndocs' | 'arena'} [props.project] - Owning write-up, used by the stack spotlight.
 */
export default function TagList({ tags, project }) {
  return (
    <div className="tags">
      {tags.map((tag) => (
        <span key={tag} data-project={project}>
          {tag}
        </span>
      ))}
    </div>
  );
}
