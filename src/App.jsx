import { PortfolioProvider } from './context/PortfolioContext.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import ProjectInnDocs from './components/ProjectInnDocs.jsx';
import ProjectArena from './components/ProjectArena.jsx';
import Experience from './components/Experience.jsx';
import Skills from './components/Skills.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import CommandPalette from './components/CommandPalette.jsx';

/**
 * Top-level page composition. Section order is unchanged — nav, hero,
 * two project write-ups, experience, skills, about, contact — with the
 * command palette mounted last so it overlays everything.
 */
export default function App() {
  return (
    <PortfolioProvider>
      <Nav />
      <Hero />
      <ProjectInnDocs />
      <ProjectArena />
      <Experience />
      <Skills />
      <About />
      <Contact />
      <CommandPalette />
    </PortfolioProvider>
  );
}
