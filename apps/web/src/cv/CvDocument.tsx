/**
 * The CV, built from the same content as the website (packages/content).
 * Rendered to static HTML at build time (no JavaScript) and printed to PDF by
 * scripts/cv-pdf.mjs, so the downloadable CV can never drift from the site.
 *
 * Single column on purpose: applicant-tracking systems parse it reliably.
 */
import { education, experience, profile, projects, skillGroups, softSkills } from "@portfolio/content";

const strip = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export function CvDocument() {
  return (
    <>
      <nav className="cv-toolbar" aria-label="CV actions">
        <a href="../">← Back to portfolio</a>
        <a href={`../${profile.cvFile}`} download className="primary">
          Download PDF
        </a>
      </nav>

      <main className="cv">
        <header className="cv-head">
          <div>
            <h1>
              {profile.firstName} <em>{profile.lastName}</em>
            </h1>
            <p className="cv-role">
              {profile.role} · {profile.location}
            </p>
          </div>
          <ul className="cv-contact">
            <li>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
            <li>
              <a href={profile.linkedin}>{strip(profile.linkedin)}</a>
            </li>
            <li>
              <a href={profile.github}>{strip(profile.github)}</a>
            </li>
            <li>
              <a href={profile.website}>{strip(profile.website)}</a>
            </li>
          </ul>
        </header>

        <section>
          <h2>Profile</h2>
          <p className="cv-summary">{profile.cvSummary}</p>
        </section>

        <section>
          <h2>Experience</h2>
          {experience.map((e) => (
            <article key={e.id} className="cv-item">
              <div className="cv-row">
                <h3>
                  {e.role} <span className="cv-at">· {e.org}</span>
                  {e.orgDetail && <span className="cv-muted"> · {e.orgDetail}</span>}
                </h3>
                <span className="cv-date">{e.period}</span>
              </div>
              <ul className="cv-bullets">
                {e.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section>
          <h2>Selected projects</h2>
          {projects.map((p) => {
            // absolute URLs so links still work inside the PDF; one link per target
            const seen = new Set<string>();
            const links = [p.primary, p.secondary]
              .filter((l): l is NonNullable<typeof l> => !!l)
              .map((l) => ({
                href: /^https?:/.test(l.href) ? l.href : `${profile.website}/${l.href.split("#")[0]}`,
                label: l.kind === "demo" ? "Live demo" : l.kind === "code" ? "Code" : l.label,
              }))
              .filter((l) => !seen.has(l.href) && !!seen.add(l.href));
            return (
              <article key={p.id} className="cv-item">
                <div className="cv-row">
                  <h3>
                    {p.title} <span className="cv-muted">· {p.context ?? p.category}</span>
                  </h3>
                  {links.length > 0 && (
                    <span className="cv-links">
                      {links.map((l, i) => (
                        <span key={l.href}>
                          {i > 0 && " · "}
                          <a href={l.href}>{l.label}</a>
                        </span>
                      ))}
                    </span>
                  )}
                </div>
                <p>{p.oneLiner}</p>
                <p className="cv-outcome">{p.outcome}</p>
                <p className="cv-stack">{p.stack.join(" · ")}</p>
              </article>
            );
          })}
        </section>

        <section className="cv-keep">
          <h2>Education</h2>
          {education.map((ed) => (
            <article key={ed.id} className="cv-item">
              <div className="cv-row">
                <h3>
                  {ed.credential} <span className="cv-at">· {ed.school}</span>
                </h3>
                <span className="cv-date">{ed.period}</span>
              </div>
              {ed.note && <p>{ed.note}</p>}
            </article>
          ))}
        </section>

        <section className="cv-keep">
          <h2>Skills</h2>
          <dl className="cv-skills">
            {skillGroups.map((g) => (
              <div key={g.id}>
                <dt>{g.title}</dt>
                <dd>{g.skills.join(" · ")}</dd>
              </div>
            ))}
            <div>
              <dt>Beyond the code</dt>
              <dd>{softSkills.join(" · ")}</dd>
            </div>
          </dl>
        </section>
      </main>
    </>
  );
}
