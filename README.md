# Nchimunya Sikanyiti — Portfolio

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

## Updating content

Everything on the site — bio, roles, projects, skills, links — comes from
[`packages/content/src`](packages/content/src). Edit those files and the site updates; no component changes needed.

- `profile.ts` – name, contact details, hero text, about story, stats
- `experience.ts` – work history and education
- `projects.ts` – projects (add one and it appears in the grid, modal and command palette)
- `skills.ts` – skill groups. Skill names that match a role's `skills` or a project's `stack` are linked automatically in the "Where I've used it" explorer.

To replace the CV, drop a new PDF into `apps/web/public/` and update `cvFile` in `profile.ts`.

## Branches & deployments

| Branch  | Role                         | What happens on push                                                        |
| ------- | ---------------------------- | --------------------------------------------------------------------------- |
| `dev`   | **default** — day-to-day work | CI: typecheck + build                                                        |
| `stage` | pre-release check            | Firebase Hosting **`stage` preview channel** (stable URL)                    |
| `main`  | production                   | Firebase Hosting **live** + GitHub Pages mirror, analytics on                 |

Typical flow: work on `dev` → open a PR `dev → stage` (you get a preview link in the PR) → merge, check the stage URL → PR `stage → main` → merge to release.

Workflows live in [`.github/workflows`](.github/workflows):

- `ci.yml` — typecheck + build on `dev` pushes and all PRs
- `deploy-firebase.yml` — stage/live/PR-preview deploys to Firebase Hosting
- `deploy-pages.yml` — production mirror on GitHub Pages

### GitHub Pages

In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**. The workflow works out the base path itself, so the repo can be named `nchimunya97.github.io` (site at the root) or anything else (site at `/<repo>/`). On a free GitHub plan, Pages needs the repo to be **public**.

### Firebase Hosting

The deploy workflow needs one repo secret, `FIREBASE_SERVICE_ACCOUNT`:

1. Firebase console → ⚙ **Project settings → Service accounts → Generate new private key** (downloads a JSON file).
2. GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**.
   Name: `FIREBASE_SERVICE_ACCOUNT`, value: the entire JSON file contents.
3. Delete the downloaded JSON from your computer. Never commit it.

Or let the Firebase CLI do it all: `npx firebase-tools init hosting:github`.

Sites: live at `https://portfolio-website-d1aaa.web.app`. The stage channel URL is printed in the workflow log (it looks like `https://portfolio-website-d1aaa--stage-xxxx.web.app`). Preview channels expire after 30 days without a deploy; the next push to `stage` brings it back.

### Costs

- **GitHub Actions** — free and unlimited for public repos on standard runners. Private repos on the free plan get 2,000 minutes/month; each run here takes ~1–2 minutes.
- **Firebase** — this site fits comfortably in the free **Spark** plan (Hosting: 10 GB storage, 360 MB/day transfer; Firestore: 20k writes/day). Spark needs no card. Adding a card moves you to **Blaze** (pay-as-you-go); if you ever do, set a budget alert in Google Cloud Billing.

## Firebase (analytics + contact form)

The config lives in [`apps/web/src/lib/firebase.ts`](apps/web/src/lib/firebase.ts). Firebase web config values are public by design; the security rules protect the data.

- **Analytics** loads in production builds only, a few seconds after the page settles.
- **Contact form** saves messages to the Firestore collection `messages`. If saving fails, it falls back to opening the visitor's email app.

One-time setup in the [Firebase console](https://console.firebase.google.com/project/portfolio-website-d1aaa):

1. **Build → Firestore Database → Create database** (production mode).
2. **Firestore → Rules**: paste the contents of [`firestore.rules`](firestore.rules) and publish.
   Or with the Firebase CLI: `npx firebase-tools deploy --only firestore:rules`.
3. Read incoming messages under **Firestore → Data → messages**.
4. Recommended: in Google Cloud Console → APIs & Services → Credentials, restrict the browser API key to your domains (`nchimunya97.github.io`, `localhost`).

## Design notes

- **60 · 30 · 10 colour rule.** 60% ink (`#0f0f0c`), 30% bone (`#ebe4d6`, used for type and the inverted Journey/Toolkit sections), 10% copper (`#e8672c`), a nod to Zambia's Copperbelt. Light mode swaps the 60 and the 30.
- Type: Bricolage Grotesque (display), Instrument Serif italic (accent words), Inter (body), JetBrains Mono (labels).
- Interactions: a cursor light that follows you down the page and reveals a dot grid, spotlight borders on cards, a typing code editor, a command palette (`Ctrl/⌘ K` or `/`), filterable projects with a detail modal (←/→ to browse), an expandable timeline, a skill explorer, and copy-to-clipboard contacts.
- Respects `prefers-reduced-motion`, works with a keyboard, and is responsive from 320px up.
