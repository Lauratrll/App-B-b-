import { requireProfile } from "@/lib/auth";
import { LAVANDE, MetronomeSouffle } from "@/components/modules/metronome-souffle";

// Cohérence cardiaque — bouton rond de la barre du bas (20/10/2026).
// Contenu : « Le Métronome du souffle » (Laura, 06/11/2026).
export default async function CoherencePage() {
  await requireProfile();
  return (
    <section className="flex flex-col" style={{ gap: 18, paddingBottom: 24 }}>
      <header className="text-center" style={{ padding: "4px 0 0" }}>
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
          Cohérence cardiaque
        </p>
      </header>
      <p className="text-center text-sm" style={{ color: LAVANDE.texte, margin: 0, lineHeight: 1.5 }}>
        Laisse ton souffle suivre la bille : elle monte, tu inspires ; elle redescend, tu expires.
      </p>
      <MetronomeSouffle />
    </section>
  );
}
