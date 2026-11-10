import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, LoaderCircle, Mail } from "lucide-react";
import { profile } from "@portfolio/content";
import {
  fetchApprovedTestimonials,
  firebaseEnabled,
  submitTestimonial,
  track,
  type Testimonial,
} from "../../lib/firebase.ts";
import { Reveal } from "../ui.tsx";
import { cn } from "../../lib/utils.ts";

/** Approved quotes. Renders nothing at all until at least one is approved. */
export function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    // after the page has settled — this never blocks the first paint
    const id = window.setTimeout(() => {
      void fetchApprovedTestimonials().then(setItems);
    }, 1500);
    return () => window.clearTimeout(id);
  }, []);

  if (items.length === 0) return null;

  return (
    <section id="testimonials" data-invert="" aria-label="Testimonials" className="relative py-20 sm:py-28">
      <div className="container-page">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">Kind words</p>
        <div className="mt-8 grid gap-12 md:grid-cols-2">
          {items.slice(0, 4).map((q, i) => (
            <Reveal key={q.id} delay={i * 0.06}>
              <figure>
                <blockquote className="font-display text-[clamp(1.3rem,2.5vw,1.75rem)] font-medium leading-snug tracking-[-0.02em] text-pretty">
                  “{q.text}”
                </blockquote>
                <figcaption className="mt-5 text-sm text-muted">
                  <span className="font-semibold text-fg">{q.name}</span>
                  {q.role && ` · ${q.role}`}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

type Field = "name" | "role" | "email" | "text";
type Errors = Partial<Record<Field | "consent", string>>;

function validate(v: Record<Field, string>, consent: boolean): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please add your name.";
  if (v.role.trim().length > 120) e.role = "Keep this under 120 characters.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email.trim())) e.email = "That email doesn't look right.";
  const len = v.text.trim().length;
  if (len < 20) e.text = "A sentence or two, please (20+ characters).";
  else if (len > 600) e.text = "Please keep it under 600 characters.";
  if (!consent) e.consent = "Please confirm it can be shown publicly.";
  return e;
}

/** Always-visible invite; submissions wait for the owner's approval. */
export function TestimonialInvite() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<Field, string>>({ name: "", role: "", email: "", text: "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [trap, setTrap] = useState("");

  if (!firebaseEnabled) return null;

  const set = (f: Field, val: string) => {
    const next = { ...values, [f]: val };
    setValues(next);
    if (touched) setErrors(validate(next, consent));
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    setTouched(true);
    const errs = validate(values, consent);
    setErrors(errs);
    if (Object.keys(errs).length || status === "sending") return;
    if (trap) {
      setStatus("sent");
      return;
    }
    setStatus("sending");
    try {
      await Promise.race([
        submitTestimonial({
          name: values.name.trim(),
          role: values.role.trim(),
          email: values.email.trim(),
          text: values.text.trim(),
        }),
        new Promise((_, reject) => window.setTimeout(() => reject(new Error("timeout")), 12_000)),
      ]);
      setStatus("sent");
      setOpen(false);
      track("testimonial_submit", { result: "saved" });
    } catch {
      setStatus("error");
      track("testimonial_submit", { result: "error" });
    }
  };

  const input =
    "w-full rounded-xl border bg-bg px-4 py-3 text-[15px] text-fg outline-none transition-colors placeholder:text-subtle focus:border-accent";
  const err = (f: keyof Errors) =>
    errors[f] && (
      <span id={`t-${f}-error`} className="mt-1.5 block text-xs text-accent">
        {errors[f]}
      </span>
    );

  return (
    <section aria-label="Leave a testimonial" className="relative">
      <div className="container-page pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-line-strong px-5 py-5 sm:px-6">
          <p className="text-base text-muted">
            Worked with me? <span className="text-fg">I&apos;d be grateful for a few words.</span>
          </p>
          {status === "sent" ? (
            <span className="flex items-center gap-2 font-mono text-xs text-accent">
              <Check className="size-4" /> Thanks — it&apos;ll appear once I&apos;ve reviewed it.
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="testimonial-form"
              className="btn btn-ghost h-10 px-4 text-sm"
            >
              {open ? "Cancel" : "Leave a testimonial"}
            </button>
          )}
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.form
              id="testimonial-form"
              noValidate
              onSubmit={onSubmit}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-3 grid gap-4 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-3 sm:p-6">
                {(
                  [
                    ["name", "Your name", "name", "text"],
                    ["role", "Role · Organisation", "organization-title", "text"],
                    ["email", "Email (never shown)", "email", "email"],
                  ] as const
                ).map(([f, placeholder, autoComplete, type]) => (
                  <label key={f} className="block">
                    <span className="sr-only">{placeholder}</span>
                    <input
                      type={type}
                      name={f}
                      autoComplete={autoComplete}
                      placeholder={placeholder}
                      value={values[f]}
                      onChange={(e) => set(f, e.target.value)}
                      aria-invalid={!!errors[f]}
                      aria-describedby={errors[f] ? `t-${f}-error` : undefined}
                      maxLength={f === "email" ? 200 : f === "role" ? 120 : 100}
                      className={cn(input, errors[f] ? "border-accent" : "border-line-strong")}
                    />
                    {err(f)}
                  </label>
                ))}
                <label className="block sm:col-span-3">
                  <span className="sr-only">Your testimonial</span>
                  <textarea
                    name="text"
                    rows={4}
                    placeholder={`What was it like working with ${profile.firstName}?`}
                    value={values.text}
                    onChange={(e) => set("text", e.target.value)}
                    aria-invalid={!!errors.text}
                    aria-describedby={errors.text ? "t-text-error" : undefined}
                    maxLength={600}
                    className={cn(input, "resize-y", errors.text ? "border-accent" : "border-line-strong")}
                  />
                  <span className="mt-1 flex justify-between">
                    {err("text") || <span />}
                    <span className="font-mono text-xs text-subtle">{values.text.length}/600</span>
                  </span>
                </label>
                <label className="flex items-start gap-3 text-sm text-muted sm:col-span-3">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      if (touched) setErrors(validate(values, e.target.checked));
                    }}
                    className="mt-0.5 size-4 accent-[var(--accent)]"
                  />
                  <span>
                    I&apos;m happy for this to be shown publicly on this site.
                    {err("consent")}
                  </span>
                </label>
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={trap}
                  onChange={(e) => setTrap(e.target.value)}
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  aria-hidden
                />
                <div className="flex flex-wrap items-center gap-4 sm:col-span-3">
                  <button type="submit" disabled={status === "sending"} className="btn btn-primary disabled:opacity-70">
                    {status === "sending" ? (
                      <>
                        <LoaderCircle className="size-4 animate-spin" /> Submitting…
                      </>
                    ) : (
                      "Submit for review"
                    )}
                  </button>
                  {status === "error" && (
                    <a
                      href={`mailto:${profile.email}?subject=${encodeURIComponent("Testimonial")}`}
                      className="inline-flex items-center gap-1.5 text-sm text-accent"
                    >
                      <Mail className="size-4" /> Couldn&apos;t submit right now — email it to me instead
                    </a>
                  )}
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
