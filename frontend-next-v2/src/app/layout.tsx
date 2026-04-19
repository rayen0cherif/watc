import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mentora — Plateforme intelligente d'encadrement des PFE",
  description:
    "Mentora structure le suivi des Projets de Fin d'Études : pilotage des jalons, évaluation par IA, et collaboration entre étudiants et encadrants.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
