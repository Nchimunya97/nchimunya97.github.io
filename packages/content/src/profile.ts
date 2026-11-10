import type { Capability, Principle, Profile, ProofPoint } from "./types.ts";

export const profile: Profile = {
  name: "Nchimunya Sikanyiti",
  firstName: "Nchimunya",
  lastName: "Sikanyiti",
  initials: "NS",
  role: "Software Engineer",
  company: "Hytel",
  location: "Lusaka, Zambia",
  timezone: "Africa/Lusaka",
  timezoneLabel: "CAT",
  email: "nchimu56@gmail.com",
  githubUser: "Nchimunya97",
  github: "https://github.com/Nchimunya97",
  linkedin: "https://www.linkedin.com/in/nchimunya-sikanyiti-2b51b32a9/",
  cvFile: "Nchimunya_Sikanyiti_CV.pdf",
  pitch: { lead: "I build reliable apps", accent: "from clean data up." },
  intro:
    "Before I wrote production code, I collected national census and health-survey data in the field. Now I ship Flutter, React and tRPC features at Hytel, and I treat data accuracy as part of the product.",
  story: [
    "My path into software started in the field. In 2021 I joined the Zambia Statistics Agency's census preparations as an enumerator, collecting household data on CSPro tablets and reviewing and cleaning it daily before submission. Two years later I did the same for the Ministry of Health's ZAMPHIA survey — and learned first-hand that good systems depend on good data.",
    "I went on to complete a BSc in Computing with Business at ZCAS University, building a Flutter levy-collection app for Kulima Tower as my final-year project, then worked as an AI Data Specialist at Yenda, preparing text, image and video datasets for machine learning.",
    "Today I'm a Software Engineer at Hytel, shipping full-stack features — authentication, payment tracking, reporting and real-time functionality — with the same eye for accuracy I picked up in the field.",
  ],
  now: [
    { label: "Building", value: "Full-stack features at Hytel" },
    { label: "Learning", value: "Google Cloud" },
    { label: "Open to", value: "New ideas and collaborations" },
  ],
};

export const proof: ProofPoint[] = [
  { value: "100+", label: "Households surveyed and data cleaned across two national surveys" },
  { value: "2,000+", label: "Machine-learning dataset items annotated at Yenda" },
  { value: "68", label: "Pages in the AskACME architecture proposal (team case study)" },
  { value: "2", label: "Live web apps I've built and shipped on Firebase" },
];

export const principles: Principle[] = [
  {
    icon: "target",
    title: "Accuracy by default",
    description:
      "Validation and data integrity are built in from the first screen, not bolted on at the end.",
  },
  {
    icon: "shield",
    title: "Type-safe end to end",
    description:
      "tRPC, Zod and TypeScript keep the contract between client and server honest.",
  },
  {
    icon: "zap",
    title: "Calm under pressure",
    description:
      "From field surveys to production deadlines, I deliver quality on tight timelines.",
  },
];

/** Hytel work is private: capabilities only — no client names, screenshots, code or metrics. */
export const hytelCapabilities: Capability[] = [
  {
    tag: "Mobile",
    title: "Cross-platform apps",
    body: "Flutter apps for Android and iOS from one codebase, using clean architecture and structured state management.",
    stack: "Flutter · Dart",
  },
  {
    tag: "Backend",
    title: "Real-time data and auth",
    body: "Authentication, real-time data and storage, wired through type-safe tRPC APIs on Firebase and Google Cloud.",
    stack: "tRPC · Firebase · Google Cloud",
  },
  {
    tag: "Product",
    title: "Payments and reporting",
    body: "Payment tracking, data validation and reporting modules, shipped with code review against tight deadlines.",
    stack: "React · Validation · Code reviews",
  },
];
