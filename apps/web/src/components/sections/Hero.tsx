import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Download, Mail, MapPin, Phone } from "lucide-react";
import { profile } from "@portfolio/content";
import { CodeCard } from "../CodeCard.tsx";
import { GitHubIcon, Magnetic } from "../ui.tsx";
import { cvUrl, isMac, scrollToId } from "../../lib/utils.ts";
import { track } from "../../lib/firebase.ts";
import { useMediaQuery } from "../../lib/hooks.ts";

const ease = [0.22, 1, 0.36, 1] as const;

function SplitWord({ word, delay, className }: { word: string; delay: number; className?: string }) {
  return (
    <span className={`block overflow-hidden pb-[0.08em] ${className ?? ""}`} aria-hidden>
      {word.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "105%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, delay: delay + i * 0.035, ease }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

function RotatingRole() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(
      () => setI((n) => (n + 1) % profile.rotatingRoles.length),
      4200,
    );
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <span className="relative inline-grid align-bottom">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={i}
          initial={{ y: "38%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-38%", opacity: 0 }}
          transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
          className="accent-word col-start-1 row-start-1 whitespace-nowrap"
        >
          {profile.rotatingRoles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero({ onOpenPalette }: { onOpenPalette: () => void }) {
  const mac = typeof navigator !== "undefined" && isMac();

  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-28 sm:pt-32 lg:pb-24"
    >
      {/* editorial frame: two hairlines that sit outside the content (never through it)
          + map coordinates for Lusaka */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="mx-auto hidden h-full max-w-[76rem] border-x border-line [mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_82%,transparent)] lg:block" />
        <div className="container-page absolute inset-x-0 bottom-6 hidden justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-subtle sm:flex">
          <span>15.4167° S — 28.2833° E</span>
          <span>Portfolio / {new Date().getFullYear()}</span>
        </div>
      </div>

      <div className="container-page relative grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <div className="min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-line bg-surface/60 py-1.5 pl-2 pr-4 text-xs font-medium text-muted backdrop-blur sm:text-sm"
          >
            <span className="flex items-center gap-2 rounded-full bg-fg/8 px-2.5 py-0.5 text-fg">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              {profile.role} at {profile.company}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" /> {profile.location}
            </span>
          </motion.div>

          <h1 className="mt-6 font-display text-[clamp(3rem,15vw,7rem)] font-bold leading-[0.9] tracking-[-0.045em]">
            <span className="sr-only">{profile.name}</span>
            <SplitWord word={profile.firstName} delay={0.05} />
            <SplitWord
              word={profile.lastName}
              delay={0.18}
              className="accent-word -mt-[0.04em] text-[1.08em] leading-[0.95]"
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            className="mt-6 font-display text-[clamp(1.35rem,3.6vw,2rem)] font-medium leading-tight tracking-tight"
          >
            {profile.headline}{" "}
            <span className="block sm:inline">
              <RotatingRole />
            </span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38, ease }}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {profile.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.48, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("projects");
                }}
                className="btn btn-primary group"
              >
                View my work
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
            <a href={cvUrl} download className="btn btn-ghost" onClick={() => track("cv_download", { source: "hero" })}>
              <Download className="size-4" />
              Download CV
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4"
          >
            <ul className="flex items-center gap-2">
              {[
                { href: profile.github, label: "GitHub", icon: GitHubIcon, external: true },
                { href: `mailto:${profile.email}`, label: "Email", icon: Mail },
                { href: `tel:${profile.phone}`, label: "Phone", icon: Phone },
              ].map(({ href, label, icon: Icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    title={label}
                    {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="grid size-11 place-items-center rounded-full border border-line bg-surface/60 text-muted backdrop-blur transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                  >
                    <Icon className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={onOpenPalette}
              className="hidden items-center gap-2 text-sm text-subtle transition-colors hover:text-fg lg:flex"
            >
              Press <span className="kbd">{mac ? "⌘" : "Ctrl"}</span>
              <span className="kbd">K</span> to jump anywhere
            </button>
          </motion.div>
        </div>

        <div className="min-w-0 lg:pl-6">
          <CodeCard />
        </div>
      </div>

      <motion.a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("about");
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        aria-label="Scroll to About"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-subtle transition-colors hover:text-fg lg:[@media(min-height:760px)]:flex"
      >
        Scroll
        <span className="grid h-9 w-6 justify-center rounded-full border border-line-strong pt-1.5">
          <motion.span
            animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="block h-2 w-1 rounded-full bg-accent"
          />
        </span>
      </motion.a>
    </section>
  );
}
