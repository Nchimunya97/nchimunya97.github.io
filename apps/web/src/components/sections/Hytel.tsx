import { hytelCapabilities } from "@portfolio/content";
import { Reveal, SectionHeading } from "../ui.tsx";

/** Hytel work is private: capability write-ups only — no client names, code or metrics. */
export function Hytel() {
  return (
    <section id="hytel" data-invert="" className="relative py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          index="02"
          eyebrow="At Hytel"
          title={
            <>
              The kind of work I do <span className="accent-word">in production.</span>
            </>
          }
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {hytelCapabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.07} className="h-full">
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-line-strong">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">{c.tag}</p>
                <h3 className="font-display text-xl font-semibold tracking-tight">{c.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted text-pretty">{c.body}</p>
                <p className="mt-auto pt-2 font-mono text-xs text-accent">{c.stack}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
