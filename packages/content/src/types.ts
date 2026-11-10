export interface Profile {
  name: string;
  firstName: string;
  lastName: string;
  initials: string;
  role: string;
  company: string;
  location: string;
  /** IANA timezone used for the live clock in the footer */
  timezone: string;
  timezoneLabel: string;
  email: string;
  phone: string;
  githubUser: string;
  github: string;
  /** File name inside apps/web/public */
  cvFile: string;
  headline: string;
  rotatingRoles: string[];
  intro: string;
  story: string[];
}

export interface Principle {
  title: string;
  description: string;
  icon: "target" | "shield" | "zap";
}

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
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

export type ProjectCategory = "web" | "mobile" | "web3";

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  summary: string;
  highlights: string[];
  stack: string[];
  repo: string;
  featured?: boolean;
  art: "dashboard" | "phone" | "chain";
}

export interface SkillGroup {
  id: string;
  title: string;
  description: string;
  icon: "smartphone" | "cloud" | "database" | "git";
  skills: string[];
}
