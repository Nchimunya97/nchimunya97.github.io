import { Activity, Blocks, CircleCheck, Dumbbell, FileText, ShieldCheck, WifiOff } from "lucide-react";
import type { Project } from "@portfolio/content";
import { cn } from "../lib/utils.ts";

const BARS = [42, 58, 50, 74, 63, 88, 70, 95, 80];

function Dashboard() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,var(--glow-a),transparent_55%),radial-gradient(circle_at_90%_90%,var(--glow-b),transparent_50%)]" />
      <div className="absolute inset-x-[7%] bottom-0 top-[11%] flex overflow-hidden rounded-t-xl border border-b-0 border-line-strong bg-surface shadow-card transition-transform duration-700 ease-out group-hover:-translate-y-1.5">
        <div className="hidden w-[17%] shrink-0 flex-col gap-2 border-r border-line p-3 sm:flex">
          <span className="grid size-6 place-items-center rounded-md bg-accent/15 text-accent">
            <Dumbbell className="size-3.5" />
          </span>
          {[70, 55, 80, 45].map((w, i) => (
            <span
              key={i}
              className={cn("h-1.5 rounded-full", i === 0 ? "bg-accent/60" : "bg-line-strong")}
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="h-2 w-1/3 rounded-full bg-line-strong" />
            <span className="flex items-center gap-1 rounded-full bg-accent-2/15 px-2 py-0.5 font-mono text-[9px] text-accent-2">
              <Activity className="size-2.5" /> live
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              ["bg-accent", 62],
              ["bg-fg/30", 78],
              ["bg-fg/15", 45],
            ].map(([c, w], i) => (
              <div key={i} className="rounded-lg border border-line bg-surface-2/70 p-2">
                <span className="block h-1.5 w-1/2 rounded-full bg-line-strong" />
                <span
                  className={cn("mt-2 block h-2.5 rounded-full", c as string)}
                  style={{ width: `${w}%` }}
                />
              </div>
            ))}
          </div>
          <div className="relative mt-3 flex flex-1 items-end justify-between gap-[3%] rounded-lg border border-line bg-surface-2/40 px-[6%] pb-2 pt-4">
            {/* faint grid lines */}
            <span aria-hidden className="absolute inset-x-3 top-1/3 border-t border-dashed border-line" />
            <span aria-hidden className="absolute inset-x-3 top-2/3 border-t border-dashed border-line" />
            {BARS.map((h, i) => {
              const peak = h === Math.max(...BARS);
              return (
                <span
                  key={i}
                  className={cn(
                    "relative w-full max-w-[14px] origin-bottom scale-y-[0.85] rounded-full transition-transform duration-700 ease-out group-hover:scale-y-100",
                    peak ? "bg-accent" : "bg-fg/15",
                  )}
                  style={{ height: `${h}%`, transitionDelay: `${i * 45}ms` }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

const ROWS = [
  { paid: true, w: 62 },
  { paid: true, w: 48 },
  { paid: false, w: 70 },
  { paid: true, w: 54 },
];

function Phone() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,var(--glow-b),transparent_55%),radial-gradient(circle_at_15%_85%,var(--glow-a),transparent_50%)]" />
      {/* receipt behind */}
      <div className="absolute left-[14%] top-[22%] hidden w-[26%] -rotate-6 rounded-xl border border-line-strong bg-surface p-3 shadow-card transition-transform duration-700 group-hover:-rotate-[10deg] group-hover:-translate-x-2 min-[420px]:block">
        <span className="block h-1.5 w-2/3 rounded-full bg-line-strong" />
        <span className="mt-2 block h-1.5 w-1/2 rounded-full bg-line" />
        <span className="mt-4 block font-display text-lg font-bold leading-none text-accent">K 15</span>
        <span className="mt-2 flex items-center gap-1 font-mono text-[9px] text-accent-2">
          <CircleCheck className="size-3" /> receipt
        </span>
      </div>
      {/* phone */}
      <div className="absolute left-1/2 top-[9%] h-[100%] -translate-x-1/2 transition-transform duration-700 ease-out group-hover:-translate-y-2">
        <div className="aspect-[9/17] h-full rounded-[1.6rem] border-[3px] border-line-strong bg-surface p-2 shadow-card">
          <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-line-strong" />
          <div className="rounded-xl bg-accent p-2.5 text-accent-fg">
            <span className="block font-mono text-[8px] uppercase tracking-wider opacity-80">Today</span>
            <span className="block font-display text-sm font-bold leading-tight">Levy total</span>
            <span className="mt-1.5 block h-1.5 w-3/4 rounded-full bg-white/40" />
          </div>
          <div className="mt-2 space-y-1.5">
            {ROWS.map((r, i) => (
              <div key={i} className="flex items-center gap-1.5 rounded-lg border border-line bg-surface-2/60 p-1.5">
                <span className="size-3.5 shrink-0 rounded-full bg-line-strong" />
                <span className="h-1.5 rounded-full bg-line-strong" style={{ width: `${r.w - 20}%` }} />
                <span
                  className={cn(
                    "ml-auto rounded-full px-1.5 font-mono text-[7px] leading-[1.6]",
                    r.paid ? "bg-accent-2/15 text-accent-2" : "bg-accent/15 text-accent",
                  )}
                >
                  {r.paid ? "paid" : "due"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* offline chip */}
      <div className="absolute right-[8%] top-[30%] hidden items-center gap-1.5 sm:flex rounded-full border border-line-strong bg-surface px-2.5 py-1 font-mono text-[10px] text-muted shadow-card transition-transform duration-700 group-hover:translate-x-1.5">
        <WifiOff className="size-3 text-accent" /> offline-ready
      </div>
    </>
  );
}

const BLOCKS = ["0x7a3f", "0xc91e", "0x4b0d"];

function Chain() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--glow-a),transparent_60%),radial-gradient(circle_at_50%_100%,var(--glow-b),transparent_55%)]" />
      <div className="bg-dots absolute inset-0 opacity-50" />
      <div className="absolute inset-x-[6%] top-1/2 flex -translate-y-[58%] items-center justify-between">
        {BLOCKS.map((hash, i) => (
          <div key={hash} className="contents">
            {i > 0 && (
              <span className="h-px flex-1 border-t-2 border-dashed border-line-strong" aria-hidden />
            )}
            <div
              className={cn(
                "relative w-[24%] rounded-xl border bg-surface p-2.5 shadow-card transition-transform duration-500 ease-out group-hover:-translate-y-2 sm:p-3",
                i === 1 ? "border-accent/50" : "border-line-strong",
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span
                className={cn(
                  "grid size-6 place-items-center rounded-md",
                  i === 1 ? "bg-accent/15 text-accent" : "bg-surface-2 text-muted",
                )}
              >
                {i === 1 ? <ShieldCheck className="size-3.5" /> : <Blocks className="size-3.5" />}
              </span>
              <span className="mt-2 block truncate font-mono text-[9px] text-subtle sm:text-[10px]">{hash}…</span>
              <span className="mt-1.5 block h-1.5 w-4/5 rounded-full bg-line-strong" />
              <span className="mt-1 block h-1.5 w-1/2 rounded-full bg-line" />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-[12%] flex justify-center gap-2 font-mono text-[9px] sm:text-[10px]">
        <span className="rounded-full border border-line-strong bg-surface px-2 py-0.5 text-muted">pending</span>
        <span className="flex items-center gap-1 rounded-full border border-accent-2/40 bg-accent-2/10 px-2 py-0.5 text-accent-2">
          <CircleCheck className="size-3" /> verified
        </span>
        <span className="rounded-full border border-line-strong bg-surface px-2 py-0.5 text-muted">rejected</span>
      </div>
      <div className="absolute left-[8%] top-[12%] flex items-center gap-1.5 rounded-lg border border-line-strong bg-surface px-2 py-1 font-mono text-[10px] text-muted shadow-card">
        <FileText className="size-3 text-accent" /> NRC · doc.pdf
      </div>
    </>
  );
}

export function ProjectArt({ art, className }: { art: Project["art"]; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden rounded-xl border border-line bg-surface-2/60", className)}
    >
      {art === "dashboard" && <Dashboard />}
      {art === "phone" && <Phone />}
      {art === "chain" && <Chain />}
    </div>
  );
}
