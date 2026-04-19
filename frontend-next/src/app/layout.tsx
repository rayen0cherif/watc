import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/providers/auth-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mentora — Plateforme PFE",
    template: "%s · Mentora",
  },
  description:
    "Mentora structure le cycle de vie complet de votre Projet de Fin d'Études avec une évaluation IA continue et un suivi clair pour étudiants et encadrants.",
};

export const viewport: Viewport = {
  themeColor: "#4F6EDB",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen bg-neutral-50 font-sans text-neutral-900 antialiased">
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              toast:
                "border border-neutral-200 bg-white text-neutral-900 shadow-sm",
              title: "text-sm font-medium",
              description: "text-xs text-neutral-600",
            },
          }}
        />
      </body>
    </html>
  );
}
