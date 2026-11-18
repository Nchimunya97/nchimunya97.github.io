// Build-time entry, used by scripts/prerender.mjs:
//   render()   → the portfolio page, pre-rendered for fast first paint (React hydrates it)
//   renderCv() → the CV as a complete static HTML document (no JavaScript at all)
import { StrictMode } from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { MotionConfig } from "motion/react";
import { profile } from "@portfolio/content";
import App from "./App.tsx";
import { CvDocument } from "./cv/CvDocument.tsx";
import cvCss from "./cv/cv.css?raw";

export function render() {
  return renderToString(
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </StrictMode>,
  );
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export function renderCv() {
  const title = `${profile.name} — CV`;
  const description = `CV of ${profile.name}, ${profile.role} at ${profile.company} in ${profile.location}.`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<meta name="author" content="${esc(profile.name)}" />
<link rel="canonical" href="${profile.website}/cv/" />
<link rel="icon" type="image/svg+xml" href="../favicon.svg" />
<style>${cvCss}</style>
</head>
<body>
${renderToStaticMarkup(<CvDocument />)}
</body>
</html>
`;
}
