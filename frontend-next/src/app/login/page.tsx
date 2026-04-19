"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { loginSchema, type LoginInput } from "@/lib/validators/auth";
import { useAuth } from "@/providers/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginInput) => {
    setSubmitting(true);
    try {
      // TODO(backend): POST /api/auth/login with { email, password }
      // Demo: any credentials log the user in as a student.
      await new Promise((resolve) => setTimeout(resolve, 400));
      login("student", { email: data.email });
      toast.success("Connexion réussie.");
      router.push("/student/dashboard");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo />
          <h1 className="text-2xl font-semibold text-neutral-900">Connexion à votre espace</h1>
          <p className="text-sm text-neutral-600">
            Accédez à votre tableau de bord PFE.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <Field id="email" label="Adresse e-mail" error={errors.email?.message} required>
              <div className="relative">
                <Mail
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                  strokeWidth={1.5}
                />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="prenom.nom@univ.tn"
                  invalid={!!errors.email}
                  className="pl-9"
                  {...register("email")}
                />
              </div>
            </Field>

            <Field id="password" label="Mot de passe" error={errors.password?.message} required>
              <div className="relative">
                <Lock
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                  strokeWidth={1.5}
                />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  invalid={!!errors.password}
                  className="pl-9"
                  {...register("password")}
                />
              </div>
            </Field>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-600">Vous n'avez pas de compte ?</span>
              <Link href="/register" className="font-medium text-primary-600 hover:underline">
                Créer un compte
              </Link>
            </div>

            <Button type="submit" size="lg" loading={submitting} className="mt-2 w-full">
              Se connecter
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-600">
          En vous connectant, vous acceptez notre politique de confidentialité et les règles
          d'usage de la plateforme Mentora.
        </p>
      </div>
    </div>
  );
}
