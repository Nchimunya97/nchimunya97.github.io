export interface Profile {
  name: string;
  firstName: string;
  lastName: string;
  initials: string;
  role: string;
  company: string;
  location: string;
  /** IANA timezone used for the live clock */
  timezone: string;
  timezoneLabel: string;
  email: string;
  githubUser: string;
  github: string;
  linkedin: string;
  /** File name inside apps/web/public */
  cvFile: string;
  /** Hero headline: `lead` in bone, `accent` in copper */
  pitch: { lead: string; accent: string };
  intro: string;
  story: string[];
  now: { label: string; value: string }[];
}

export interface Principle {
  title: string;
  description: string;
  icon: "target" | "shield" | "zap";
}

export interface ProofPoint {
  value: string;
  label: string;
}

export interface Capability {
  tag: string;
  title: string;
  body: string;
  stack: string;
}

export interface Experience {
  id: string;
  role: string;
  org: string;
  orgDetail?: string;
  period: string;
  current?: boolean;
  kind: string;
  summary: string;
  highlights: string[];
  /** Must match skill names in skills.ts to power the "where I've used it" explorer */
  skills: string[];
}

export interface Education {
  id: string;
  school: string;
  credential: string;
  location: string;
  period: string;
  note?: string;
}

export interface CaseLink {
  label: string;
  href: string;
  kind: "demo" | "document" | "code";
}

export interface CaseStep {
  heading: string;
  body: string;
}

export interface Project {
  id: string;
  title: string;
  /** Short name for tabs */
  short: string;
  /** e.g. "Full-stack web · Marketplace" */
  category: string;
  /** Optional context line, e.g. "Team case study · fictional company" */
  context?: string;
  oneLiner: string;
  outcome: string;
  steps: CaseStep[];
  /** Must match skill names in skills.ts where possible */
  stack: string[];
  primary?: CaseLink;
  secondary?: CaseLink;
}

export interface SkillGroup {
  id: string;
  title: string;
  description: string;
  icon: "smartphone" | "cloud" | "database" | "git";
  skills: string[];
}
