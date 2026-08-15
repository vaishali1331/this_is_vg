/**
 * Renders a row of tech-stack "chips" (e.g. "Python", "FastAPI").
 * Shared by both project sections so the tag markup/styling only lives
 * in one place.
 *
 * @param {{ tags: string[] }} props
 * @param {string[]} props.tags - Labels to render, in display order.
 */
export default function TagList({ tags }) {
  return (
    <div className="tags">
      {tags.map((tag) => (
        <span key={tag}>{tag}</span>
      ))}
    </div>
  );
}
