import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { projects } from "@portfolio/content";
import { Navbar } from "./components/Navbar.tsx";
import { Hero } from "./components/sections/Hero.tsx";
import { ProofStrip } from "./components/sections/ProofStrip.tsx";
import { Work } from "./components/sections/Work.tsx";
import { Hytel } from "./components/sections/Hytel.tsx";
import { About } from "./components/sections/About.tsx";
import { Journey } from "./components/sections/Journey.tsx";
import { Toolkit } from "./components/sections/Toolkit.tsx";
import { TestimonialInvite, Testimonials } from "./components/sections/Testimonials.tsx";
import { Contact } from "./components/sections/Contact.tsx";
import { Footer } from "./components/Footer.tsx";
import { CursorGlow } from "./components/CursorGlow.tsx";
import { ScrollProgress, Toaster } from "./components/ui.tsx";
import { initAnalytics, track } from "./lib/firebase.ts";
import { scrollToId } from "./lib/utils.ts";

// The palette isn't needed for the first paint: load it on first use
// (and prefetch it once the page is idle so it still opens instantly).
const loadPalette = () => import("./components/CommandPalette.tsx");
const CommandPalette = lazy(() => loadPalette().then((m) => ({ default: m.CommandPalette })));

function whenIdle(cb: () => void) {
  const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(cb);
  else window.setTimeout(cb, 1500);
}

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteMounted, setPaletteMounted] = useState(false);
  const [caseId, setCaseId] = useState(projects[0]!.id);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  /** Switch the case-study tab (and record it). */
  const selectCase = useCallback((id: string) => {
    setCaseId(id);
    track("project_open", { project_id: id });
  }, []);

  /** From elsewhere on the page (palette, toolkit): switch tab and scroll to it. */
  const openCase = useCallback(
    (id: string) => {
      selectCase(id);
      window.setTimeout(() => scrollToId("work"), 30);
    },
    [selectCase],
  );

  useEffect(() => {
    if (paletteOpen) {
      setPaletteMounted(true);
      track("palette_open");
    }
  }, [paletteOpen]);

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
    // after the page has settled: prefetch the palette, then (later still) start analytics
    let id = 0;
    whenIdle(() => {
      void loadPalette();
      id = window.setTimeout(() => void initAnalytics(), 4000);
    });

    // one listener covers every external link (GitHub, LinkedIn, demos, repos…)
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
        <Hero />
        <ProofStrip />
        <Work activeId={caseId} onSelect={selectCase} />
        <Hytel />
        <About />
        <Journey />
        <Toolkit onOpenCase={openCase} />
        <Testimonials />
        <TestimonialInvite />
        <Contact />
      </main>

      <Footer />

      <Suspense fallback={null}>
        {paletteMounted && <CommandPalette open={paletteOpen} onClose={closePalette} onOpenCase={openCase} />}
      </Suspense>
      <Toaster />
    </>
  );
}
