import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Briefcase, Cloud, Database, FolderGit2, GitBranch, Smartphone, Sparkles } from "lucide-react";
import {
  projects,
  skillGroups,
  softSkills,
  whereUsed,
  type SkillGroup,
} from "@portfolio/content";
import { Reveal, SectionHeading } from "../ui.tsx";
import { cn } from "../../lib/utils.ts";
import { track } from "../../lib/firebase.ts";

const GROUP_ICONS: Record<SkillGroup["icon"], typeof Cloud> = {
  smartphone: Smartphone,
  cloud: Cloud,
  database: Database,
  git: GitBranch,
};

function UsagePanel({
  skill,
  onOpenCase,
  className,
}: {
  skill: string;
  onOpenCase: (id: string) => void;
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
                    u.kind === "role" ? "bg-fg/8 text-fg" : "bg-accent/12 text-accent",
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
                    onClick={() => onOpenCase(project.id)}
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
  onOpenCase,
  index,
}: {
  group: SkillGroup;
  selected: string;
  onSelect: (s: string) => void;
  onOpenCase: (id: string) => void;
  index: number;
}) {
  const Icon = GROUP_ICONS[group.icon];
  const hasSelected = group.skills.includes(selected);

  return (
    <Reveal delay={index * 0.06} className="h-full">
      <div
        className={cn(
          "h-full rounded-2xl border bg-surface/60 p-5 transition-colors sm:p-6",
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
                onOpenCase={onOpenCase}
                className="mt-5 border-t border-line pt-5"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

export function Toolkit({ onOpenCase }: { onOpenCase: (id: string) => void }) {
  const [selected, setSelected] = useState("React");

  return (
    <section id="toolkit" className="relative py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          index="05"
          eyebrow="Toolkit"
          title={
            <>
              Tools I <span className="accent-word">reach for.</span>
            </>
          }
          description="Tap any skill to see exactly where I've put it to work — every role and case study is linked."
        />
      </div>

      <div className="container-page mt-12 grid gap-5 lg:grid-cols-12">
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
              onOpenCase={onOpenCase}
            />
          ))}
        </div>

        <div className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-28 space-y-5">
            <div className="rounded-2xl border border-accent/30 bg-surface/70 p-6 shadow-card">
              <AnimatePresence mode="wait">
                <UsagePanel key={selected} skill={selected} onOpenCase={onOpenCase} />
              </AnimatePresence>
            </div>
          </div>
        </div>

        <Reveal className="lg:col-span-12">
          <div className="rounded-2xl border border-line bg-surface/60 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl border border-line bg-surface-2 text-accent">
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
