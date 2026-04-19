import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Adresse e-mail invalide."),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    role: z.enum(["student", "supervisor"]),
    name: z.string().min(2, "Veuillez saisir votre nom complet."),
    email: z.string().email("Adresse e-mail invalide."),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères."),
    level: z.enum(["L3", "M1", "M2", "Ingénierie"]).optional(),
    specialty: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "student") {
      if (!data.level) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["level"], message: "Le niveau est requis." });
      }
      if (!data.specialty || data.specialty.trim().length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["specialty"], message: "La spécialité est requise." });
      }
    }
  });

export type RegisterInput = z.infer<typeof registerSchema>;
