import type { CSSProperties } from "react";
import { ArrowRight, Download, Mail, MapPin } from "lucide-react";
import { profile } from "@portfolio/content";
import { NowCard } from "../NowCard.tsx";
import { GitHubIcon, LinkedInIcon } from "../ui.tsx";
import { cvUrl, scrollToId } from "../../lib/utils.ts";
import { track } from "../../lib/firebase.ts";

/** CSS-only entrance (runs on the pre-rendered HTML, before any JS). */
const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

const LINKS = [
  { label: "GitHub", href: profile.github, icon: GitHubIcon, external: true },
  { label: "LinkedIn", href: profile.linkedin, icon: LinkedInIcon, external: true },
  { label: "Email", href: `mailto:${profile.email}`, icon: Mail, external: false },
];

export function Hero() {
  return (
    <section id="home" aria-label="Introduction" className="relative overflow-hidden pb-20 pt-28 sm:pt-32 lg:pb-28 lg:pt-40">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="mx-auto hidden h-full max-w-[76rem] border-x border-line [mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_82%,transparent)] lg:block" />
      </div>

      <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
        <div className="min-w-0">
          <div className="rise" style={delay(0)}>
            <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-line py-1.5 pl-2 pr-4 text-xs font-medium text-muted sm:text-sm">
              <span className="flex items-center gap-2 rounded-full bg-fg/6 px-2.5 py-0.5 text-fg">
                <span className="size-2 rounded-full bg-accent" />
                {profile.role} at {profile.company}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" /> {profile.location}
              </span>
            </span>
          </div>

          <h1 className="mt-7">
            <span
              className="rise block font-display text-lg font-semibold tracking-tight text-muted sm:text-xl"
              style={delay(0.06)}
            >
              {profile.name}
            </span>
            <span
              className="rise mt-3 block font-display text-[clamp(2.7rem,7.2vw,5.4rem)] font-bold leading-[0.95] tracking-[-0.045em] text-balance"
              style={delay(0.14)}
            >
              {profile.pitch.lead} <span className="accent-word">{profile.pitch.accent}</span>
            </span>
          </h1>

          <p className="rise mt-6 max-w-xl text-[17px] leading-relaxed text-muted sm:text-lg" style={delay(0.22)}>
            {profile.intro}
          </p>

          <div className="rise mt-9 flex flex-wrap items-center gap-3" style={delay(0.3)}>
            <a
              href="#work"
              onClick={(ev) => {
                ev.preventDefault();
                scrollToId("work");
              }}
              className="btn btn-primary group"
            >
              View case studies
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href={cvUrl} download className="btn btn-ghost" onClick={() => track("cv_download", { source: "hero" })}>
              <Download className="size-4" />
              Download CV
            </a>
          </div>

          <ul className="rise mt-7 flex flex-wrap gap-2" style={delay(0.38)}>
            {LINKS.map(({ label, href, icon: Icon, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-fg"
                >
                  <Icon className="size-3.5" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="rise min-w-0" style={delay(0.3)}>
          <NowCard />
        </div>
      </div>
    </section>
  );
}
