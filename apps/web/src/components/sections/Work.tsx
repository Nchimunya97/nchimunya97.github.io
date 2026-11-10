import { useRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, FileText } from "lucide-react";
import { profile, projects, type CaseLink, type Project } from "@portfolio/content";
import { GitHubIcon, Reveal, SectionHeading } from "../ui.tsx";
import { cn } from "../../lib/utils.ts";

const ease = [0.16, 1, 0.3, 1] as const;

function hrefFor(link: CaseLink) {
  // site-relative documents (the proposal PDF) need the deploy base path
  return /^https?:/.test(link.href) ? link.href : `${import.meta.env.BASE_URL}${link.href}`;
}

function LinkButton({ link, primary }: { link: CaseLink; primary?: boolean }) {
  const Icon = link.kind === "code" ? GitHubIcon : link.kind === "document" ? FileText : ArrowUpRight;
  return (
    <a
      href={hrefFor(link)}
      target="_blank"
      rel="noreferrer"
      className={cn("btn h-11 px-5 text-sm", primary ? "btn-primary" : "btn-ghost")}
    >
      {link.kind !== "demo" && <Icon className="size-4" />}
      {link.label}
      {link.kind === "demo" && <Icon className="size-4" />}
    </a>
  );
}

function CaseStudy({ project }: { project: Project }) {
  return (
    <article
      aria-labelledby={`case-${project.id}-title`}
      className="grid gap-9 rounded-[1.75rem] border border-line bg-surface p-6 sm:p-9 lg:p-12"
    >
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="min-w-0 max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{project.category}</p>
          <h3
            id={`case-${project.id}-title`}
            className="mt-2.5 font-display text-[clamp(1.9rem,4vw,2.75rem)] font-bold leading-[1.02] tracking-[-0.035em]"
          >
            {project.title}
          </h3>
          {project.context && (
            <p className="mt-2 inline-flex rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted">
              {project.context}
            </p>
          )}
          <p className="mt-4 text-[17px] leading-relaxed text-muted sm:text-lg">{project.oneLiner}</p>
        </div>
        {(project.primary || project.secondary) && (
          <div className="flex flex-wrap gap-2.5">
            {project.primary && <LinkButton link={project.primary} primary />}
            {project.secondary && <LinkButton link={project.secondary} />}
          </div>
        )}
      </header>

      <div className="border-l-2 border-accent py-1 pl-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">Outcome</p>
        <p className="mt-1.5 font-display text-[clamp(1.2rem,2.3vw,1.6rem)] font-semibold leading-snug tracking-[-0.015em] text-pretty">
          {project.outcome}
        </p>
      </div>

      <ol className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
        {project.steps.map((s, i) => (
          <li key={s.heading} className="border-t border-line-strong pt-4">
            <p className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, "0")}</p>
            <h4 className="mt-1.5 text-[17px] font-semibold">{s.heading}</h4>
            <p className="mt-2 text-[15px] leading-relaxed text-muted text-pretty">{s.body}</p>
          </li>
        ))}
      </ol>

      <ul className="flex flex-wrap gap-2" aria-label="Stack and skills">
        {project.stack.map((s) => (
          <li key={s} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
            {s}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Work({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const active = projects.find((p) => p.id === activeId) ?? projects[0]!;

  // arrow keys move between tabs (WAI-ARIA tabs pattern)
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = projects[(index + dir + projects.length) % projects.length]!;
    onSelect(next.id);
    tabRefs.current[next.id]?.focus();
  };

  return (
    <section id="work" className="relative py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          index="01"
          eyebrow="Selected work"
          title={
            <>
              Case <span className="accent-word">studies.</span>
            </>
          }
          description="The problem, my part in it, the decisions that mattered, and what I'd do differently."
        />

        <Reveal delay={0.05}>
          <div role="tablist" aria-label="Case studies" className="mt-9 flex flex-wrap gap-2">
            {projects.map((p, i) => {
              const on = p.id === active.id;
              return (
                <button
                  key={p.id}
                  ref={(el) => {
                    tabRefs.current[p.id] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`tab-${p.id}`}
                  aria-selected={on}
                  aria-controls="case-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => onSelect(p.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={cn(
                    "relative isolate rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    on ? "border-accent text-accent-fg" : "border-line-strong text-muted hover:text-fg",
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="case-tab"
                      className="absolute inset-0 -z-10 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                  {p.short}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div id="case-panel" role="tabpanel" aria-labelledby={`tab-${active.id}`} className="mt-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease }}
            >
              <CaseStudy project={active} />
            </motion.div>
          </AnimatePresence>
        </div>

        <Reveal className="mt-10 flex justify-center">
          <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-ghost group">
            <GitHubIcon className="size-4" />
            Everything else on GitHub
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
