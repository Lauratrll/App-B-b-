import type { Metadata } from "next";
import localFont from "next/font/local";
import { Playfair_Display, Nunito } from "next/font/google";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
// Playfair Display = font serif des titres (cases modules, headers).
// Définie comme font-display dans SKILL_ui.md.
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700"],
});
// Nunito = font de la berceuse-rituel (Coucher), en italique. Cf.
// skills/CONSIGNES_CLAUDE_CODE_coucher.md §7.
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Parentalité consciente — 0 à 24 mois",
  description:
    "Accompagnement de parentalité consciente pour les parents de bébés de 0 à 24 mois.",
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
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${nunito.variable} antialiased text-[#3A3228]`}
        style={{ backgroundColor: "#E4DDD6" }}
      >
        <div
          className="mx-auto min-h-dvh max-w-[390px] shadow-sm"
          style={{ backgroundColor: "#F2EDE8" }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
