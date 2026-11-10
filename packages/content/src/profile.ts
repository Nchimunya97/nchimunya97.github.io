import type { Principle, Profile, Stat } from "./types.ts";

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
  phone: "+260767670464",
  githubUser: "Nchimunya97",
  github: "https://github.com/Nchimunya97",
  cvFile: "Nchimunya_Sikanyiti_CV.pdf",
  headline: "I build",
  rotatingRoles: [
    "cross-platform mobile apps.",
    "full-stack web products.",
    "real-time data features.",
    "type-safe APIs.",
  ],
  intro:
    "Software Engineer at Hytel working across Flutter, React, tRPC, Firebase and Google Cloud — with a background in national field surveys that made me obsessive about accurate data, validation and clear reporting.",
  story: [
    "My path into software started in the field. In 2021 I joined the Zambia Statistics Agency's census preparations as an enumerator, collecting household data on CSPro tablets and reviewing and cleaning it daily before submission. Two years later I did the same for the Ministry of Health's ZAMPHIA survey — and learned first-hand that good systems depend on good data.",
    "I went on to complete a BSc in Computing with Business at ZCAS University, building a Flutter levy-collection app for Kulima Tower as my final-year project, then worked as an AI Data Specialist at Yenda, preparing text, image and video datasets for machine learning.",
    "Today I'm a Software Engineer at Hytel, shipping full-stack features — authentication, payment tracking, reporting and real-time functionality — with the same eye for accuracy I picked up in the field.",
  ],
};

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

export const stats: Stat[] = [
  { value: 4, label: "Professional roles" },
  { value: 3, label: "Featured projects" },
  { value: 2, label: "National data surveys" },
];
