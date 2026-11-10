import { ArrowUp } from "lucide-react";
import { profile } from "@portfolio/content";
import { Monogram } from "./Navbar.tsx";
import { GitHubIcon } from "./ui.tsx";
import { useClock } from "../lib/hooks.ts";
import { scrollToId } from "../lib/utils.ts";

export function Footer() {
  const time = useClock(profile.timezone);
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[1] border-t border-line">
      <div className="container-page overflow-hidden pt-16">
        {/* oversized signature — purely decorative, so it's drawn with CSS content
            (screen readers and contrast checkers skip it) */}
        <div
          aria-hidden
          data-text={profile.firstName}
          className="select-none whitespace-nowrap font-display text-[clamp(3.5rem,15vw,13rem)] font-bold leading-[0.8] tracking-[-0.06em] text-fg/[0.06] before:content-[attr(data-text)] after:text-accent after:content-['.']"
        />
      </div>
      <div className="container-page flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Monogram />
          <div className="text-sm">
            <p className="font-medium">© {year} {profile.name}</p>
            <p className="text-muted">Designed &amp; built in Lusaka · React, Vite &amp; Turborepo</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted">
            Lusaka <span className="text-fg">{time}</span> {profile.timezoneLabel}
          </span>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="grid size-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <GitHubIcon className="size-4" />
          </a>
          <button
            type="button"
            onClick={() => scrollToId("home")}
            aria-label="Back to top"
            className="grid size-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
