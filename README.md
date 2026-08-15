# Vaishali Gangwar — Portfolio

A single-page portfolio site for Vaishali Gangwar (Full Stack Engineer, AI & Platform),
built with **React + Vite**.

## Structure

```
.
├── index.html              # Vite entry HTML (fonts, meta tags, #root mount point)
├── vite.config.js          # Vite + @vitejs/plugin-react config
├── eslint.config.js        # Flat ESLint config (React + hooks rules)
├── src/
│   ├── main.jsx             # React root render
│   ├── App.jsx               # Composes all page sections, in order
│   ├── index.css              # Global styles — design tokens, layout, animations
│   ├── hooks/
│   │   └── useScrollReveal.js  # Scroll-into-view reveal hook (IntersectionObserver)
│   └── components/
│       ├── Nav.jsx             # Top nav bar
│       ├── Hero.jsx            # Hero header
│       ├── ProjectInnDocs.jsx  # "PROJECT 01" section
│       ├── ProjectArena.jsx    # "PROJECT 02" section
│       ├── Experience.jsx      # Timeline section
│       ├── Skills.jsx          # Stack grid section
│       ├── About.jsx           # About section
│       ├── Contact.jsx         # Footer / contact section
│       ├── TagList.jsx         # Shared tech-tag chip row
│       ├── MetricGrid.jsx      # Shared 3-up metric grid
│       └── CodePanel.jsx       # Shared "editor window" code snippet panel
└── README.md
```

## Tech

- **React 18 + Vite** — fast dev server with HMR, zero-config production build.
- Fonts: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (UI/body) and
  [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (code/labels), loaded from Google Fonts.
- Scroll-in animations via a small `useScrollReveal` hook wrapping the native
  `IntersectionObserver` API (ported 1:1 from the original vanilla-JS `script.js`).
- Plain CSS (no Tailwind) — all design tokens live in `src/index.css` as CSS custom properties.

## Running locally

```bash
npm install
npm run dev       # start the dev server (with hot reload)
npm run build      # production build → dist/
npm run preview     # preview the production build locally
npm run lint          # lint src/ with ESLint
```

## Using React Bits

This project is set up so you can drop in components from
[React Bits](https://reactbits.dev) — a library of animated/interactive React
components. Since this project uses plain CSS (not Tailwind), pick the
**JS + CSS** variant of any component.

Browse a component on [reactbits.dev](https://reactbits.dev), then install it
straight into `src/components/` with the `jsrepo` CLI (no extra config needed):

```bash
npx jsrepo@latest add https://reactbits.dev/r/SplitText-JS-CSS
```

(Replace `SplitText` with the component you want — the CLI identifier is
shown in PascalCase on each component's page.) The `shadcn` CLI works the
same way if you prefer it:

```bash
npx shadcn@latest add https://reactbits.dev/r/SplitText-JS-CSS
```

If a component depends on an external library (e.g. `gsap`, `motion`, `three`),
its Code tab on reactbits.dev lists it — install that dependency with `npm install`
before using the component. Once added, import it like any other component:

```jsx
import SplitText from './components/SplitText.jsx';

<SplitText text="Hello, you!" delay={100} duration={0.6} />
```

## Deploying

`npm run build` produces a static `dist/` folder that can be hosted on any
static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.).
