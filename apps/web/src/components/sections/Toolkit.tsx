import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Briefcase, Cloud, Database, FolderGit2, GitBranch, Smartphone, Sparkles } from "lucide-react";
import {
  marquee,
  projects,
  skillGroups,
  softSkills,
  whereUsed,
  type Project,
  type SkillGroup,
} from "@portfolio/content";
import { Reveal, SectionHeading } from "../ui.tsx";
import { useSpotlight } from "../../lib/hooks.ts";
import { cn } from "../../lib/utils.ts";
import { useInverseTheme } from "../../lib/theme.ts";
import { track } from "../../lib/firebase.ts";

const GROUP_ICONS: Record<SkillGroup["icon"], typeof Cloud> = {
  smartphone: Smartphone,
  cloud: Cloud,
  database: Database,
  git: GitBranch,
};

function Marquee({ items, reverse }: { items: string[]; reverse?: boolean }) {
  return (
    <div className="mask-fade-x group flex overflow-hidden">
      {[0, 1].map((copy) => (
        <ul
          key={copy}
          aria-hidden={copy === 1}
          className={cn(
            "flex shrink-0 animate-marquee items-center gap-3 pr-3 group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
          )}
        >
          {items.map((t) => (
            <li
              key={t}
              className="whitespace-nowrap rounded-full border border-line bg-surface/70 px-4 py-2 font-display text-base font-medium tracking-tight text-muted sm:px-5 sm:py-2.5 sm:text-xl"
            >
              {t}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

function UsagePanel({
  skill,
  onOpenProject,
  className,
}: {
  skill: string;
  onOpenProject: (p: Project) => void;
  className?: string;
}) {
  const usage = whereUsed(skill);
  return (
    <motion.div
      key={skill}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
      aria-live="polite"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">Where I&apos;ve used</p>
      <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-accent">{skill}</p>
      {usage.length === 0 ? (
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Part of my everyday toolkit for analysis, reporting and getting work done.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {usage.map((u) => {
            const Icon = u.kind === "role" ? Briefcase : FolderGit2;
            const project = u.kind === "project" ? projects.find((p) => p.id === u.id) : undefined;
            const inner = (
              <>
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-lg",
                    u.kind === "role" ? "bg-accent-2/12 text-accent-2" : "bg-accent/12 text-accent",
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{u.title}</span>
                  <span className="block truncate text-xs text-muted">{u.detail}</span>
                </span>
              </>
            );
            return (
              <li key={`${u.kind}-${u.id}`}>
                {project ? (
                  <button
                    type="button"
                    onClick={() => onOpenProject(project)}
                    className="flex w-full items-center gap-3 rounded-xl border border-line bg-surface-2/50 p-2.5 text-left transition-colors hover:border-accent/50"
                  >
                    {inner}
                  </button>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-2/50 p-2.5">
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </motion.div>
  );
}

function GroupCard({
  group,
  selected,
  onSelect,
  onOpenProject,
  index,
}: {
  group: SkillGroup;
  selected: string;
  onSelect: (s: string) => void;
  onOpenProject: (p: Project) => void;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useSpotlight(ref);
  const Icon = GROUP_ICONS[group.icon];
  const hasSelected = group.skills.includes(selected);

  return (
    <Reveal delay={index * 0.06} className="h-full">
      <div
        ref={ref}
        className={cn(
          "spotlight h-full rounded-2xl border bg-surface/60 p-5 transition-colors sm:p-6",
          hasSelected ? "border-accent/40" : "border-line hover:border-line-strong",
        )}
      >
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl border border-line bg-surface-2 text-accent">
            <Icon className="size-5" />
          </span>
          <h3 className="font-display text-lg font-semibold tracking-tight">{group.title}</h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">{group.description}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {group.skills.map((s) => {
            const active = s === selected;
            return (
              <li key={s}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSelect(s)}
                  className={cn(
                    "chip transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:text-fg",
                    active && "border-accent bg-accent text-accent-fg hover:text-accent-fg",
                  )}
                >
                  {s}
                </button>
              </li>
            );
          })}
        </ul>
        <AnimatePresence initial={false}>
          {hasSelected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden lg:hidden"
            >
              <UsagePanel
                skill={selected}
                onOpenProject={onOpenProject}
                className="mt-5 border-t border-line pt-5"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

export function Toolkit({ onOpenProject }: { onOpenProject: (p: Project) => void }) {
  const inverse = useInverseTheme();
  const [selected, setSelected] = useState("React");

  return (
    <section id="toolkit" data-theme={inverse} data-section-invert="" className="relative py-24 sm:py-32">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-line-strong to-transparent" />
      <div className="container-page">
        <SectionHeading
          index="04"
          eyebrow="Toolkit"
          title={
            <>
              Tools I <span className="accent-word">reach for.</span>
            </>
          }
          description="Tap any skill to see exactly where I've put it to work — every role and project is linked."
        />
      </div>

      <div className="mt-12 space-y-3" style={{ ["--marquee-duration" as string]: "75s" }}>
        <Marquee items={marquee} />
        <Marquee items={[...marquee].reverse()} reverse />
      </div>

      <div className="container-page mt-14 grid gap-5 lg:grid-cols-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
          {skillGroups.map((g, i) => (
            <GroupCard
              key={g.id}
              group={g}
              index={i}
              selected={selected}
              onSelect={(s) => {
                setSelected(s);
                track("skill_select", { skill: s });
              }}
              onOpenProject={onOpenProject}
            />
          ))}
        </div>

        <div className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-28 space-y-5">
            <div className="rounded-2xl border border-accent/30 bg-surface/70 p-6 shadow-card">
              <AnimatePresence mode="wait">
                <UsagePanel key={selected} skill={selected} onOpenProject={onOpenProject} />
              </AnimatePresence>
            </div>
          </div>
        </div>

        <Reveal className="lg:col-span-12">
          <div className="rounded-2xl border border-line bg-surface/60 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl border border-line bg-surface-2 text-accent-2">
                <Sparkles className="size-5" />
              </span>
              <h3 className="font-display text-lg font-semibold tracking-tight">Beyond the code</h3>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {softSkills.map((s) => (
                <li key={s} className="chip">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
