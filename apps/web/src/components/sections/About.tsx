import { Clock, Download, Mail, MapPin, ShieldCheck, Target, Zap } from "lucide-react";
import { principles, profile, type Principle } from "@portfolio/content";
import { GitHubIcon, LinkedInIcon, Reveal, SectionHeading } from "../ui.tsx";
import { Wordmark } from "../Navbar.tsx";
import { useClock } from "../../lib/hooks.ts";
import { cvUrl } from "../../lib/utils.ts";
import { track } from "../../lib/firebase.ts";

const PRINCIPLE_ICONS: Record<Principle["icon"], typeof Target> = {
  target: Target,
  shield: ShieldCheck,
  zap: Zap,
};

export function About() {
  const time = useClock(profile.timezone);

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              index="03"
              eyebrow="About"
              title={
                <>
                  From counting households to <span className="accent-word">shipping production code.</span>
                </>
              }
            />
            <div className="mt-8 space-y-5 text-base leading-[1.8] text-muted sm:text-[17px]">
              {profile.story.map((para, i) => (
                <Reveal key={i} delay={0.04 * i}>
                  <p>{para}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.1} className="lg:sticky lg:top-28">
              <div className="rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-7">
                <div className="flex items-center gap-4">
                  <span aria-hidden className="grid size-14 shrink-0 place-items-center rounded-2xl border border-line-strong bg-bg">
                    <Wordmark className="text-xl" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-xl font-semibold tracking-tight">{profile.name}</p>
                    <p className="text-sm text-muted">
                      {profile.role} · {profile.company}
                    </p>
                  </div>
                </div>

                <ul className="mt-6 divide-y divide-line border-y border-line text-[15px]">
                  {[
                    { icon: LinkedInIcon, label: "LinkedIn", value: "Connect with me", href: profile.linkedin },
                    { icon: GitHubIcon, label: "GitHub", value: `@${profile.githubUser}`, href: profile.github },
                    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                        className="group flex items-center gap-3 py-3 transition-colors hover:text-accent"
                      >
                        <Icon className="size-4 text-subtle transition-colors group-hover:text-accent" />
                        <span className="w-20 shrink-0 text-subtle">{label}</span>
                        <span className="truncate">{value}</span>
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
                  <span className="flex items-center gap-2">
                    <MapPin className="size-4 text-accent" />
                    {profile.location}
                  </span>
                  <span className="flex items-center gap-2 font-mono text-xs">
                    <Clock className="size-4" />
                    {time || "--:--"} {profile.timezoneLabel}
                  </span>
                </div>

                <a
                  href={cvUrl}
                  download
                  onClick={() => track("cv_download", { source: "about" })}
                  className="btn btn-ghost mt-6 w-full"
                >
                  <Download className="size-4" /> Download CV
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:mt-20 md:grid-cols-3">
          {principles.map((p, i) => {
            const Icon = PRINCIPLE_ICONS[p.icon];
            return (
              <Reveal key={p.title} delay={i * 0.07} className="h-full">
                <div className="h-full rounded-2xl border border-line bg-surface/60 p-6">
                  <Icon className="size-5 text-accent" />
                  <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
