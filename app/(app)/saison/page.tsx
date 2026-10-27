import { getCurrentSeason, requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getSaisonMeta, getSaisonVersion, type SaisonKey } from "@/lib/content";
import { SaisonView } from "@/components/modules/saison-view";

const SAISON_LABELS: Record<SaisonKey, string> = {
  printemps: "Printemps",
  ete: "Été",
  automne: "Automne",
  hiver: "Hiver",
};

// Une seule saison affichée, sans sélecteur (Laura, 26-27/10) : la saison du
// moment pour les parents ; pour un admin, celle choisie dans le bandeau
// d'aperçu en haut de l'app (getCurrentSeason).
export default async function SaisonPage() {
  const [{ profile }, saison] = await Promise.all([
    requireProfile(),
    getCurrentSeason(),
  ]);
  const mois = getBabyMonth(new Date(profile.birthdate));
  const saisonLabel = SAISON_LABELS[saison];

  const meta = await getSaisonMeta(mois);
  const version = await getSaisonVersion(mois, saison);

  if (!meta || !version) {
    return (
      <section className="space-y-5">
        <header className="space-y-1">
          <p className="text-2xl" aria-hidden>🌿</p>
          <h1 className="text-2xl font-semibold">Vivre la saison&nbsp;: {saisonLabel}</h1>
        </header>
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          Le conseil de saison du mois {mois} n&apos;est pas encore disponible.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <header className="space-y-1">
        <p className="text-2xl" aria-hidden>🌿</p>
        <h1 className="text-2xl font-semibold leading-tight">
          Vivre la saison&nbsp;: {saisonLabel}
        </h1>
        {meta.sous_titre ? (
          <p className="text-sm text-neutral-600">{meta.sous_titre}</p>
        ) : null}
      </header>

      <SaisonView version={version} />
    </section>
  );
}
