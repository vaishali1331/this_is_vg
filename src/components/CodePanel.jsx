/**
 * The little "editor window" panel used to show a decorative code
 * snippet next to each project's write-up (macOS-style dots + filename
 * titlebar, then a <pre> block of code).
 *
 * @param {{ filename: string, code: string, reorder?: boolean }} props
 * @param {string} props.filename - Shown in the titlebar, e.g. "socket-gateway.ts".
 * @param {string} props.code - Raw code text rendered verbatim inside <pre>.
 * @param {boolean} [props.reorder] - When true, applies the `--reorder`
 *   modifier so the panel swaps to the left column on wide screens
 *   (used by Project 02 — see .project-02 rules in index.css).
 */
export default function CodePanel({ filename, code, reorder = false }) {
  return (
    <div className={`code-panel${reorder ? ' code-panel--reorder' : ''}`}>
      <div className="code-titlebar">
        <span className="dot"></span><span className="dot"></span><span className="dot"></span>
        <span className="filename">{filename}</span>
      </div>
      <pre>{code}</pre>
    </div>
  );
}
