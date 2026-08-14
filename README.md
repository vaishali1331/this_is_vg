# Vaishali Gangwar — Portfolio

A single-page, dependency-free static portfolio site for Vaishali Gangwar
(Full Stack Engineer, AI & Platform).

## Structure

```
.
├── index.html    # Page markup and content (projects, experience, skills, about, contact)
├── styles.css    # Dark theme styling, layout, and responsive rules
├── script.js     # Scroll-reveal animation for [data-reveal] sections
└── README.md
```

## Tech

- Plain HTML5 / CSS3 / vanilla JavaScript — no build step, no framework, no dependencies.
- Fonts: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (UI/body) and
  [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (code/labels), loaded from Google Fonts.
- Scroll-in animations via the native `IntersectionObserver` API (with a graceful
  fallback for unsupported browsers).

## Running locally

No build tools required — just serve the folder statically. For example:

```bash
# Python 3
python3 -m http.server 8000

# or Node (if you have `serve` installed)
npx serve .
```

Then open `http://localhost:8000` in your browser.

## Deploying

Since this is a static site, it can be hosted as-is on any static host
(GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.) by pointing the host
at the repository root.
