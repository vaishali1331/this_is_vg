import { useEffect, useMemo, useState } from 'react';
import { highlightCode } from '../utils/highlightCode.js';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js';

/**
 * "Editor window" next to each project write-up: macOS-style titlebar,
 * token-tinted snippet, copy button, and an optional line-by-line type-in
 * that plays once the parent section is revealed.
 *
 * @param {Object} props
 * @param {string} props.filename - Shown in the titlebar, e.g. "socket-gateway.ts".
 * @param {string} props.code - Raw code text (the full snippet).
 * @param {boolean} [props.reorder] - Swap to the left column on wide screens (Project 02).
 * @param {boolean} [props.play] - When true, start the type-in (pass section `isVisible`).
 */
export default function CodePanel({ filename, code, reorder = false, play = false }) {
  const reduced = usePrefersReducedMotion();
  const lines = useMemo(() => code.split('\n'), [code]);
  const [lineCount, setLineCount] = useState(() => (reduced ? lines.length : 0));
  const [copied, setCopied] = useState(false);

  // Stay empty until the parent section is revealed, then type line-by-line.
  // Restart when the snippet changes (ASK / AGENT swap). Skip entirely
  // when the user prefers reduced motion.
  useEffect(() => {
    if (reduced) {
      setLineCount(lines.length);
      return undefined;
    }
    if (!play) {
      setLineCount(0);
      return undefined;
    }

    setLineCount(0);
    let next = 0;
    const interval = setInterval(() => {
      next += 1;
      setLineCount(next);
      if (next >= lines.length) clearInterval(interval);
    }, 48);
    return () => clearInterval(interval);
  }, [code, play, reduced, lines.length]);

  const visible = lines.slice(0, lineCount).join('\n');
  const html = highlightCode(visible);
  const typing = play && !reduced && lineCount < lines.length;

  /** Copy the *full* snippet, not the still-typing prefix. */
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Fallback for older browsers / blocked clipboard permissions.
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div
      className={`code-panel${reorder ? ' code-panel--reorder' : ''}${typing ? ' code-panel--typing' : ''}`}
    >
      <div className="code-titlebar">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="filename">{filename}</span>
        <button
          type="button"
          className="code-copy"
          onClick={onCopy}
          aria-label={copied ? 'Copied to clipboard' : `Copy ${filename}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre
        // highlightCode escapes the source before wrapping tokens, so this
        // is safe — the snippets are authored constants, never user input.
        dangerouslySetInnerHTML={{ __html: html || '&nbsp;' }}
      />
    </div>
  );
}
