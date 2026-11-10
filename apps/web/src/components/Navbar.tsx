import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Mail, Menu, Moon, Search, Sun, X } from "lucide-react";
import { profile } from "@portfolio/content";
import { NAV_ITEMS, SECTION_IDS } from "../lib/nav.ts";
import { useActiveSection, useScrollLock } from "../lib/hooks.ts";
import { toggleTheme, useTheme } from "../lib/theme.ts";
import { cn, isMac, scrollToId } from "../lib/utils.ts";
import { GitHubIcon } from "./ui.tsx";

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "relative grid size-10 place-items-center overflow-hidden rounded-full border border-line bg-surface/60 text-muted transition-colors hover:border-line-strong hover:text-fg",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: -18, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 18, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.25 }}
        >
          {dark ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export function Monogram({ className, large }: { className?: string; large?: boolean }) {
  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center bg-accent p-px",
        large ? "size-16 rounded-2xl" : "size-10 rounded-xl",
        className,
      )}
    >
      <span
        className={cn(
          "grid size-full place-items-center bg-bg font-display font-extrabold tracking-tight",
          large ? "rounded-[15px] text-xl" : "rounded-[11px] text-sm",
        )}
      >
        <span className="text-accent">{profile.initials}</span>
      </span>
    </span>
  );
}

export function Navbar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const active = useActiveSection(SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const mac = typeof navigator !== "undefined" && isMac();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const close = () => mql.matches && setOpen(false);
    mql.addEventListener("change", close);
    return () => mql.removeEventListener("change", close);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    // let the menu close before scrolling so the scroll lock is released
    window.setTimeout(() => scrollToId(id), open ? 60 : 0);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 rounded-2xl border px-2.5 transition-all duration-500 sm:h-16 sm:px-3",
            scrolled || open
              ? "border-line bg-bg/70 shadow-card backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              go("home");
            }}
            className="group flex items-center gap-2.5 rounded-xl pr-2"
            aria-label={`${profile.name} — back to top`}
          >
            <Monogram className="transition-transform duration-300 group-hover:rotate-[-6deg]" />
            <span className="hidden font-display text-[15px] font-semibold leading-tight tracking-tight sm:block">
              {profile.firstName}
              <span className="block text-xs font-normal text-muted">{profile.role}</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.id);
                    }}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative isolate block rounded-full px-3.5 py-2 text-sm font-medium transition-colors lg:px-4",
                      isActive ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full border border-line bg-surface-2"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenPalette}
              className="hidden h-10 items-center gap-2 rounded-full border border-line bg-surface/60 pl-3 pr-1.5 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg lg:flex"
            >
              <Search className="size-4" />
              <span>Quick jump</span>
              <span className="kbd">{mac ? "⌘K" : "Ctrl K"}</span>
            </button>
            <button
              type="button"
              onClick={onOpenPalette}
              aria-label="Open quick navigation"
              className="grid size-10 place-items-center rounded-full border border-line bg-surface/60 text-muted transition-colors hover:border-line-strong hover:text-fg lg:hidden"
            >
              <Search className="size-[18px]" />
            </button>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="grid size-10 place-items-center rounded-full border border-line bg-surface/60 md:hidden"
            >
              {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col bg-bg/95 px-5 pb-8 pt-24 backdrop-blur-2xl md:hidden"
          >
            <div aria-hidden className="bg-dots mask-radial pointer-events-none absolute inset-0 opacity-50" />
            <ul className="relative flex flex-1 flex-col justify-center gap-1">
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ delay: 0.05 + i * 0.05, ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.id);
                    }}
                    className="group flex items-baseline gap-4 border-b border-line py-4"
                  >
                    <span className="font-mono text-xs text-accent">0{i + 1}</span>
                    <span
                      className={cn(
                        "font-display text-4xl font-semibold tracking-tight transition-colors",
                        active === item.id ? "text-fg" : "text-muted group-hover:text-fg",
                      )}
                    >
                      {item.label}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.35 } }}
              exit={{ opacity: 0 }}
              className="relative flex flex-wrap gap-3"
            >
              <a href={`mailto:${profile.email}`} className="btn btn-ghost h-11 flex-1">
                <Mail className="size-4" /> Email
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost h-11 flex-1"
              >
                <GitHubIcon className="size-4" /> GitHub
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
