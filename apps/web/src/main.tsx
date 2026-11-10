import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import App from "./App.tsx";
import "./index.css";
import { initSmoothScroll } from "./lib/smooth-scroll.ts";

initSmoothScroll();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
);
