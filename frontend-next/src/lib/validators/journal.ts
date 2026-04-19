import { z } from "zod";

export const journalEntrySchema = z.object({
  summary: z.string().min(10, "Décrivez le travail réalisé."),
  blockers: z.string().optional(),
  nextStep: z.string().min(5, "Indiquez la prochaine étape."),
});

export type JournalEntryInput = z.infer<typeof journalEntrySchema>;
