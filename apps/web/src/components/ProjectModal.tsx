import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { projects, type Project } from "@portfolio/content";
import { ProjectArt } from "./ProjectArt.tsx";
import { GitHubIcon } from "./ui.tsx";
import { useScrollLock } from "../lib/hooks.ts";
import { track } from "../lib/firebase.ts";

export function ProjectModal({
  project,
  onClose,
  onNavigate,
}: {
  project: Project | null;
  onClose: () => void;
  onNavigate: (p: Project) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const open = !!project;
  useScrollLock(open);

  const index = project ? projects.findIndex((p) => p.id === project.id) : -1;
  const prev = index >= 0 ? projects[(index - 1 + projects.length) % projects.length] : undefined;
  const next = index >= 0 ? projects[(index + 1) % projects.length] : undefined;

  useEffect(() => {
    if (project) track("project_open", { project_id: project.id });
  }, [project]);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => closeRef.current?.focus(), 50);
    return () => {
      window.clearTimeout(t);
      lastFocus.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && next) onNavigate(next);
      if (e.key === "ArrowLeft" && prev) onNavigate(prev);
      if (e.key === "Tab" && panelRef.current) {
        // keep focus inside the dialog
        const items = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        const first = items[0];
        const last = items[items.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-title"
            initial={{ opacity: 0, y: 60, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent=""
            className="relative max-h-[92svh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-3xl border border-line-strong bg-bg shadow-card sm:rounded-3xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-line bg-bg/85 px-4 py-3 backdrop-blur-xl sm:px-5">
              <span className="mx-auto h-1 w-10 rounded-full bg-line-strong sm:hidden" aria-hidden />
              <div className="absolute left-4 flex items-center gap-1 sm:static">
                <button
                  type="button"
                  onClick={() => prev && onNavigate(prev)}
                  aria-label={`Previous project: ${prev?.title}`}
                  className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => next && onNavigate(next)}
                  aria-label={`Next project: ${next?.title}`}
                  className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
                >
                  <ChevronRight className="size-4" />
                </button>
                <span className="ml-2 hidden font-mono text-xs text-subtle sm:inline">
                  {index + 1} / {projects.length}
                </span>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close project details"
                className="absolute right-4 grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg sm:static"
              >
                <X className="size-4" />
              </button>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="p-4 pb-8 sm:p-6"
              >
                <ProjectArt art={project.art} className="group aspect-[16/9] w-full" />
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                  {project.subtitle}
                </p>
                <h2 id="project-title" className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  {project.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted sm:text-[17px]">{project.summary}</p>

                <h3 className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-subtle">Highlights</h3>
                <ul className="mt-4 space-y-3">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                      <span className="mt-[0.6em] size-1.5 shrink-0 rotate-45 bg-accent" aria-hidden />
                      {h}
                    </li>
                  ))}
                </ul>

                <h3 className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-subtle">Stack</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <li key={s} className="chip">
                      {s}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={project.repo} target="_blank" rel="noreferrer" className="btn btn-primary">
                    <GitHubIcon className="size-4" />
                    View source on GitHub
                  </a>
                  <button type="button" onClick={onClose} className="btn btn-ghost">
                    Close
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
