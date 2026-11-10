import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Briefcase, ChevronDown, GraduationCap } from "lucide-react";
import { education, experience, type Education, type Experience } from "@portfolio/content";
import { Reveal, SectionHeading } from "../ui.tsx";
import { cn } from "../../lib/utils.ts";
import { useInverseTheme } from "../../lib/theme.ts";

type Tab = "work" | "education";

const TABS: { id: Tab; label: string; icon: typeof Briefcase; count: number }[] = [
  { id: "work", label: "Work", icon: Briefcase, count: experience.length },
  { id: "education", label: "Education", icon: GraduationCap, count: education.length },
];

function TimelineNode({ current }: { current?: boolean }) {
  return (
    <span className="absolute left-0 top-6 grid size-[23px] place-items-center rounded-full border border-line-strong bg-bg">
      {current && (
        <span className="absolute inset-0 animate-ping rounded-full bg-accent-2/40" aria-hidden />
      )}
      <span className={cn("size-2 rounded-full", current ? "bg-accent-2" : "bg-accent")} />
    </span>
  );
}

function ExperienceCard({ item, defaultOpen }: { item: Experience; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `exp-${item.id}`;

  return (
    <div className="group rounded-2xl border border-line bg-surface/60 transition-colors hover:border-line-strong">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-start gap-4 rounded-2xl p-5 text-left sm:p-6"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-subtle">{item.period}</span>
            {item.current ? (
              <span className="chip border-accent-2/30 bg-accent-2/10 py-0.5 text-[11px] text-accent-2">
                Current
              </span>
            ) : (
              <span className="chip py-0.5 text-[11px]">{item.kind}</span>
            )}
          </div>
          <h3 className="mt-2 font-display text-xl font-semibold tracking-tight sm:text-2xl">
            {item.role}
          </h3>
          <p className="mt-0.5 text-[15px] font-medium text-accent">
            {item.org}
            {item.orgDetail && <span className="text-muted"> · {item.orgDetail}</span>}
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">{item.summary}</p>
        </div>
        <span
          className={cn(
            "mt-1 grid size-9 shrink-0 place-items-center rounded-full border border-line text-muted transition-all group-hover:border-line-strong group-hover:text-fg",
            open && "rotate-180 border-accent/40 text-accent",
          )}
          aria-hidden
        >
          <ChevronDown className="size-4" />
        </span>
        <span className="sr-only">{open ? "Hide details" : "Show details"}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-line px-5 pb-6 pt-5 sm:px-6">
              <ul className="space-y-3">
                {item.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                    <span className="mt-[0.6em] size-1.5 shrink-0 rotate-45 bg-accent" aria-hidden />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Skills used">
                {item.skills.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EducationCard({ item }: { item: Education }) {
  return (
    <div className="rounded-2xl border border-line bg-surface/60 p-5 transition-colors hover:border-line-strong sm:p-6">
      <span className="font-mono text-xs text-subtle">{item.period}</span>
      <h3 className="mt-2 font-display text-xl font-semibold tracking-tight sm:text-2xl">
        {item.credential}
      </h3>
      <p className="mt-0.5 text-[15px] font-medium text-accent">{item.school}</p>
      <p className="mt-3 text-[15px] text-muted">{item.location}</p>
      {item.note && (
        <p className="mt-4 inline-flex rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-muted">
          {item.note}
        </p>
      )}
    </div>
  );
}

export function Journey() {
  const inverse = useInverseTheme();
  const [tab, setTab] = useState<Tab>("work");
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 75%", "end 55%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <section id="journey" data-theme={inverse} data-section-invert="" className="relative py-24 sm:py-32">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-line-strong to-transparent" />
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              index="02"
              eyebrow="Journey"
              title={
                <>
                  Where I&apos;ve been <span className="accent-word">building.</span>
                </>
              }
              description="Field data work taught me why accuracy matters. Engineering lets me build it into every product."
            />

            <Reveal delay={0.1}>
              <div
                role="tablist"
                aria-label="Journey type"
                className="mt-8 inline-flex rounded-full border border-line bg-surface/60 p-1"
              >
                {TABS.map(({ id, label, icon: Icon, count }) => (
                  <button
                    key={id}
                    role="tab"
                    type="button"
                    aria-selected={tab === id}
                    aria-controls="journey-panel"
                    onClick={() => setTab(id)}
                    className={cn(
                      "relative isolate flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      tab === id ? "text-accent-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {tab === id && (
                      <motion.span
                        layoutId="journey-tab"
                        className="absolute inset-0 -z-10 rounded-full bg-accent"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                    <Icon className="size-4" />
                    {label}
                    <span
                      className={cn(
                        "rounded-full px-1.5 text-[11px] font-semibold",
                        tab === id ? "bg-black/15" : "bg-surface-2",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div ref={listRef} id="journey-panel" role="tabpanel" className="relative">
            {/* rail */}
            <div aria-hidden className="absolute bottom-4 left-[11px] top-4 w-px bg-line" />
            <motion.div
              aria-hidden
              style={{ scaleY: progress }}
              className="absolute bottom-4 left-[11px] top-4 w-px origin-top bg-accent"
            />

            <AnimatePresence mode="wait">
              <motion.ol
                key={tab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-5"
              >
                {tab === "work"
                  ? experience.map((item, i) => (
                      <li key={item.id} className="relative pl-10 sm:pl-12">
                        <TimelineNode current={item.current} />
                        <Reveal delay={i * 0.04}>
                          <ExperienceCard item={item} defaultOpen={i === 0} />
                        </Reveal>
                      </li>
                    ))
                  : education.map((item, i) => (
                      <li key={item.id} className="relative pl-10 sm:pl-12">
                        <TimelineNode />
                        <Reveal delay={i * 0.04}>
                          <EducationCard item={item} />
                        </Reveal>
                      </li>
                    ))}
              </motion.ol>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
