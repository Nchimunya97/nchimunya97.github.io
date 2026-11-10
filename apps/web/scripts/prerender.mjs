// Injects the server-rendered page into dist/index.html, so visitors, search
// engines and link previews get real HTML before any JavaScript runs.
// Runs after `vite build` and `vite build --ssr` (see package.json "build").
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const distHtml = path.join(root, "dist", "index.html");
const ssrDir = path.join(root, "dist-ssr");

const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);

const template = fs.readFileSync(distHtml, "utf8");
const marker = '<div id="root"></div>';
if (!template.includes(marker)) throw new Error(`prerender: ${marker} not found in dist/index.html`);

const appHtml = render();
fs.writeFileSync(distHtml, template.replace(marker, `<div id="root">${appHtml}</div>`));
fs.rmSync(ssrDir, { recursive: true, force: true });

console.log(`prerender: wrote ${(appHtml.length / 1024).toFixed(1)} KB of HTML into dist/index.html`);
