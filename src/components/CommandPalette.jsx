import { useEffect, useMemo, useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { scrollToId } from '../utils/scrollToId.js';

const EMAIL = 'vaishali13gangwar@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/vaishali-gangwar-2323091a0/';

/**
 * @typedef {Object} PaletteCommand
 * @property {string} id
 * @property {string} label
 * @property {string} [hint]
 * @property {string} group
 * @property {() => void} run
 */

/**
 * ⌘K / Ctrl+K command palette. Styled like the project code panels.
 * Always mounted so the global shortcut works; the dialog is hidden
 * when closed. Focus is trapped while open.
 */
export default function CommandPalette() {
  const { paletteOpen, closePalette, togglePalette, setInnDocsMode } =
    usePortfolio();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const inputRef = useRef(/** @type {HTMLInputElement | null} */ (null));

  /** @type {PaletteCommand[]} */
  const commands = useMemo(
    () => [
      { id: 'work', group: 'Go to', label: 'Work', hint: 'InnDocs.AI / Arena', run: () => scrollToId('work') },
      { id: 'experience', group: 'Go to', label: 'Experience', run: () => scrollToId('experience') },
      { id: 'stack', group: 'Go to', label: 'Stack', hint: 'config.stack.yaml', run: () => scrollToId('stack') },
      { id: 'about', group: 'Go to', label: 'About', run: () => scrollToId('about') },
      { id: 'contact', group: 'Go to', label: 'Contact', run: () => scrollToId('contact') },
      {
        id: 'email',
        group: 'Actions',
        label: 'Copy email',
        hint: EMAIL,
        run: async () => {
          try {
            await navigator.clipboard.writeText(EMAIL);
          } catch {
            /* ignore — the hint already shows the address */
          }
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1400);
        },
      },
      {
        id: 'linkedin',
        group: 'Actions',
        label: 'Open LinkedIn',
        run: () => window.open(LINKEDIN, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'ask',
        group: 'InnDocs',
        label: 'Switch to ASK',
        hint: 'low-latency RAG',
        run: () => {
          setInnDocsMode('ASK');
          scrollToId('work');
        },
      },
      {
        id: 'agent',
        group: 'InnDocs',
        label: 'Switch to AGENT',
        hint: 'full loop + HITL',
        run: () => {
          setInnDocsMode('AGENT');
          scrollToId('work');
        },
      },
    ],
    [setInnDocsMode]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.group.toLowerCase().includes(q) ||
        (cmd.hint && cmd.hint.toLowerCase().includes(q))
    );
  }, [commands, query]);

  // Global shortcut — ⌘K on Mac, Ctrl+K elsewhere. Ignore when the
  // user is already typing in the hero terminal (except to open).
  useEffect(() => {
    /** @param {KeyboardEvent} event */
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        togglePalette();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePalette]);

  // Reset query / cursor and lock body scroll while the dialog is open.
  useEffect(() => {
    if (!paletteOpen) return undefined;
    setQuery('');
    setCursor(0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const id = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = prev;
      window.cancelAnimationFrame(id);
    };
  }, [paletteOpen]);

  // Keep the highlighted row in range after filtering.
  useEffect(() => {
    setCursor(0);
  }, [query]);

  // Focus trap + Esc / arrows / Enter while open.
  useEffect(() => {
    if (!paletteOpen) return undefined;

    /** @param {KeyboardEvent} event */
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePalette();
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setCursor((i) => (filtered.length === 0 ? 0 : (i + 1) % filtered.length));
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setCursor((i) =>
          filtered.length === 0 ? 0 : (i - 1 + filtered.length) % filtered.length
        );
        return;
      }
      if (event.key === 'Enter' && filtered[cursor]) {
        event.preventDefault();
        const cmd = filtered[cursor];
        // Copy-email stays open so the "Copied" hint is visible; everything
        // else closes so the user lands on the destination.
        if (cmd.id !== 'email') closePalette();
        cmd.run();
        return;
      }
      if (event.key === 'Tab') {
        const root = dialogRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll('input, button');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          /** @type {HTMLElement} */ (last).focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          /** @type {HTMLElement} */ (first).focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [paletteOpen, filtered, cursor, closePalette]);

  if (!paletteOpen) return null;

  /** @param {PaletteCommand} cmd */
  const runAndClose = (cmd) => {
    if (cmd.id !== 'email') closePalette();
    cmd.run();
  };

  return (
    <div className="palette-backdrop" onClick={closePalette}>
      <div
        ref={dialogRef}
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="palette-titlebar" aria-hidden="true">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="filename">command palette</span>
          <span className="palette-esc">esc</span>
        </div>
        <input
          ref={inputRef}
          className="palette-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Jump to a section, copy email, switch ASK / AGENT…"
          aria-label="Filter commands"
          autoComplete="off"
          spellCheck={false}
        />
        <ul className="palette-list" role="listbox" aria-label="Commands">
          {filtered.length === 0 && (
            <li className="palette-empty">No matching commands.</li>
          )}
          {filtered.map((cmd, index) => (
            <li key={cmd.id}>
              <button
                type="button"
                role="option"
                aria-selected={index === cursor}
                className={`palette-item${index === cursor ? ' is-active' : ''}`}
                onMouseEnter={() => setCursor(index)}
                onClick={() => runAndClose(cmd)}
              >
                <span className="palette-group">{cmd.group}</span>
                <span className="palette-label">{cmd.label}</span>
                {cmd.id === 'email' && copied ? (
                  <span className="palette-hint">Copied</span>
                ) : (
                  cmd.hint && <span className="palette-hint">{cmd.hint}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
