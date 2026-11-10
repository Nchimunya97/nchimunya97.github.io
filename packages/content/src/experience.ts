import type { Education, Experience } from "./types.ts";

export const experience: Experience[] = [
  {
    id: "hytel",
    role: "Software Engineer",
    org: "Hytel",
    period: "Mar 2026 — Present",
    current: true,
    kind: "Full-time",
    summary:
      "Developing and maintaining full-stack applications across mobile, web and cloud.",
    highlights: [
      "Build cross-platform mobile apps with Flutter and web/frontend components with React.",
      "Implement backend integrations with tRPC, Firebase and Google Cloud for authentication, real-time data, storage and cloud infrastructure.",
      "Ship features such as user authentication, data validation, payment tracking, reporting modules and real-time functionality.",
      "Apply clean architecture and state-management best practices from the Kulima Tower Levy App in production.",
      "Collaborate on code reviews and debugging to deliver scalable solutions under tight deadlines.",
    ],
    skills: [
      "Flutter",
      "Dart",
      "React",
      "tRPC",
      "Firebase",
      "Google Cloud",
      "Data validation",
      "Reporting",
      "Clean architecture",
      "State management",
      "Code reviews",
      "Git",
    ],
  },
  {
    id: "yenda",
    role: "AI Data Specialist",
    org: "Yenda",
    period: "Nov 2025 — Mar 2026",
    kind: "Contract",
    summary:
      "Prepared high-quality datasets that machine-learning models could actually learn from.",
    highlights: [
      "Organised, tagged and structured text, image and video datasets for machine learning.",
      "Cleaned and prepared multi-source datasets for intelligent analysis.",
      "Managed and labelled visual datasets for computer-vision workloads.",
    ],
    skills: ["Data annotation", "Data cleaning", "Computer vision datasets"],
  },
  {
    id: "zamphia",
    role: "Enumerator",
    org: "Ministry of Health",
    orgDetail: "ZAMPHIA Project",
    period: "Sep 2023 — Oct 2023",
    kind: "Field survey",
    summary:
      "Conducted national health surveys using electronic questionnaires.",
    highlights: [
      "Ran health surveys with CSPro CAPI questionnaires, ensuring precise and complete data.",
      "Troubleshot tablet and tool problems in the field to avoid delays.",
      "Submitted validated data on time while handling busy schedules and changing conditions.",
    ],
    skills: ["CSPro (CAPI)", "Data validation", "Reporting"],
  },
  {
    id: "zamstats",
    role: "Enumerator",
    org: "Zambia Statistics Agency",
    orgDetail: "Census Preparations",
    period: "2021",
    kind: "Field survey",
    summary:
      "Collected household data during segment listing and mapping for the national census.",
    highlights: [
      "Collected household data with the CSPro electronic tool during segment listing and mapping.",
      "Reviewed and cleaned data daily to catch errors and inconsistencies before submission.",
      "Resolved issues on-site by verifying with respondents, keeping records accurate.",
      "Maintained confidentiality and met daily targets across varied locations.",
    ],
    skills: ["CSPro (CAPI)", "Data validation", "Data cleaning"],
  },
];

export const education: Education[] = [
  {
    id: "zcas",
    school: "ZCAS University",
    credential: "BSc Computing with Business",
    location: "Lusaka, Zambia",
    period: "Completed 2025",
    note: "Final results released January 2026 · Graduation 2026",
  },
  {
    id: "dkst",
    school: "David Kaunda Secondary Technical School",
    credential: "Grade 12 Certificate",
    location: "Lusaka, Zambia",
    period: "Secondary",
  },
];
