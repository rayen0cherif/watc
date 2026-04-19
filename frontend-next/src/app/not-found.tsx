import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-danger-50 text-danger-500">
          <AlertTriangle className="h-8 w-8" strokeWidth={1.5} aria-hidden />
        </div>
        <p className="text-sm font-medium uppercase tracking-wider text-neutral-400">
          Erreur 404
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-900">
          Page introuvable
        </h1>
        <p className="mt-3 text-sm text-neutral-600">
          La page recherchée n'existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className={`${buttonVariants({ variant: "primary" })} mt-8 inline-flex`}
        >
          Retour à l'accueil
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}
