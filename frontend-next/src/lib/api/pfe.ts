import type { PFEProject, JournalEntry } from "@/types";
import { mockJournal, mockProject } from "@/data/mocks";
import { delay } from "./client";

// TODO(backend): GET /api/student/pfe
export function fetchCurrentPFE(): Promise<PFEProject> {
  return delay(mockProject);
}

// TODO(backend): GET /api/student/pfe/journal
export function fetchJournalEntries(): Promise<JournalEntry[]> {
  return delay(mockJournal);
}

// TODO(backend): POST /api/student/pfe/journal
export function createJournalEntry(input: Omit<JournalEntry, "id" | "date">): Promise<JournalEntry> {
  return delay({
    id: `j-${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString(),
    ...input,
  });
}
