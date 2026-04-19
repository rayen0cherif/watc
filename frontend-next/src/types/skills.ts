export type SkillCategory = "frontend" | "backend" | "database" | "devops" | "methodology" | "soft";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  trend: number;
  lastAssessedAt: string;
  recommendation?: string;
}
