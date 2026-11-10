import { experience } from "./experience.ts";
import { projects } from "./projects.ts";
import { skillGroups } from "./skills.ts";

export * from "./types.ts";
export { profile, principles, proof, hytelCapabilities } from "./profile.ts";
export { experience, education } from "./experience.ts";
export { projects } from "./projects.ts";
export { skillGroups, softSkills } from "./skills.ts";

export interface SkillUsage {
  kind: "role" | "project";
  id: string;
  title: string;
  detail: string;
}

/** Every role and case study that lists the given skill. */
export function whereUsed(skill: string): SkillUsage[] {
  const roles: SkillUsage[] = experience
    .filter((e) => e.skills.includes(skill))
    .map((e) => ({
      kind: "role",
      id: e.id,
      title: `${e.role} · ${e.org}`,
      detail: e.period,
    }));

  const work: SkillUsage[] = projects
    .filter((p) => p.stack.includes(skill))
    .map((p) => ({
      kind: "project",
      id: p.id,
      title: p.title,
      detail: p.category,
    }));

  return [...roles, ...work];
}

/** Total number of distinct technical skills across all groups. */
export const technicalSkillCount = new Set(skillGroups.flatMap((g) => g.skills)).size;
