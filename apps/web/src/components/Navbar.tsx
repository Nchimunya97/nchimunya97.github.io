import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Mail, Menu, Moon, Search, Sun, X } from "lucide-react";
import { profile } from "@portfolio/content";
import { INVERTED_SECTION_IDS, NAV_ITEMS, SECTION_IDS } from "../lib/nav.ts";
import { useActiveSection, useMounted, useScrollLock, useSectionUnderNav } from "../lib/hooks.ts";
import { toggleTheme, useTheme } from "../lib/theme.ts";
import { cn, isMac, scrollToId } from "../lib/utils.ts";
import { GitHubIcon, LinkedInIcon } from "./ui.tsx";

/** "NS." — the wordmark. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display font-bold tracking-[-0.03em]", className)}>
      {profile.initials}
      <span className="text-accent">.</span>
    </span>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme();
  const mounted = useMounted();
  const dark = !mounted || theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg",
        className,
      )}
    >
      {dark ? <Moon className="size-[17px]" /> : <Sun className="size-[17px]" />}
    </button>
  );
}

export function Navbar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const active = useActiveSection(SECTION_IDS);
  const overInverted = useSectionUnderNav(INVERTED_SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mac, setMac] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));
  useScrollLock(open);
  useEffect(() => setMac(isMac()), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const close = () => mql.matches && setOpen(false);
    mql.addEventListener("change", close);
    return () => mql.removeEventListener("change", close);
  }, []);

  const go = (id: string) => {
    const wasOpen = open;
    setOpen(false);
    // let the menu close before scrolling so the scroll lock is released
    window.setTimeout(() => scrollToId(id), wasOpen ? 60 : 0);
  };

  return (
    <>
      <header
        data-invert={overInverted && !open ? "" : undefined}
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b text-fg backdrop-blur-xl transition-[background-color,border-color,color] duration-500",
          scrolled || open ? "border-line bg-bg/85" : "border-transparent bg-bg/0",
        )}
      >
        <nav
          aria-label="Primary"
          className="container-page flex h-16 items-center justify-between gap-4"
        >
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              go("home");
            }}
            className="rounded-md text-lg"
          >
            <span className="sr-only">Back to top: {profile.name}</span>
            <span aria-hidden>
              <Wordmark className="text-[19px]" />
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
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
                      "relative block px-3 py-2 text-sm transition-colors",
                      isActive ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-3 -bottom-px h-px bg-accent"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenPalette}
              aria-label={`${mac ? "⌘K" : "Ctrl K"} — open quick navigation`}
              className="hidden rounded-md border border-line-strong px-2 py-1 font-mono text-[11px] text-subtle transition-colors hover:border-accent hover:text-fg lg:block"
            >
              {mac ? "⌘K" : "Ctrl K"}
            </button>
            <button
              type="button"
              onClick={onOpenPalette}
              aria-label="Search the site"
              className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg lg:hidden"
            >
              <Search className="size-[17px]" />
            </button>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="grid size-9 place-items-center rounded-full text-fg transition-colors hover:bg-surface-2 lg:hidden"
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
            className="fixed inset-0 z-40 flex flex-col bg-bg px-5 pb-8 pt-24 lg:hidden"
          >
            <ul className="relative flex flex-1 flex-col justify-center">
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.04 + i * 0.04, ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.id);
                    }}
                    className="group flex items-baseline gap-4 border-b border-line py-3.5"
                  >
                    <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                    <span
                      className={cn(
                        "font-display text-[2rem] font-bold tracking-[-0.03em] transition-colors",
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
              animate={{ opacity: 1, transition: { delay: 0.3 } }}
              exit={{ opacity: 0 }}
              className="relative grid grid-cols-3 gap-2"
            >
              <a href={`mailto:${profile.email}`} className="btn btn-ghost h-11 px-3 text-sm">
                <Mail className="size-4" /> Email
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn btn-ghost h-11 px-3 text-sm">
                <LinkedInIcon className="size-4" /> LinkedIn
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-ghost h-11 px-3 text-sm">
                <GitHubIcon className="size-4" /> GitHub
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
