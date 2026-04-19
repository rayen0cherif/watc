"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StepActions } from "@/components/onboarding/step-actions";
import { cn } from "@/lib/cn";
import { uploadFileApi } from "@/lib/api";

const MAX_BYTES = 10 * 1024 * 1024;

function formatBytes(b: number) {
  if (b < 1024) return `${b} o`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} Ko`;
  return `${(b / 1024 / 1024).toFixed(1)} Mo`;
}

export default function CvStepPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function pickFile(f: File | undefined) {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Seuls les fichiers PDF sont acceptés.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError("Le fichier dépasse 10 Mo.");
      return;
    }
    setError(null);
    setFile(f);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return;
    setSubmitting(true);
    
    // Upload CV to backend
    const formData = new FormData();
    formData.append("cv", file);
    formData.append("projectInfo", "Onboarding CV upload");
    
    uploadFileApi<any>("/students/cv", formData)
      .then(() => {
        // CV uploaded successfully, proceed to next step
        router.push("/onboarding/pfe");
      })
      .catch((error) => {
        console.error("Failed to upload CV:", error);
        setError("Erreur lors du téléversement du CV. Veuillez réessayer.");
        setSubmitting(false);
      });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <p className="text-sm text-neutral-500">Étape 3 sur 6</p>
        <h1 className="mt-1 text-[28px] font-semibold leading-tight text-neutral-900">
          Téléversez votre CV
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Au format PDF uniquement, 10 Mo maximum. Votre CV est partagé
          uniquement avec vos encadrants assignés.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          {!file ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                pickFile(e.dataTransfer.files?.[0]);
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-8 text-center transition-colors duration-200",
                dragOver
                  ? "border-primary-500 bg-primary-50/40"
                  : "border-neutral-300 bg-neutral-50"
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-primary-600 border border-neutral-200">
                <Upload className="h-5 w-5" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  Glissez-déposez votre CV ici
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  ou{" "}
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="font-medium text-primary-600 hover:text-primary-700"
                  >
                    parcourez vos fichiers
                  </button>
                </p>
              </div>
              <p className="text-sm text-neutral-400">PDF · 10 Mo max</p>
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={(e) => pickFile(e.target.files?.[0])}
              />
            </div>
          ) : (
            <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary-600 border border-neutral-200">
                <FileText className="h-4 w-4" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900">
                  {file.name}
                </p>
                <p className="text-sm text-neutral-500">
                  {formatBytes(file.size)} · prêt à être envoyé
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                aria-label="Retirer le fichier"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          )}

          {error && (
            <p className="mt-4 text-sm text-danger-500" role="alert">
              {error}
            </p>
          )}
        </Card>

        <StepActions
          current="cv"
          nextLabel="Valider le CV"
          canSubmit={Boolean(file)}
          isSubmitting={submitting}
        />
      </form>
    </div>
  );
}
