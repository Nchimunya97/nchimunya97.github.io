import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { CircleCheck, Zap } from "lucide-react";
import { useMediaQuery } from "../lib/hooks.ts";

type TokenKind = "kw" | "var" | "op" | "key" | "str" | "bool" | "cm";
type Token = [TokenKind, string];

const LINES: Token[][] = [
  [["cm", "// profile.ts"]],
  [["kw", "const "], ["var", "engineer"], ["op", " = {"]],
  [["key", "  name"], ["op", ": "], ["str", '"Nchimunya"'], ["op", ","]],
  [["key", "  role"], ["op", ": "], ["str", '"Software Engineer"'], ["op", ","]],
  [["key", "  team"], ["op", ": "], ["str", '"Hytel"'], ["op", ","]],
  [["key", "  based"], ["op", ": "], ["str", '"Lusaka, ZM"'], ["op", ","]],
  [["key", "  mobile"], ["op", ": ["], ["str", '"Flutter"'], ["op", ", "], ["str", '"Dart"'], ["op", "],"]],
  [["key", "  web"], ["op", ": ["], ["str", '"React"'], ["op", ", "], ["str", '"tRPC"'], ["op", "],"]],
  [["key", "  cloud"], ["op", ": ["], ["str", '"Firebase"'], ["op", ", "], ["str", '"GCP"'], ["op", "],"]],
  [["key", "  cares"], ["op", ": "], ["str", '"clean data"'], ["op", ","]],
  [["key", "  shipping"], ["op", ": "], ["bool", "true"], ["op", ","]],
  [["op", "};"]],
];

const COLORS: Record<TokenKind, string> = {
  kw: "text-[var(--code-kw)]",
  var: "text-fg",
  op: "text-muted",
  key: "text-[var(--code-key)]",
  str: "text-[var(--code-str)]",
  bool: "text-[var(--code-bool)]",
  cm: "text-subtle italic",
};

const TOTAL = LINES.reduce(
  (sum, line) => sum + line.reduce((s, [, t]) => s + t.length, 0) + 1,
  0,
);

/** An editor window that types out a profile object, with a 3D tilt on hover. */
export function CodeCard() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-40px" });
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setCount(TOTAL);
      return;
    }
    let n = 0;
    let timer = 0;
    const tick = () => {
      n += 1 + Math.floor(Math.random() * 2);
      setCount(Math.min(n, TOTAL));
      if (n < TOTAL) timer = window.setTimeout(tick, 18 + Math.random() * 30);
    };
    timer = window.setTimeout(tick, 650);
    return () => window.clearTimeout(timer);
  }, [inView, reduced]);

  // Build what's visible so far
  const rendered = useMemo(() => {
    let remaining = count;
    let cursorLine = 0;
    const out = LINES.map((line, li) => {
      if (remaining <= 0) return null;
      cursorLine = li;
      const parts = line.map(([kind, text], ti) => {
        if (remaining <= 0) return null;
        const shown = text.slice(0, remaining);
        remaining -= text.length;
        return (
          <span key={ti} className={COLORS[kind]}>
            {shown}
          </span>
        );
      });
      remaining -= 1; // newline
      return parts;
    });
    return { out, cursorLine };
  }, [count]);

  const done = count >= TOTAL;

  // Tilt
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 150, damping: 18 });

  return (
    <div ref={wrapRef} className="relative [perspective:1200px]">
      {/* glow behind the card */}
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(closest-side,var(--glow-a),transparent)] blur-2xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
      <motion.div
        style={finePointer && !reduced ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        onPointerMove={(e) => {
          if (!finePointer) return;
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        className="relative overflow-hidden rounded-2xl border border-line-strong bg-surface/80 shadow-card backdrop-blur-xl"
      >
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
          <div className="ml-3 flex items-center gap-2 rounded-md bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-muted">
            <span className="size-1.5 rounded-full bg-accent" />
            profile.ts
          </div>
        </div>

        {/* code */}
        <pre
          aria-label="Profile summary as a code snippet"
          className="scrollbar-none overflow-x-auto px-3 py-4 font-mono text-[11px] leading-[1.75] sm:px-4 sm:text-[13px]"
        >
          <code className="block min-h-[calc(12*1.75em)]">
            {LINES.map((_, li) => (
              <div key={li} className="flex">
                <span className="mr-3 w-5 shrink-0 select-none text-right text-subtle/70 sm:mr-4">
                  {li + 1}
                </span>
                <span className="whitespace-pre">
                  {rendered.out[li]}
                  {li === rendered.cursorLine && (
                    <span className="ml-px inline-block h-[1.15em] w-[0.55em] translate-y-[0.2em] animate-blink bg-accent" />
                  )}
                </span>
              </div>
            ))}
          </code>
        </pre>

        {/* status bar */}
        <div className="flex items-center justify-between border-t border-line bg-surface-2/60 px-4 py-2 font-mono text-[10px] text-subtle sm:text-[11px]">
          <span className="flex items-center gap-1.5">
            <span
              className={`size-1.5 rounded-full ${done ? "bg-accent-2" : "bg-accent animate-pulse"}`}
            />
            {done ? "Compiled · 0 errors" : "Typing…"}
          </span>
          <span>TypeScript · UTF-8</span>
        </div>
      </motion.div>
      </motion.div>

      {/* floating badges */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={done ? { opacity: 1, scale: 1 } : undefined}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="absolute -left-3 -top-5 hidden sm:block lg:-left-8"
      >
        <div className="flex animate-float items-center gap-2 rounded-xl border border-line-strong bg-surface/90 px-3 py-2 text-xs font-semibold shadow-card backdrop-blur">
          <span className="grid size-6 place-items-center rounded-lg bg-accent-2/15 text-accent-2">
            <CircleCheck className="size-3.5" />
          </span>
          Data validated
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={done ? { opacity: 1, scale: 1 } : undefined}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
        className="absolute -bottom-5 -right-3 hidden sm:block lg:-right-6"
      >
        <div className="flex animate-float items-center gap-2 rounded-xl border border-line-strong bg-surface/90 px-3 py-2 text-xs font-semibold shadow-card backdrop-blur [animation-delay:-3s]">
          <span className="grid size-6 place-items-center rounded-lg bg-accent/15 text-accent">
            <Zap className="size-3.5" />
          </span>
          Real-time sync
        </div>
      </motion.div>
    </div>
  );
}
