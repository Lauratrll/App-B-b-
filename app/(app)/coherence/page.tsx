import { requireProfile } from "@/lib/auth";
import { MetronomeSouffle } from "@/components/modules/metronome-souffle";
import { LAVANDE } from "@/components/modules/metronome-design";

// Cohérence cardiaque — bouton rond de la barre du bas (20/10/2026).
// Contenu : « Le Métronome du souffle » (Laura, 06/11/2026).
// Toute la page a le fond lavande ; le contenu est centré en hauteur dans
// l'espace laissé par la barre du bas (56) et les marges du <main> (24 + 16).
// 96 est écrit en dur : BOTTOM_NAV_HEIGHT vient d'un fichier "use client",
// qu'une page serveur ne peut pas lire (erreur 500 en ligne).
const HORS_CONTENU = 96;
export default async function CoherencePage() {
  await requireProfile();
  return (
    <>
      {/* Fond lavande sur tout l'écran de l'app (colonne de 390 px max). */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 left-1/2 -translate-x-1/2"
        style={{ width: "min(100vw, 390px)", background: LAVANDE.fond, zIndex: 0 }}
      />
      <section
        className="relative flex flex-col items-center justify-center"
        style={{ zIndex: 1, minHeight: `calc(100dvh - ${HORS_CONTENU}px)`, gap: 14 }}
      >
        <header className="text-center">
          <h1
            className="font-display font-bold"
            style={{ fontSize: 26, color: LAVANDE.texte, letterSpacing: "-.015em", lineHeight: 1.1, margin: "0 0 8px 0" }}
          >
            Le Métronome du souffle
          </h1>
          <p
            className="font-semibold uppercase"
            style={{ fontSize: 9, color: LAVANDE.texte, opacity: 0.7, letterSpacing: ".15em", margin: 0 }}
          >
            5 min de cohérence cardiaque
          </p>
        </header>
        <p className="text-center text-sm" style={{ color: LAVANDE.texte, margin: "0 0 6px 0", lineHeight: 1.5 }}>
          En respirant lentement et profondément, notre cœur trouve un rythme calme et régulier, et bébé, blotti contre nous, s’accorde naturellement sur cette douceur.
        </p>
        <MetronomeSouffle />
      </section>
    </>
  );
}
