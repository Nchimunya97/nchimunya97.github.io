// Runs after `vite build` and `vite build --ssr` (see package.json "build"):
//  1. injects the server-rendered page into dist/index.html, so visitors, search
//     engines and link previews get real HTML before any JavaScript runs;
//  2. writes the CV as a static page at dist/cv/index.html (printed to PDF next
//     by scripts/cv-pdf.mjs).
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const { render, renderCv } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);

// 1. portfolio page
const distHtml = path.join(dist, "index.html");
const template = fs.readFileSync(distHtml, "utf8");
const marker = '<div id="root"></div>';
if (!template.includes(marker)) throw new Error(`prerender: ${marker} not found in dist/index.html`);
const appHtml = render();
fs.writeFileSync(distHtml, template.replace(marker, `<div id="root">${appHtml}</div>`));
console.log(`prerender: wrote ${(appHtml.length / 1024).toFixed(1)} KB of HTML into dist/index.html`);

// 2. CV page
const cvDir = path.join(dist, "cv");
fs.mkdirSync(cvDir, { recursive: true });
const cvHtml = renderCv();
fs.writeFileSync(path.join(cvDir, "index.html"), cvHtml);
console.log(`prerender: wrote dist/cv/index.html (${(cvHtml.length / 1024).toFixed(1)} KB)`);

fs.rmSync(ssrDir, { recursive: true, force: true });
