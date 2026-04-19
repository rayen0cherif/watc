import type { Opportunity } from "@/types";
import { mockOpportunities } from "@/data/mocks";
import { delay } from "./client";

// TODO(backend): GET /api/student/opportunities
export function fetchOpportunities(): Promise<Opportunity[]> {
  return delay(mockOpportunities);
}
