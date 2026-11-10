import type { SkillGroup } from "./types.ts";

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    icon: "smartphone",
    title: "Mobile & Frontend",
    description: "Cross-platform apps and fast, accessible interfaces.",
    skills: [
      "Flutter",
      "Dart",
      "React",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Vite",
    ],
  },
  {
    id: "backend",
    icon: "cloud",
    title: "Backend, Cloud & Web3",
    description: "Type-safe APIs, real-time data and cloud infrastructure.",
    skills: [
      "tRPC",
      "Firebase",
      "Google Cloud",
      "Zod",
      "Solidity",
      "Ethers.js",
      "Hardhat",
    ],
  },
  {
    id: "data",
    icon: "database",
    title: "Data & Analytics",
    description: "Collecting, validating and preparing data people can trust.",
    skills: [
      "Data validation",
      "Data cleaning",
      "Data annotation",
      "Computer vision datasets",
      "CSPro (CAPI)",
      "Microsoft Excel",
      "Reporting",
    ],
  },
  {
    id: "practice",
    icon: "git",
    title: "Engineering Practice",
    description: "The habits that keep codebases healthy as they grow.",
    skills: [
      "Git",
      "Turborepo",
      "CI/CD",
      "Clean architecture",
      "State management",
      "Code reviews",
      "Testing",
      "Solution architecture",
      "Project planning",
    ],
  },
];

export const softSkills: string[] = [
  "Written & verbal communication",
  "Interviewing & survey techniques",
  "Teamwork",
  "Working under pressure",
  "Time management",
  "Attention to detail",
  "Professional report writing",
  "Quick learner",
];

