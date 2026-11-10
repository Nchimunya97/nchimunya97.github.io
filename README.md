# Nchimunya Sikanyiti — Portfolio

**Live:** [nchimunya97.github.io](https://nchimunya97.github.io)

Personal portfolio built as a **Turborepo monorepo** and deployed to **GitHub Pages** with GitHub Actions.

```
.
├── apps/
│   └── web/                 # Vite + React 19 + TypeScript + Tailwind CSS v4 + Motion
│       ├── public/          # favicon, CV (PDF)
│       └── src/
│           ├── components/  # Navbar, CommandPalette, CursorGlow, ProjectModal…
│           │   └── sections/  # Hero, About, Journey, Projects, Toolkit, Contact
│           └── lib/         # theme, toasts, hooks, firebase
├── packages/
│   ├── content/             # ✏️  ALL site content lives here (typed)
│   └── tsconfig/            # shared TypeScript configs
├── .github/workflows/deploy.yml
├── firestore.rules          # security rules for the contact form
└── turbo.json
```

## Run it locally

Requires Node 20.19+ (Node 24 recommended — see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build (apps/web/dist)
npm run preview    # serve the production build
```

### Environment variables

Firebase config is **not** in the code. Copy [`apps/web/.env.example`](apps/web/.env.example) to `apps/web/.env` and fill it in. `.env` is gitignored, so it never gets committed. Without it the site still runs: analytics is off, and the contact form opens the visitor's email app instead.

For deploys, add the same `VITE_FIREBASE_*` names as **repository secrets** (Settings → Secrets and variables → Actions), or upload them all from your `.env` in one go:

```bash
gh secret set -R Nchimunya97/nchimunya97.github.io -f apps/web/.env
```

Note: Firebase *web* keys end up in the public JavaScript of any Firebase site, so keeping them out of git is tidy but not the real protection. Restrict the key in Google Cloud (see the Firebase section below) and rely on `firestore.rules`.

## Updating content

Everything on the site — bio, roles, projects, skills, links — comes from
[`packages/content/src`](packages/content/src). Edit those files and the site updates; no component changes needed.

- `profile.ts` – name, links, hero pitch and intro, the **Now** card rows, the about story, the **proof strip** numbers and the **Hytel** capability cards
- `experience.ts` – work history and education
- `projects.ts` – **case studies**, in display order. Each one has an `outcome` line, four `steps` (Problem / My role / Key decisions / Next time) and optional `primary` / `secondary` buttons. Leave a button out and it isn't shown, so there are no dead "demo" links. Adding a case study also adds it to the tabs and the command palette.
- `skills.ts` – skill groups. Skill names that match a role's `skills` or a case study's `stack` are linked automatically in the "Where I've used it" explorer.

To replace the CV or the AskACME proposal, drop the new PDF into `apps/web/public/` (keeping the file name, or updating `cvFile` / the link in `projects.ts`).

Content rules: only real, verifiable numbers; Hytel work stays capability-only (no client names, code or metrics); and no phone number on the public site.

### How the build works

`npm run build` typechecks, builds the site with Vite, then **pre-renders** it (`apps/web/src/entry-server.tsx` + `apps/web/scripts/prerender.mjs`), so `dist/index.html` already contains the whole page as HTML. Visitors see content before the JavaScript loads, and search engines and link previews read real text. The hero's entrance animation is pure CSS so it plays on that HTML straight away.

## Branches & deployments

| Branch  | Role                         | What happens on push                                                        |
| ------- | ---------------------------- | --------------------------------------------------------------------------- |
| `dev`   | **default** — day-to-day work | CI: typecheck + build                                                        |
| `stage` | pre-release checkpoint       | CI: typecheck + build                                                        |
| `main`  | production                   | Deploys to **GitHub Pages** (nchimunya97.github.io), analytics on           |

Typical flow: work on `dev` → open a PR `dev → stage` → merge → PR `stage → main` → merge to release. Preview changes locally with `npm run dev` (or `npm run build && npm run preview` for the production build).

Workflows live in [`.github/workflows`](.github/workflows):

- `ci.yml` — typecheck + build on pushes to `dev`/`stage` and on all PRs
- `deploy-pages.yml` — production deploy to GitHub Pages on pushes to `main`

### GitHub Pages

In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**. The workflow works out the base path itself, so the repo can be named `nchimunya97.github.io` (site at the root) or anything else (site at `/<repo>/`). On a free GitHub plan, Pages needs the repo to be **public**.

### Costs

- **GitHub Actions + Pages** — free for public repos on standard runners. Private repos on the free plan get 2,000 Actions minutes/month (each run here takes ~1–2 minutes), and Pages on a private repo needs a paid plan.
- **Firebase** — only Analytics and Firestore are used, and they fit comfortably in the free **Spark** plan (Firestore: 20k writes/day). Spark needs no card. Adding a card moves you to **Blaze** (pay-as-you-go); if you ever do, set a budget alert in Google Cloud Billing.

## Firebase (analytics, contact form, testimonials)

The config lives in [`apps/web/src/lib/firebase.ts`](apps/web/src/lib/firebase.ts). Firebase web config values are public by design; the security rules protect the data.

- **Analytics** loads in production builds only, a few seconds after the page settles.
- **Contact form** saves messages to the Firestore collection `messages`. If saving fails, it falls back to opening the visitor's email app.
- **Testimonials** are moderated. Visitors submit through "Leave a testimonial". The public part goes to `testimonials` with `approved: false`, and their email goes to a separate `testimonialContacts` doc that can never be read publicly. The **"Kind words" section stays hidden until at least one testimonial is approved.**

One-time setup in the [Firebase console](https://console.firebase.google.com/project/portfolio-website-d1aaa):

1. **Build → Firestore Database → Create database** (production mode).
2. **Firestore → Rules**: paste the contents of [`firestore.rules`](firestore.rules) and publish.
   Or with the Firebase CLI: `npx firebase-tools deploy --only firestore:rules`.
3. Read incoming messages under **Firestore → Data → messages**.
4. **Approve a testimonial:** open **Firestore → Data → testimonials**, pick the document, and change `approved` from `false` to `true`. It appears on the site on the next page load. To find who sent it, open `testimonialContacts` → the document with the same ID.
5. Recommended: in Google Cloud Console → APIs & Services → Credentials, restrict the browser API key to your domains (`nchimunya97.github.io`, `localhost`).

Until step 1 is done, the testimonial check logs a harmless 404 in the browser console, and submissions show an "email it to me instead" fallback.

### Analytics events

Besides page views, the live site records these custom events (Firebase console → Analytics → Events; new events can take up to 24h to appear):

| Event            | When                                    | Parameters                  |
| ---------------- | --------------------------------------- | --------------------------- |
| `cv_download`    | CV downloaded                           | `source`: hero / palette    |
| `project_open`   | A project's detail view is opened       | `project_id`                |
| `contact_submit` | Contact form sent                       | `result`: saved / email_fallback |
| `testimonial_submit` | Testimonial submitted for review    | `result`: saved / error    |
| `copy_contact`   | Email or phone copied                   | `what`                      |
| `outbound_click` | Any external link (GitHub, repos…)      | `url`                       |
| `skill_select`   | A skill is tapped in the Toolkit        | `skill`                     |
| `palette_open`   | Quick-jump palette opened               | —                           |
| `theme_toggle`   | Light/dark switched                     | `theme`                     |

Events only fire on the production deploy. In `npm run dev` they're logged to the browser console instead.

## Social share image & 404

- `apps/web/public/og-image.png` is the preview card shown on WhatsApp, LinkedIn, X and so on. Its source is [`apps/web/design/og-image.html`](apps/web/design/og-image.html); edit it and re-render with the command at the top of that file.
- `apps/web/public/404.html` is the custom "page not found" page GitHub Pages serves for unknown URLs.

## Design notes

- **60 · 30 · 10 colour rule.** 60% ink (`#0f0f0c`), 30% bone (`#ebe4d6`, used for type and the inverted Journey/Toolkit sections), 10% copper (`#e8672c`), a nod to Zambia's Copperbelt. Light mode swaps the 60 and the 30.
- Type: Bricolage Grotesque (display and body), JetBrains Mono (labels), and Instrument Serif italic for the occasional copper accent word.
- Interactions are deliberately few: a cursor light that follows you down the page, smooth scrolling, a command palette (`Ctrl/⌘ K` or `/`), case-study tabs (←/→ keys), an expandable timeline, a skill explorer linked to roles and case studies, and a live "Now" card fed by GitHub.
- Respects `prefers-reduced-motion`, works with a keyboard, and is responsive from 320px up.
