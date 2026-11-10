// Build-time entry: renders the page to static HTML (used by scripts/prerender.mjs).
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { MotionConfig } from "motion/react";
import App from "./App.tsx";

export function render() {
  return renderToString(
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </StrictMode>,
  );
}
