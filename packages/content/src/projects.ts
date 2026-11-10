import type { Project } from "./types.ts";

/**
 * Case studies, in display order. Every claim here should be something the
 * owner can stand behind in an interview — no invented metrics.
 */
export const projects: Project[] = [
  {
    id: "askacme",
    title: "AskACME Proposal",
    short: "AskACME",
    category: "Solution architecture · AI enablement",
    context: "Team case study · fictional company",
    oneLiner:
      "A 68-page proposal our team wrote for adopting a governed internal AI assistant at ACME Corp, a fictional company — covering needs assessment, architecture, business case, delivery plan, risk register and change request.",
    outcome:
      "Phase 1 is costed at about $246K for year one, and the business case shows people are 87% of that cost — the model only about 4%.",
    steps: [
      {
        heading: "Problem",
        body: "Staff were already pasting company data into personal AI tools, with no logging, no owner and no cost attribution.",
      },
      {
        heading: "Approach",
        body: "Authorization parity: answers come only from documents the user could already open, tested against planted restricted files the system must refuse.",
      },
      {
        heading: "Architecture",
        body: "High- and low-level designs where all model traffic passes through one controlled gateway that logs it, attributes it to a team and checks it before it leaves.",
      },
      {
        heading: "Delivery",
        body: "A phased rollout gated on passing test questions, a go/no-go date with a fallback outside the change freeze, and a self-audit against twelve review-board questions.",
      },
    ],
    stack: [
      "Solution architecture",
      "RAG",
      "AI governance",
      "Business case",
      "Risk register",
      "Project planning",
    ],
    primary: { label: "Read the proposal", href: "AskACME_Proposal.pdf", kind: "document" },
    secondary: { label: "Executive summary", href: "AskACME_Proposal.pdf#page=5", kind: "document" },
  },
  {
    id: "agrirent",
    title: "AgriRent",
    short: "AgriRent",
    category: "Full-stack web · Marketplace",
    oneLiner:
      "A farm-equipment rental marketplace for Zambia: owners list tractors, harvesters and planters with daily rates in kwacha, and farmers search, book and message them.",
    outcome:
      "A live web app with renter, owner and admin roles, real-time bookings and messages, and security rules that keep each booking visible only to its renter and owner.",
    steps: [
      {
        heading: "Problem",
        body: "Tractors and harvesters are expensive to own, and many farmers only need one for a few days a season.",
      },
      {
        heading: "My role",
        body: "Built the web app and its Firebase backend in a Turborepo monorepo: listings and search, bookings, messaging, notifications and owner and admin dashboards.",
      },
      {
        heading: "Key decisions",
        body: "Real-time Firestore listeners for bookings and messages, and per-user security rules: only renters can create a booking, and only its two parties can read it.",
      },
      {
        heading: "Next time",
        body: "I'd add mobile-money payments and move booking-status changes to the server, so a status can't be edited from the client.",
      },
    ],
    stack: ["React", "TypeScript", "Firebase", "tRPC", "Zod", "Tailwind CSS", "Turborepo"],
    primary: { label: "Live demo", href: "https://agrirent-project.web.app/", kind: "demo" },
    secondary: { label: "Code", href: "https://github.com/Nchimunya97/AgriRent", kind: "code" },
  },
  {
    id: "kulima",
    title: "Kulima Tower Levy App",
    short: "Kulima Tower",
    category: "Mobile · Final-year project",
    context: "ZCAS University final-year project",
    oneLiner:
      "My final-year project at ZCAS University: a Flutter app for collecting levies from drivers at Kulima Tower in Lusaka, with separate driver, collector and supervisor roles.",
    outcome:
      "A working Android and iOS app from one codebase: drivers show a QR code, collectors scan it to record the levy, and supervisors see daily totals with charts and PDF reports.",
    steps: [
      {
        heading: "Problem",
        body: "Levies were recorded by hand, so payments were hard to verify on the spot and daily totals were hard to reconcile.",
      },
      {
        heading: "My role",
        body: "Sole developer: requirements, UI design, architecture, implementation and testing.",
      },
      {
        heading: "Key decisions",
        body: "QR codes so a collector can confirm a driver in seconds, number-plate validation before any payment is saved, and role-based screens backed by Firebase Auth.",
      },
      {
        heading: "Next time",
        body: "I'd handle offline sync conflicts on the server and send drivers an SMS receipt for every payment.",
      },
    ],
    stack: ["Flutter", "Dart", "Firebase", "Data validation", "Reporting", "State management"],
    secondary: { label: "Code", href: "https://github.com/Nchimunya97/Kulima_tower_levy_app", kind: "code" },
  },
  {
    id: "gymgenius",
    title: "GymGenius",
    short: "GymGenius",
    category: "Full-stack web",
    oneLiner:
      "A workout tracker for trainees and trainers — logging, custom routines and real-time progress dashboards — built as a type-safe Turborepo monorepo.",
    outcome:
      "Client and server share one set of Zod schemas through tRPC, so an API change that would break the UI fails the build instead of reaching users.",
    steps: [
      {
        heading: "Problem",
        body: "Workout data usually lives in notebooks or apps that bury it. I wanted logging and progress in one place.",
      },
      {
        heading: "My role",
        body: "Designed and built it end to end: schemas, tRPC API, React UI and the CI/CD pipeline.",
      },
      {
        heading: "Key decisions",
        body: "A monorepo with shared schemas, plus Husky hooks, ESLint and Prettier, so every commit passes the same checks before it lands.",
      },
      {
        heading: "Next time",
        body: "I'd add end-to-end tests earlier, and a mobile client on the same API.",
      },
    ],
    stack: ["React", "TypeScript", "tRPC", "Zod", "Firebase", "Tailwind CSS", "Turborepo", "CI/CD"],
    primary: { label: "Live demo", href: "https://gymgenius-2f2bf.web.app/", kind: "demo" },
    secondary: { label: "Code", href: "https://github.com/Nchimunya97/GymGenius", kind: "code" },
  },
  {
    id: "docverify",
    title: "Document Verification",
    short: "DocVerify",
    category: "Blockchain",
    oneLiner:
      "Ethereum smart contracts for tamper-proof document registration, with NRC-based identity checks and a React front end.",
    outcome:
      "Each document's status — Pending, Verified or Rejected — is recorded on-chain, so anyone can audit it.",
    steps: [
      {
        heading: "Problem",
        body: "Forged certificates are hard to catch when verification depends on paper and phone calls.",
      },
      {
        heading: "My role",
        body: "Wrote the Solidity contracts and the React and Ethers.js front end, with MetaMask sign-in.",
      },
      {
        heading: "Key decisions",
        body: "Documents are identified by their hash, so the files themselves never go on a public ledger.",
      },
      {
        heading: "Next time",
        body: "I'd restrict verification to approved issuers with role-based access control, and deploy to a testnet with a gas-cost analysis.",
      },
    ],
    stack: ["Solidity", "Hardhat", "Ethers.js", "React", "JavaScript"],
    secondary: {
      label: "Code",
      href: "https://github.com/Nchimunya97/decentralized-document-verification",
      kind: "code",
    },
  },
];
