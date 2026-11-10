import type { Project, ProjectCategory } from "./types.ts";

export const projectCategories: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "web", label: "Full-stack Web" },
  { id: "mobile", label: "Mobile" },
  { id: "web3", label: "Blockchain" },
];

export const projects: Project[] = [
  {
    id: "gymgenius",
    title: "GymGenius",
    subtitle: "Fitness tracking platform",
    category: "web",
    featured: true,
    art: "dashboard",
    summary:
      "A full-stack workout tracker with real-time progress monitoring, detailed workout logging and analytics dashboards — built as a type-safe Turborepo monorepo.",
    highlights: [
      "Turborepo monorepo with shared Zod schemas between client and server.",
      "Type-safe APIs end to end with tRPC.",
      "Workout logging (sets, reps, weights), custom routines, real-time progress monitoring and analytics dashboards.",
      "React + TypeScript frontend with Vite, Tailwind CSS and shadcn/ui on a Firebase backend.",
      "CI/CD pipelines, Husky git hooks, ESLint, Prettier and testing frameworks.",
    ],
    stack: [
      "React",
      "TypeScript",
      "tRPC",
      "Zod",
      "Firebase",
      "Vite",
      "Tailwind CSS",
      "shadcn/ui",
      "Turborepo",
      "CI/CD",
      "Testing",
    ],
    repo: "https://github.com/Nchimunya97/GymGenius",
  },
  {
    id: "kulima",
    title: "Kulima Tower Levy App",
    subtitle: "Final-year project · Market levy collection",
    category: "mobile",
    art: "phone",
    summary:
      "A cross-platform Flutter app that digitises market levy collection at Kulima Tower in Lusaka — from trader registration to daily payment reports.",
    highlights: [
      "User authentication, levy registration and payment tracking.",
      "Daily reporting with built-in data validation to keep collections accurate.",
      "Android and iOS from one codebase, with a clean UI and structured state management.",
      "Local storage so the app keeps working offline.",
    ],
    stack: [
      "Flutter",
      "Dart",
      "State management",
      "Clean architecture",
      "Data validation",
      "Reporting",
      "Git",
    ],
    repo: "https://github.com/Nchimunya97/Kulima_tower_levy_app",
  },
  {
    id: "docverify",
    title: "Decentralized Document Verification",
    subtitle: "Ethereum smart-contract platform",
    category: "web3",
    art: "chain",
    summary:
      "A blockchain platform for registering and verifying documents with tamper-proof, on-chain records and NRC-based identity checks.",
    highlights: [
      "Solidity smart contracts for secure document registration and immutable storage.",
      "NRC-based identity verification with status tracking: Pending → Verified → Rejected.",
      "React frontend wired to the chain through Ethers.js.",
      "MetaMask wallet authentication, with local development on Hardhat and Ganache.",
    ],
    stack: [
      "Solidity",
      "Hardhat",
      "Ganache",
      "React",
      "JavaScript",
      "Ethers.js",
      "MetaMask",
    ],
    repo: "https://github.com/Nchimunya97/decentralized-document-verification",
  },
];
