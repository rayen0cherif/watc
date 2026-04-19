"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { OnboardingShell } from "@/components/layout/onboarding-shell";
import { Stepper } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { pfeFormSchema, type PfeFormInput } from "@/lib/validators/pfe";

const STEPS = [
  { id: "subject", label: "Sujet" },
  { id: "skills", label: "Compétences" },
  { id: "mentors", label: "Encadrants" },
];

export default function PfeOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [stackInput, setStackInput] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<PfeFormInput>({
    resolver: zodResolver(pfeFormSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      objectives: "",
      stack: [],
      skillsToLearn: "",
      academicName: "",
      academicEmail: "",
      professionalName: "",
      professionalEmail: "",
      company: "",
    },
  });

  const stack = watch("stack");

  const stepFields: Array<Array<keyof PfeFormInput>> = useMemo(
    () => [
      ["title", "description", "objectives"],
      ["stack", "skillsToLearn"],
      ["academicName", "academicEmail", "professionalName", "professionalEmail", "company"],
    ],
    [],
  );

  const handleNext = async () => {
    const ok = await trigger(stepFields[step], { shouldFocus: true });
    if (!ok) return;
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handlePrev = () => setStep((prev) => Math.max(0, prev - 1));

  const addStackItem = () => {
    const trimmed = stackInput.trim();
    if (!trimmed) return;
    if (stack.includes(trimmed)) return;
    setValue("stack", [...stack, trimmed], { shouldValidate: true });
    setStackInput("");
  };

  const removeStackItem = (item: string) => {
    setValue(
      "stack",
      stack.filter((s) => s !== item),
      { shouldValidate: true },
    );
  };

  const onSubmit = async (data: PfeFormInput) => {
    // TODO(backend): POST /api/pfe with full payload.
    await new Promise((resolve) => setTimeout(resolve, 400));
    toast.success("Sujet enregistré. Place à l'évaluation IA.");
    // Persist minimal state for the next step (optional: localStorage or URL)
    try {
      window.sessionStorage.setItem("mentora.pfe.draft", JSON.stringify(data));
    } catch {
      // ignore
    }
    router.push("/onboarding/ai-evaluation");
  };

  return (
    <OnboardingShell
      title="Présentez votre Projet de Fin d'Études"
      description="Trois étapes rapides avant de démarrer l'évaluation IA."
    >
      <div className="mb-8">
        <Stepper steps={STEPS} current={step} />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
        noValidate
      >
        {/* Step 1 */}
        {step === 0 ? (
          <div className="flex flex-col gap-5">
            <Field
              id="title"
              label="Titre du projet"
              helper="Un titre clair, orienté résultat."
              error={errors.title?.message}
              required
            >
              <Input
                id="title"
                placeholder="Ex. Plateforme de monitoring des serveurs avec ML"
                invalid={!!errors.title}
                {...register("title")}
              />
            </Field>

            <Field
              id="description"
              label="Description synthétique"
              helper="Contexte, problématique et approche générale (2 à 4 phrases)."
              error={errors.description?.message}
              required
            >
              <Textarea
                id="description"
                rows={4}
                placeholder="Décrivez le contexte, la problématique et l'approche générale."
                invalid={!!errors.description}
                {...register("description")}
              />
            </Field>

            <Field
              id="objectives"
              label="Objectifs principaux"
              helper="Un objectif par ligne."
              error={errors.objectives?.message}
              required
            >
              <Textarea
                id="objectives"
                rows={4}
                placeholder="- Collecter les métriques système&#10;- Détecter les anomalies&#10;- Générer des alertes"
                invalid={!!errors.objectives}
                {...register("objectives")}
              />
            </Field>
          </div>
        ) : null}

        {/* Step 2 */}
        {step === 1 ? (
          <div className="flex flex-col gap-5">
            <Field
              id="stack-input"
              label="Stack technique envisagée"
              helper="Appuyez sur Entrée pour ajouter une technologie."
              error={errors.stack?.message as string | undefined}
              required
            >
              <div className="flex gap-2">
                <Input
                  id="stack-input"
                  placeholder="React, Node.js, PostgreSQL…"
                  value={stackInput}
                  onChange={(event) => setStackInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addStackItem();
                    }
                  }}
                />
                <Button type="button" variant="secondary" onClick={addStackItem} aria-label="Ajouter">
                  <Plus className="h-4 w-4" strokeWidth={1.5} />
                </Button>
              </div>

              {stack.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {stack.map((item) => (
                    <li key={item}>
                      <Badge tone="primary" className="gap-1.5">
                        {item}
                        <button
                          type="button"
                          aria-label={`Retirer ${item}`}
                          onClick={() => removeStackItem(item)}
                          className="rounded-full p-0.5 hover:bg-primary-500/20"
                        >
                          <X className="h-3 w-3" strokeWidth={2} />
                        </button>
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Field>

            <Field
              id="skillsToLearn"
              label="Compétences que vous souhaitez développer"
              helper="Optionnel. Permet d'orienter l'évaluation IA."
              error={errors.skillsToLearn?.message}
            >
              <Textarea
                id="skillsToLearn"
                rows={3}
                placeholder="Ex. Architecture cloud, tests d'intégration, UX research…"
                {...register("skillsToLearn")}
              />
            </Field>
          </div>
        ) : null}

        {/* Step 3 */}
        {step === 2 ? (
          <div className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="academicName"
                label="Encadrant académique"
                error={errors.academicName?.message}
                required
              >
                <Input
                  id="academicName"
                  placeholder="Dr. Karim Benali"
                  invalid={!!errors.academicName}
                  {...register("academicName")}
                />
              </Field>
              <Field
                id="academicEmail"
                label="E-mail académique"
                error={errors.academicEmail?.message}
                required
              >
                <Input
                  id="academicEmail"
                  type="email"
                  placeholder="karim.benali@univ.tn"
                  invalid={!!errors.academicEmail}
                  {...register("academicEmail")}
                />
              </Field>
            </div>

            <div className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50 p-5">
              <p className="text-sm font-medium text-neutral-900">
                Encadrement professionnel (optionnel)
              </p>
              <p className="mt-1 text-xs text-neutral-600">
                À compléter si votre PFE se déroule en entreprise.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field
                  id="professionalName"
                  label="Nom du tuteur"
                  error={errors.professionalName?.message}
                >
                  <Input
                    id="professionalName"
                    placeholder="Nadia Trabelsi"
                    {...register("professionalName")}
                  />
                </Field>
                <Field
                  id="professionalEmail"
                  label="E-mail du tuteur"
                  error={errors.professionalEmail?.message}
                >
                  <Input
                    id="professionalEmail"
                    type="email"
                    placeholder="nadia@entreprise.tn"
                    invalid={!!errors.professionalEmail}
                    {...register("professionalEmail")}
                  />
                </Field>
                <Field
                  id="company"
                  label="Entreprise"
                  error={errors.company?.message}
                >
                  <Input
                    id="company"
                    placeholder="Nom de l'entreprise"
                    {...register("company")}
                  />
                </Field>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={handlePrev}
            disabled={step === 0}
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Précédent
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" variant="primary" onClick={handleNext}>
              Suivant
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          ) : (
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Valider et continuer
              <Check className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          )}
        </div>
      </form>
    </OnboardingShell>
  );
}
