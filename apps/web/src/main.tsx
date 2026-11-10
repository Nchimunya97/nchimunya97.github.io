import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import App from "./App.tsx";
// Self-hosted fonts (no render-blocking request to a third-party server)
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource/instrument-serif/400-italic.css";
import "./index.css";
import { initSmoothScroll } from "./lib/smooth-scroll.ts";

initSmoothScroll();

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>
);

// Production builds ship pre-rendered HTML (see scripts/prerender.mjs), which
// React takes over in place; the dev server starts from an empty root.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
