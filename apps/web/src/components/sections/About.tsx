import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { Clock, MapPin, ShieldCheck, Target, Zap } from "lucide-react";
import {
  principles,
  profile,
  stats,
  technicalSkillCount,
  type Principle,
  type Stat,
} from "@portfolio/content";
import { Reveal, SectionHeading } from "../ui.tsx";
import { Monogram } from "../Navbar.tsx";
import { useClock, useSpotlight } from "../../lib/hooks.ts";

const PRINCIPLE_ICONS: Record<Principle["icon"], typeof Target> = {
  target: Target,
  shield: ShieldCheck,
  zap: Zap,
};

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

function PrincipleCard({ p, i }: { p: Principle; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useSpotlight(ref);
  const Icon = PRINCIPLE_ICONS[p.icon];
  return (
    <Reveal delay={i * 0.08} className="h-full">
      <div
        ref={ref}
        className="spotlight h-full rounded-2xl border border-line bg-surface/60 p-6 transition-colors hover:border-line-strong"
      >
        <span className="grid size-11 place-items-center rounded-xl border border-line bg-surface-2 text-accent">
          <Icon className="size-5" />
        </span>
        <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">{p.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.description}</p>
      </div>
    </Reveal>
  );
}

export function About() {
  const time = useClock(profile.timezone);
  const allStats: Stat[] = [...stats, { value: technicalSkillCount, label: "Skills in my toolkit" }];

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              index="01"
              eyebrow="About"
              title={
                <>
                  From counting households to{" "}
                  <span className="accent-word">shipping production code.</span>
                </>
              }
            />
            <div className="mt-8 space-y-5 text-base leading-[1.8] text-muted sm:text-[17px]">
              {profile.story.map((para, i) => (
                <Reveal key={i} delay={0.05 * i}>
                  <p>{para}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.1} className="lg:sticky lg:top-28">
              <div className="relative overflow-hidden rounded-3xl border border-line bg-surface/70 p-6 shadow-card sm:p-7">
                <div
                  aria-hidden
                  className="absolute -right-20 -top-20 size-64 rounded-full bg-[radial-gradient(closest-side,var(--glow-a),transparent)]"
                />
                <div className="relative flex items-center gap-4">
                  <Monogram large />
                  <div className="min-w-0">
                    <p className="font-display text-xl font-semibold tracking-tight">{profile.name}</p>
                    <p className="text-sm text-muted">
                      {profile.role} · {profile.company}
                    </p>
                  </div>
                </div>

                <dl className="relative mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
                  {allStats.map((s) => (
                    <div key={s.label} className="bg-surface p-4 sm:p-5">
                      <dt className="sr-only">{s.label}</dt>
                      <dd>
                        <span className="block font-display text-4xl font-bold tracking-tight sm:text-5xl">
                          <CountUp value={s.value} suffix={s.suffix} />
                        </span>
                        <span className="mt-1 block text-xs leading-snug text-muted sm:text-sm">
                          {s.label}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
                  <span className="flex items-center gap-2">
                    <MapPin className="size-4 text-accent" />
                    {profile.location}
                  </span>
                  <span className="flex items-center gap-2 font-mono text-xs">
                    <Clock className="size-4 text-accent-2" />
                    {time} {profile.timezoneLabel}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:mt-20 md:grid-cols-3">
          {principles.map((p, i) => (
            <PrincipleCard key={p.title} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
