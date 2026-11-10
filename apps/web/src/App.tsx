import { useCallback, useEffect, useState } from "react";
import type { Project } from "@portfolio/content";
import { Navbar } from "./components/Navbar.tsx";
import { Hero } from "./components/sections/Hero.tsx";
import { About } from "./components/sections/About.tsx";
import { Journey } from "./components/sections/Journey.tsx";
import { Projects } from "./components/sections/Projects.tsx";
import { Toolkit } from "./components/sections/Toolkit.tsx";
import { Contact } from "./components/sections/Contact.tsx";
import { Footer } from "./components/Footer.tsx";
import { CommandPalette } from "./components/CommandPalette.tsx";
import { ProjectModal } from "./components/ProjectModal.tsx";
import { CursorGlow } from "./components/CursorGlow.tsx";
import { ScrollProgress, Toaster } from "./components/ui.tsx";
import { initAnalytics } from "./lib/firebase.ts";

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const closeProject = useCallback(() => setProject(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        !!target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    // after the page has settled, start analytics in the background
    const id = window.setTimeout(() => void initAnalytics(), 2500);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <CursorGlow />
      <ScrollProgress />
      <Navbar onOpenPalette={openPalette} />

      <main id="main" className="relative z-[1]">
        <Hero onOpenPalette={openPalette} />
        <About />
        <Journey />
        <Projects onOpen={setProject} />
        <Toolkit onOpenProject={setProject} />
        <Contact />
      </main>

      <Footer />

      <CommandPalette open={paletteOpen} onClose={closePalette} onOpenProject={setProject} />
      <ProjectModal project={project} onClose={closeProject} onNavigate={setProject} />
      <Toaster />
      <div aria-hidden className="grain" />
    </>
  );
}
