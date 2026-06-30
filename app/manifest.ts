import type { MetadataRoute } from "next";

// Manifest PWA — nom affiché sous l'icône sur l'écran d'accueil.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Parentalité consciente",
    short_name: "Parentalité",
    description:
      "Accompagnement de parentalité consciente pour les parents de bébés de 0 à 24 mois.",
    start_url: "/",
    display: "standalone",
    background_color: "#F2EDE8",
    theme_color: "#DB936B",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
