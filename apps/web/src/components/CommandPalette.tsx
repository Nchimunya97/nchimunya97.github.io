import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Copy,
  CornerDownLeft,
  Download,
  FolderGit2,
  Hash,
  Mail,
  Moon,
  Search,
} from "lucide-react";
import { profile, projects, type Project } from "@portfolio/content";
import { NAV_ITEMS } from "../lib/nav.ts";
import { toggleTheme } from "../lib/theme.ts";
import { copyText, cvUrl, scrollToId } from "../lib/utils.ts";
import { useScrollLock } from "../lib/hooks.ts";
import { track } from "../lib/firebase.ts";
import { GitHubIcon } from "./ui.tsx";

interface Command {
  id: string;
  group: "Navigate" | "Projects" | "Actions";
  label: string;
  hint?: string;
  keywords?: string;
  icon: ComponentType<{ className?: string }>;
  run: () => void;
}

export function CommandPalette({
  open,
  onClose,
  onOpenProject,
}: {
  open: boolean;
  onClose: () => void;
  onOpenProject: (p: Project) => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  useScrollLock(open);

  const commands = useMemo<Command[]>(
    () => [
      { id: "home", group: "Navigate", label: "Home", icon: Hash, run: () => scrollToId("home") },
      ...NAV_ITEMS.map((n) => ({
        id: n.id,
        group: "Navigate" as const,
        label: n.label,
        icon: Hash,
        run: () => scrollToId(n.id),
      })),
      ...projects.map((p) => ({
        id: `p-${p.id}`,
        group: "Projects" as const,
        label: p.title,
        hint: p.subtitle,
        keywords: p.stack.join(" "),
        icon: FolderGit2,
        run: () => onOpenProject(p),
      })),
      {
        id: "copy-email",
        group: "Actions",
        label: "Copy email address",
        hint: profile.email,
        icon: Copy,
        run: () => void copyText(profile.email, "Email copied"),
      },
      {
        id: "email",
        group: "Actions",
        label: "Send an email",
        icon: Mail,
        run: () => (window.location.href = `mailto:${profile.email}`),
      },
      {
        id: "cv",
        group: "Actions",
        label: "Download CV",
        hint: "PDF",
        keywords: "resume",
        icon: Download,
        run: () => {
          const a = document.createElement("a");
          a.href = cvUrl;
          a.download = profile.cvFile;
          track("cv_download", { source: "palette" });
          a.click();
        },
      },
      {
        id: "github",
        group: "Actions",
        label: "Open GitHub",
        hint: `@${profile.githubUser}`,
        icon: GitHubIcon,
        run: () => window.open(profile.github, "_blank", "noopener"),
      },
      {
        id: "theme",
        group: "Actions",
        label: "Toggle light / dark theme",
        keywords: "mode appearance",
        icon: Moon,
        run: toggleTheme,
      },
    ],
    [onOpenProject],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.hint ?? ""} ${c.keywords ?? ""} ${c.group}`.toLowerCase().includes(q),
    );
  }, [commands, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const execute = (cmd: Command | undefined) => {
    if (!cmd) return;
    onClose();
    window.setTimeout(cmd.run, 80);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      execute(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[85] flex items-start justify-center bg-black/55 px-3 pt-[12vh] backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Quick navigation"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-line-strong bg-bg shadow-card"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="size-5 shrink-0 text-subtle" />
              <input
                ref={inputRef}
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search sections, projects, actions…"
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
                className="h-14 w-full bg-transparent text-base outline-none placeholder:text-subtle"
              />
              <span className="kbd hidden sm:inline-flex">esc</span>
            </div>

            <ul
              ref={listRef}
              id="palette-list"
              role="listbox"
              data-lenis-prevent=""
              className="max-h-[min(60vh,26rem)] overflow-y-auto overscroll-contain p-2"
            >
              {results.length === 0 && (
                <li className="px-3 py-10 text-center text-sm text-muted">
                  Nothing matches “{query}”.
                </li>
              )}
              {results.map((cmd, i) => {
                const showGroup = cmd.group !== lastGroup;
                lastGroup = cmd.group;
                const Icon = cmd.icon;
                const isActive = i === active;
                return (
                  <li key={cmd.id} role="presentation">
                    {showGroup && (
                      <p className="px-3 pb-1.5 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
                        {cmd.group}
                      </p>
                    )}
                    <div
                      id={`cmd-${cmd.id}`}
                      role="option"
                      aria-selected={isActive}
                      data-index={i}
                      onMouseMove={() => setActive(i)}
                      onClick={() => execute(cmd)}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                        isActive ? "bg-surface-2 text-fg" : "text-muted"
                      }`}
                    >
                      <span
                        className={`grid size-8 shrink-0 place-items-center rounded-lg border ${
                          isActive ? "border-accent/40 text-accent" : "border-line"
                        }`}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{cmd.label}</span>
                        {cmd.hint && <span className="block truncate text-xs text-subtle">{cmd.hint}</span>}
                      </span>
                      {isActive ? (
                        <CornerDownLeft className="size-4 text-accent" />
                      ) : (
                        <ArrowRight className="size-4 opacity-0" />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="hidden items-center gap-4 border-t border-line px-4 py-2.5 text-xs text-subtle sm:flex">
              <span className="flex items-center gap-1.5">
                <span className="kbd">↑</span>
                <span className="kbd">↓</span> navigate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="kbd">↵</span> select
              </span>
              <span className="ml-auto">Tip: press / anywhere</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
