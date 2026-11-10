import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { profile, projectCategories, projects, type Project } from "@portfolio/content";
import { GitHubIcon, Reveal, SectionHeading } from "../ui.tsx";
import { ProjectArt } from "../ProjectArt.tsx";
import { useSpotlight } from "../../lib/hooks.ts";
import { cn } from "../../lib/utils.ts";

type Filter = (typeof projectCategories)[number]["id"];

const CATEGORY_LABEL: Record<Project["category"], string> = {
  web: "Full-stack Web",
  mobile: "Mobile",
  web3: "Blockchain",
};

function ProjectCard({
  project,
  wide,
  onOpen,
}: {
  project: Project;
  wide: boolean;
  onOpen: (p: Project) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  useSpotlight(ref);
  const shown = project.stack.slice(0, wide ? 7 : 5);
  const extra = project.stack.length - shown.length;

  return (
    <article
      ref={ref}
      className={cn(
        "spotlight group relative flex h-full flex-col gap-6 rounded-3xl border border-line bg-surface/70 p-4 shadow-card transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-line-strong sm:p-5",
        wide && "lg:flex-row lg:items-stretch lg:gap-8 lg:p-6",
      )}
    >
      <ProjectArt
        art={project.art}
        className={cn("aspect-[16/10] w-full shrink-0", wide && "lg:aspect-auto lg:min-h-[22rem] lg:w-[56%]")}
      />

      <div className={cn("flex flex-1 flex-col px-1 pb-1", wide && "lg:justify-center lg:py-4")}>
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
          {CATEGORY_LABEL[project.category]}
          {project.featured && (
            <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 tracking-[0.12em]">
              Featured
            </span>
          )}
        </div>
        <h3 className={cn("mt-3 font-display font-semibold tracking-tight", wide ? "text-2xl sm:text-3xl lg:text-4xl" : "text-2xl")}>
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="text-left after:absolute after:inset-0 after:z-[1] after:rounded-3xl focus-visible:outline-none"
          >
            {project.title}
          </button>
        </h3>
        <p className="mt-1 text-sm text-subtle">{project.subtitle}</p>
        <p className={cn("mt-4 leading-relaxed text-muted", wide ? "text-base sm:text-[17px]" : "text-[15px]")}>
          {project.summary}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech stack">
          {shown.map((s) => (
            <li key={s} className="chip">
              {s}
            </li>
          ))}
          {extra > 0 && <li className="chip text-subtle">+{extra}</li>}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-fg transition-colors group-hover:text-accent">
            View details
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.title} source code on GitHub`}
            className="relative z-[2] inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <GitHubIcon className="size-4" />
            Code
          </a>
        </div>
      </div>
    </article>
  );
}

export function Projects({ onOpen }: { onOpen: (p: Project) => void }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = projects.filter((p) => filter === "all" || p.category === filter);

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-line-strong to-transparent" />
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="03"
            eyebrow="Selected work"
            title={
              <>
                Things I&apos;ve <span className="accent-word">built.</span>
              </>
            }
            description="From a market-levy app used at a Lusaka trading hub to type-safe monorepos and smart contracts."
          />
          <Reveal delay={0.1}>
            <div
              role="group"
              aria-label="Filter projects"
              className="flex flex-wrap gap-1 rounded-2xl border border-line bg-surface/60 p-1 sm:rounded-full"
            >
              {projectCategories.map((c) => {
                const active = filter === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setFilter(c.id)}
                    aria-pressed={active}
                    className={cn(
                      "relative isolate shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition-colors sm:px-4",
                      active ? "text-accent-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="project-filter"
                        className="absolute inset-0 -z-10 rounded-full bg-accent"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                    {c.label}
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        <motion.div layout className="mt-12 grid gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => {
              const wide = !!p.featured && filter === "all";
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(wide && "md:col-span-2")}
                >
                  <ProjectCard project={p} wide={wide} onOpen={onOpen} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <Reveal className="mt-10 flex justify-center">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost group"
          >
            <GitHubIcon className="size-4" />
            More on GitHub
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
