import type { Evaluation } from "@/types";
import { mockEvaluations } from "@/data/mocks";
import { delay } from "./client";

// TODO(backend): GET /api/student/evaluations
export function fetchEvaluations(): Promise<Evaluation[]> {
  return delay(mockEvaluations);
}
