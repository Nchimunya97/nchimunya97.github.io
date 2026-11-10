import { ArrowUp, Mail } from "lucide-react";
import { profile } from "@portfolio/content";
import { Wordmark } from "./Navbar.tsx";
import { GitHubIcon, LinkedInIcon } from "./ui.tsx";
import { useClock } from "../lib/hooks.ts";
import { scrollToId } from "../lib/utils.ts";

const iconBtn =
  "grid size-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent";

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
        <div className="flex items-center gap-4">
          <span aria-hidden className="text-lg">
            <Wordmark />
          </span>
          <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-subtle">
            <p>© {year} {profile.name}</p>
            <p className="mt-1">
              {profile.location.split(",")[0]} · 15.4167° S {time && `· ${time} ${profile.timezoneLabel}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className={iconBtn}>
            <LinkedInIcon className="size-4" />
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className={iconBtn}>
            <GitHubIcon className="size-4" />
          </a>
          <a href={`mailto:${profile.email}`} aria-label="Email" className={iconBtn}>
            <Mail className="size-4" />
          </a>
          <button type="button" onClick={() => scrollToId("home")} aria-label="Back to top" className={iconBtn}>
            <ArrowUp className="size-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
