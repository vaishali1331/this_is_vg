import { useRef, useState } from 'react';
import { scrollToId } from '../utils/scrollToId.js';

/** @typedef {{ type: 'in' | 'out' | 'err', text: string }} TermLine */

const PROMPT = 'vg@hyderabad ~';

const HELP = [
  'whoami    — one-line bio',
  'stack     — config.stack.yaml keys',
  'work      — jump to projects',
  'contact   — print email',
  'clear     — wipe the buffer',
  'help      — this list',
].join('\n');

/**
 * Runs a terminal command and returns the lines to append.
 * Navigation commands also scroll the matching section into view.
 *
 * @param {string} raw
 * @returns {TermLine[]}
 */
function runCommand(raw) {
  const cmd = raw.trim().toLowerCase();
  if (!cmd) return [];

  switch (cmd) {
    case 'help':
    case '?':
      return [{ type: 'out', text: HELP }];
    case 'whoami':
      return [
        {
          type: 'out',
          text: 'Vaishali Gangwar — I build AI systems that scale and platforms that don\'t fall over.',
        },
      ];
    case 'stack':
      scrollToId('stack');
      return [
        {
          type: 'out',
          text: 'front_end, back_end, ai_ml, databases, cloud_devops, real_time, system_design',
        },
      ];
    case 'work':
      scrollToId('work');
      return [{ type: 'out', text: 'InnDocs.AI · Inncircles Arena' }];
    case 'contact':
      scrollToId('contact');
      return [{ type: 'out', text: 'vaishali13gangwar@gmail.com' }];
    case 'clear':
      return [];
    default:
      return [{ type: 'err', text: `command not found: ${raw.trim()}` }];
  }
}

/**
 * Compact `vg@hyderabad ~` prompt under the hero. Stays one line until
 * focused, then grows just enough to show recent output. Also reachable
 * as a command-palette surface — same verbs, same voice.
 */
export default function MiniTerminal() {
  const inputRef = useRef(/** @type {HTMLInputElement | null} */ (null));
  const [value, setValue] = useState('');
  const [lines, setLines] = useState(/** @type {TermLine[]} */ ([]));
  const [focused, setFocused] = useState(false);

  /** @param {React.FormEvent<HTMLFormElement>} event */
  const onSubmit = (event) => {
    event.preventDefault();
    const raw = value;
    setValue('');
    if (raw.trim().toLowerCase() === 'clear') {
      setLines([]);
      return;
    }
    const output = runCommand(raw);
    setLines((prev) => [
      ...prev.slice(-8),
      { type: 'in', text: `${PROMPT} ${raw}` },
      ...output,
    ]);
  };

  return (
    <div
      className={`hero-terminal${focused || lines.length ? ' is-open' : ''}`}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="hero-terminal-chrome" aria-hidden="true">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="filename">vg — zsh</span>
      </div>
      {lines.length > 0 && (
        <pre className="hero-terminal-log" aria-live="polite">
          {lines.map((line, i) => (
            <span key={`${line.type}-${i}`} className={`term-${line.type}`}>
              {line.text}
              {'\n'}
            </span>
          ))}
        </pre>
      )}
      <form className="hero-terminal-row" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="hero-term-input">
          Terminal command
        </label>
        <span className="hero-terminal-prompt" aria-hidden="true">
          {PROMPT}
        </span>
        <input
          id="hero-term-input"
          ref={inputRef}
          className="hero-terminal-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="whoami"
          aria-describedby="hero-term-hint"
        />
      </form>
      <p id="hero-term-hint" className="hero-terminal-hint">
        try whoami, stack, work, contact — or hit ⌘K
      </p>
    </div>
  );
}
