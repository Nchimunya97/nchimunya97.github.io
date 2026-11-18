// Prints dist/cv/index.html to dist/<cvFile>.pdf with headless Chrome, so the
// downloadable CV is regenerated from the site's content on every build.
//
// Chrome: set CHROME_PATH, or a standard install is detected (GitHub's Ubuntu
// runners ship google-chrome). In CI a missing Chrome fails the build, so a
// stale or missing CV can never be deployed; locally it only warns.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const cvHtml = path.join(dist, "cv", "index.html");
const CV_FILE = "Nchimunya_Sikanyiti_CV.pdf"; // keep in sync with profile.cvFile

const candidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);
const chrome = candidates.find((p) => fs.existsSync(p));

if (!chrome) {
  const msg = "cv-pdf: no Chrome/Chromium found (set CHROME_PATH) — CV PDF not generated";
  if (process.env.CI) throw new Error(msg);
  console.warn(`⚠ ${msg}`);
  process.exit(0);
}
if (!fs.existsSync(cvHtml)) throw new Error("cv-pdf: dist/cv/index.html missing — run prerender first");

const { default: puppeteer } = await import("puppeteer-core");
const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--allow-file-access-from-files"],
});
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(cvHtml).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMediaType("print");

  const footer = `
    <div style="width:100%; padding:0 16mm; display:flex; justify-content:space-between;
                font-family:'JetBrains Mono',monospace; font-size:6.5pt; color:#8a8476;">
      <span>Nchimunya Sikanyiti · nchimunya97.github.io</span>
      <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
    </div>`;

  const out = path.join(dist, CV_FILE);
  await page.pdf({
    path: out,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: footer,
    tagged: true,
  });
  const kb = (fs.statSync(out).size / 1024).toFixed(0);
  console.log(`cv-pdf: wrote dist/${CV_FILE} (${kb} KB) using ${path.basename(chrome)}`);
} finally {
  await browser.close();
}
