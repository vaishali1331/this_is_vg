import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import ProjectInnDocs from './components/ProjectInnDocs.jsx';
import ProjectArena from './components/ProjectArena.jsx';
import Experience from './components/Experience.jsx';
import Skills from './components/Skills.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';

/**
 * Top-level page composition. This mirrors the section order of the
 * original static index.html exactly — nav, hero, two project
 * write-ups, experience timeline, skills grid, about, contact footer.
 *
 * Drop new React Bits components (https://reactbits.dev) in as new
 * children here, or inside any of the section components under
 * src/components/, once installed via the CLI (see README.md).
 */
export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <ProjectInnDocs />
      <ProjectArena />
      <Experience />
      <Skills />
      <About />
      <Contact />
    </>
  );
}
