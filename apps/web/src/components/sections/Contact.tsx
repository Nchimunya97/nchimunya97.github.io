import { useState, type ComponentType, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Copy, LoaderCircle, Mail, MapPin, Phone, Send } from "lucide-react";
import { profile } from "@portfolio/content";
import { GitHubIcon, Reveal, SectionHeading } from "../ui.tsx";
import { copyText, cn, formatPhone } from "../../lib/utils.ts";
import { saveMessage } from "../../lib/firebase.ts";
import { toast } from "../../lib/toast.ts";

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "sent";

function validate(values: Record<Field, string>): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Please tell me your name.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email.trim()))
    errors.email = "That email doesn't look right.";
  if (values.message.trim().length < 10) errors.message = "A little more detail, please (10+ characters).";
  return errors;
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  copy,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  copy?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <li className="group flex items-center gap-4 border-b border-line py-4 last:border-0">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-accent">
        <Icon className="size-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">{label}</p>
        {href ? (
          <a
            href={href}
            {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
            className="block truncate text-[15px] font-medium transition-colors hover:text-accent sm:text-base"
          >
            {value}
          </a>
        ) : (
          <p className="truncate text-[15px] font-medium sm:text-base">{value}</p>
        )}
      </div>
      {copy && (
        <button
          type="button"
          onClick={async () => {
            await copyText(copy, `${label} copied`);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
          }}
          aria-label={`Copy ${label.toLowerCase()}`}
          className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      )}
    </li>
  );
}

export function Contact() {
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [trap, setTrap] = useState(""); // honeypot for bots

  const update = (field: Field, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched) setErrors(validate(next));
  };

  const mailtoFallback = () => {
    const subject = encodeURIComponent(`Hello from ${values.name.trim()}`);
    const body = encodeURIComponent(`${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length || status === "sending") return;
    if (trap) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      await Promise.race([
        saveMessage({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
        }),
        new Promise((_, reject) => window.setTimeout(() => reject(new Error("timeout")), 12_000)),
      ]);
      setStatus("sent");
      setValues({ name: "", email: "", message: "" });
      setTouched(false);
    } catch {
      setStatus("idle");
      toast("Couldn't send from the site — opening your email app instead");
      window.setTimeout(mailtoFallback, 600);
    }
  };

  const inputBase =
    "mt-2 w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-fg outline-none transition-colors placeholder:text-subtle focus:border-accent";

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-line" />
      <div className="container-page">
        <SectionHeading
          index="05"
          eyebrow="Contact"
          title={
            <>
              Let&apos;s build something <span className="accent-word">reliable</span> together.
            </>
          }
          description="Have a role, a project or an idea? Send a message here or reach me directly — my inbox is open."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="h-full rounded-3xl border border-line bg-surface/70 p-5 sm:p-7">
              <ul>
                <ContactRow
                  icon={Mail}
                  label="Email"
                  value={profile.email}
                  href={`mailto:${profile.email}`}
                  copy={profile.email}
                />
                <ContactRow
                  icon={Phone}
                  label="Phone"
                  value={formatPhone(profile.phone)}
                  href={`tel:${profile.phone}`}
                  copy={profile.phone}
                />
                <ContactRow
                  icon={GitHubIcon}
                  label="GitHub"
                  value={`@${profile.githubUser}`}
                  href={profile.github}
                />
                <ContactRow icon={MapPin} label="Based in" value={profile.location} />
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-7">
            <div className="relative h-full overflow-hidden rounded-3xl border border-line bg-surface/70 p-5 sm:p-7">
              <AnimatePresence mode="wait" initial={false}>
                {status === "sent" ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full min-h-[22rem] flex-col items-center justify-center text-center"
                  >
                    <span className="grid size-16 place-items-center rounded-full bg-accent text-accent-fg">
                      <Check className="size-7" />
                    </span>
                    <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight">Message received.</h3>
                    <p className="mt-2 max-w-sm text-muted">
                      Thanks for reaching out — I&apos;ll get back to you soon.
                    </p>
                    <button type="button" onClick={() => setStatus("idle")} className="btn btn-ghost mt-8">
                      Send another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    noValidate
                    onSubmit={onSubmit}
                    className="grid gap-5"
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      {(["name", "email"] as const).map((f) => (
                        <label key={f} className="block">
                          <span className="text-sm font-medium">{f === "name" ? "Your name" : "Email address"}</span>
                          <input
                            type={f === "email" ? "email" : "text"}
                            name={f}
                            autoComplete={f}
                            value={values[f]}
                            onChange={(e) => update(f, e.target.value)}
                            placeholder={f === "name" ? "Jane Banda" : "jane@company.com"}
                            aria-invalid={!!errors[f]}
                            aria-describedby={errors[f] ? `${f}-error` : undefined}
                            maxLength={f === "name" ? 100 : 200}
                            className={cn(inputBase, errors[f] ? "border-accent" : "border-line")}
                          />
                          {errors[f] && (
                            <span id={`${f}-error`} className="mt-1.5 block text-xs text-accent">
                              {errors[f]}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                    <label className="block">
                      <span className="flex justify-between text-sm font-medium">
                        Message
                        <span className="font-mono text-xs font-normal text-subtle">
                          {values.message.length}/2000
                        </span>
                      </span>
                      <textarea
                        name="message"
                        rows={6}
                        value={values.message}
                        onChange={(e) => update("message", e.target.value)}
                        placeholder="Tell me about the role, project or idea…"
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? "message-error" : undefined}
                        maxLength={2000}
                        className={cn(inputBase, "resize-y", errors.message ? "border-accent" : "border-line")}
                      />
                      {errors.message && (
                        <span id="message-error" className="mt-1.5 block text-xs text-accent">
                          {errors.message}
                        </span>
                      )}
                    </label>

                    {/* honeypot: hidden from people, tempting to bots */}
                    <input
                      type="text"
                      name="company"
                      tabIndex={-1}
                      autoComplete="off"
                      value={trap}
                      onChange={(e) => setTrap(e.target.value)}
                      className="absolute -left-[9999px] h-0 w-0 opacity-0"
                      aria-hidden
                    />

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <a
                        href={`mailto:${profile.email}`}
                        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
                      >
                        Prefer email? Write directly <ArrowUpRight className="size-3.5" />
                      </a>
                      <button type="submit" disabled={status === "sending"} className="btn btn-primary disabled:opacity-70">
                        {status === "sending" ? (
                          <>
                            <LoaderCircle className="size-4 animate-spin" /> Sending…
                          </>
                        ) : (
                          <>
                            Send message <Send className="size-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
