import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import type { Project } from "@portfolio/content";
import { Navbar } from "./components/Navbar.tsx";
import { Hero } from "./components/sections/Hero.tsx";
import { About } from "./components/sections/About.tsx";
import { Journey } from "./components/sections/Journey.tsx";
import { Projects } from "./components/sections/Projects.tsx";
import { Toolkit } from "./components/sections/Toolkit.tsx";
import { Contact } from "./components/sections/Contact.tsx";
import { Footer } from "./components/Footer.tsx";
import { CursorGlow } from "./components/CursorGlow.tsx";
import { ScrollProgress, Toaster } from "./components/ui.tsx";
import { initAnalytics, track } from "./lib/firebase.ts";

// Dialogs aren't needed for the first paint: load them on first use
// (and prefetch them once the page is idle so they still open instantly).
const loadPalette = () => import("./components/CommandPalette.tsx");
const loadModal = () => import("./components/ProjectModal.tsx");
const CommandPalette = lazy(() => loadPalette().then((m) => ({ default: m.CommandPalette })));
const ProjectModal = lazy(() => loadModal().then((m) => ({ default: m.ProjectModal })));

function whenIdle(cb: () => void) {
  const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(cb);
  else window.setTimeout(cb, 1500);
}

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  // mount each dialog the first time it's needed, then keep it (so exit animations run)
  const [paletteMounted, setPaletteMounted] = useState(false);
  const [modalMounted, setModalMounted] = useState(false);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const closeProject = useCallback(() => setProject(null), []);

  useEffect(() => {
    if (paletteOpen) {
      setPaletteMounted(true);
      track("palette_open");
    }
  }, [paletteOpen]);

  useEffect(() => {
    if (project) setModalMounted(true);
  }, [project]);

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
    // after the page has settled: prefetch dialogs, then (later still) start analytics,
    // so neither competes with the first paint
    let id = 0;
    whenIdle(() => {
      void loadPalette();
      void loadModal();
      id = window.setTimeout(() => void initAnalytics(), 4000);
    });

    // one listener covers every external link (GitHub profile, repos, …)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a[href^='http']") as HTMLAnchorElement | null;
      if (!a || a.host === window.location.host) return;
      track("outbound_click", { url: `${a.host}${a.pathname}`.slice(0, 100) });
    };
    document.addEventListener("click", onClick);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("click", onClick);
    };
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

      <Suspense fallback={null}>
        {paletteMounted && (
          <CommandPalette open={paletteOpen} onClose={closePalette} onOpenProject={setProject} />
        )}
        {modalMounted && <ProjectModal project={project} onClose={closeProject} onNavigate={setProject} />}
      </Suspense>
      <Toaster />
      <div aria-hidden className="grain" />
    </>
  );
}
