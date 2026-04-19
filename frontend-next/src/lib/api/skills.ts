import type { Skill } from "@/types";
import { mockSkills } from "@/data/mocks";
import { delay } from "./client";

// TODO(backend): GET /api/student/skills
export function fetchSkills(): Promise<Skill[]> {
  return delay(mockSkills);
}
