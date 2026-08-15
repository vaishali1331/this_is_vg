/**
 * Keywords tinted in the decorative Python / TypeScript snippets.
 * Kept as a single alternation so the highlighter is one pass.
 */
const TOKEN_RE =
  /(#.*$|\/\/.*$|`[^`]*`|"[^"]*"|'[^']*'|@\w+|\b(?:async|await|return|const|let|var|def|if|else|for|in|of|from|import|export|class|new|true|false|null|None|True|False|function|and|or|not|with|as|try|except|catch|finally|yield|pass|undefined)\b)/gm;

/**
 * Lightweight syntax tint for the project code panels.
 * Escapes HTML first, then wraps comments / strings / decorators / keywords.
 * Not a real parser — enough for the short samples on this page.
 *
 * @param {string} source - Raw code text (never user input).
 * @returns {string} HTML string safe to assign via `dangerouslySetInnerHTML`.
 */
export function highlightCode(source) {
  const escaped = source
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped.replace(TOKEN_RE, (match) => {
    if (match.startsWith('#') || match.startsWith('//')) {
      return `<span class="tok-comment">${match}</span>`;
    }
    if (match.startsWith('@')) {
      return `<span class="tok-deco">${match}</span>`;
    }
    if (/^['"`]/.test(match)) {
      return `<span class="tok-string">${match}</span>`;
    }
    return `<span class="tok-kw">${match}</span>`;
  });
}
