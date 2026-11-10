import { proof } from "@portfolio/content";
import { Reveal } from "../ui.tsx";

/** Credibility numbers — real, owner-confirmed figures only. */
export function ProofStrip() {
  return (
    <section aria-label="In numbers" className="relative border-y border-line">
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-8 py-10 sm:py-12 lg:grid-cols-4">
        {proof.map((p, i) => (
          <Reveal key={p.label} delay={i * 0.06}>
            <p className="font-display text-[clamp(2.2rem,4.5vw,3rem)] font-bold leading-none tracking-[-0.04em]">
              {p.value}
            </p>
            <p className="mt-2 max-w-[16rem] text-sm leading-snug text-muted">{p.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
