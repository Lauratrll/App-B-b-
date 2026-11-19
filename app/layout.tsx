import type { Metadata } from "next";
import localFont from "next/font/local";
import { MesureAudience } from "@/components/ui/mesure-audience";
import "./globals.css";

// 19/11/2026 : polices hébergées DANS le projet (app/fonts/, fichiers de
// @fontsource, licence OFL) et non plus chez Google : deux mises en ligne
// Vercel ont échoué parce que Google Fonts ne répondait pas, et une police de
// remplacement s'affichait. Polices Geist retirées (jamais utilisées).
// Playfair Display = font serif des titres (cases modules, headers).
// Définie comme font-display dans SKILL_ui.md.
const playfair = localFont({
  src: [
    { path: "./fonts/playfair-display-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/playfair-display-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/playfair-display-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-playfair",
  display: "swap",
  fallback: ["Georgia", "serif"],
});
// Nunito = font de la berceuse-rituel (Coucher), en italique. Cf.
// skills/CONSIGNES_CLAUDE_CODE_coucher.md §7. Pas préchargée : elle ne sert
// que sur la page Coucher.
const nunito = localFont({
  src: [
    { path: "./fonts/nunito-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/nunito-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/nunito-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/nunito-latin-600-italic.woff2", weight: "600", style: "italic" },
  ],
  variable: "--font-nunito",
  display: "swap",
  preload: false,
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Parentalité consciente, 0 à 23 mois",
  description:
    "Accompagnement de parentalité consciente pour les parents de bébés de 0 à 23 mois.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "Parentalité consciente",
    statusBarStyle: "default",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${playfair.variable} ${nunito.variable} antialiased text-[#3A3228]`}
        style={{ backgroundColor: "#E4DDD6" }}
      >
        <div
          className="mx-auto min-h-dvh max-w-[390px] shadow-sm"
          style={{ backgroundColor: "#FBF2E7" }}
        >
          {children}
        </div>
        {/* Mesure d'audience Vercel, anonyme, admins exclus. */}
        <MesureAudience />
      </body>
    </html>
  );
}
