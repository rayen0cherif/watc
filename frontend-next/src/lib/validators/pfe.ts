import { z } from "zod";

export const pfeStepOneSchema = z.object({
  title: z.string().min(5, "Donnez un titre d'au moins 5 caractères."),
  description: z.string().min(20, "Décrivez votre projet en 20 caractères minimum."),
  objectives: z.string().min(10, "Ajoutez au moins un objectif."),
});

export const pfeStepTwoSchema = z.object({
  stack: z.array(z.string()).min(1, "Ajoutez au moins une technologie."),
  skillsToLearn: z.string().optional(),
});

export const pfeStepThreeSchema = z.object({
  academicName: z.string().min(2, "Nom de l'encadrant académique requis."),
  academicEmail: z.string().email("E-mail de l'encadrant académique invalide."),
  professionalName: z.string().optional(),
  professionalEmail: z
    .string()
    .optional()
    .refine((value) => !value || /.+@.+\..+/.test(value), {
      message: "E-mail professionnel invalide.",
    }),
  company: z.string().optional(),
});

export const pfeFormSchema = pfeStepOneSchema
  .merge(pfeStepTwoSchema)
  .merge(pfeStepThreeSchema);

export type PfeFormInput = z.infer<typeof pfeFormSchema>;
