"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Field, FieldHint } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StepActions } from "@/components/onboarding/step-actions";
import { STACK_CATALOG } from "@/lib/onboarding-data";
import { cn } from "@/lib/cn";

export default function StackStepPage() {
  const router = useRouter();
  const [stack, setStack] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const grouped = useMemo(() => Object.entries(STACK_CATALOG), []);

  function toggleStack(item: string) {
    setStack((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  }

  function addSkill() {
    const value = skillInput.trim();
    if (!value || skills.includes(value)) return;
    setSkills((prev) => [...prev, value]);
    setSkillInput("");
  }

  function removeSkill(s: string) {
    setSkills((prev) => prev.filter((x) => x !== s));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    // TODO(backend): POST /api/students/stack
    router.push("/student/ai-evaluation");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="text-sm text-neutral-500">Étape 5 sur 6</p>
        <h1 className="mt-1 text-[28px] font-semibold leading-tight text-neutral-900">
          Stack et compétences
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Ces éléments permettent à l&apos;assistant IA de calibrer une évaluation
          pertinente pour votre PFE.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <Label required>Technologies utilisées</Label>
          <p className="mt-1 text-sm text-neutral-500">
            Sélectionnez tous les outils que vous prévoyez d&apos;utiliser.
          </p>

          <div className="mt-6 space-y-6">
            {grouped.map(([category, items]) => (
              <div key={category}>
                <p className="text-sm font-medium text-neutral-700">
                  {category}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {items.map((item) => {
                    const active = stack.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleStack(item)}
                        className={cn(
                          "h-8 rounded-lg border px-3 text-sm font-medium transition-all duration-200 ease-in-out hover:-translate-y-px",
                          active
                            ? "border-primary-500 bg-primary-500 text-white"
                            : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                        )}
                        aria-pressed={active}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="mt-6 p-6">
          <Field>
            <Label htmlFor="skills">
              Compétences requises{" "}
              <span className="font-normal text-neutral-500">(optionnel)</span>
            </Label>
            <FieldHint>
              Ajoutez par exemple : « architecture micro-services », « DDD »,
              « observabilité ».
            </FieldHint>

            <div className="mt-1 flex gap-2">
              <Input
                id="skills"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Saisir puis appuyer sur Entrée"
              />
              <button
                type="button"
                onClick={addSkill}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition-all duration-200 ease-in-out hover:-translate-y-px hover:bg-neutral-50"
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
                Ajouter
              </button>
            </div>
          </Field>

          {skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm text-neutral-700"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSkill(s)}
                    className="text-neutral-400 transition-colors hover:text-neutral-900"
                    aria-label={`Retirer ${s}`}
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </Card>

        <StepActions
          current="stack"
          nextLabel="Préparer mon évaluation"
          canSubmit={stack.length > 0}
          isSubmitting={submitting}
        />
      </form>
    </div>
  );
}
