import { getCurrentSeason, requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getSaisonMeta, getSaisonVersion, type SaisonKey } from "@/lib/content";
import { CADRE_BLANC, SAISON_TONS, SaisonEntete, SaisonView } from "@/components/modules/saison-view";

// « en hiver », « en été », « en automne », mais « au printemps » (Laura, 01/11).
const EN_SAISON: Record<SaisonKey, string> = {
  printemps: "au printemps",
  ete: "en été",
  automne: "en automne",
  hiver: "en hiver",
};

// Thème du mois tel qu'il est stocké dans le sous-titre Saison de chaque mois :
// « Mois 4 : Le Découvreur · Vivre la saison ensemble » → « Le Découvreur ».
function themeDuMois(sousTitre?: string): string | null {
  const m = /^Mois\s*\d+\s*:\s*(.+?)\s*·/.exec(sousTitre ?? "");
  return m ? m[1] : null;
}

// Une seule saison affichée, sans sélecteur (Laura, 26-27/10) : la saison du
// moment pour les parents ; pour un admin, celle choisie dans le bandeau
// d'aperçu en haut de l'app (getCurrentSeason).
// Design du 01/11 : fond pastel de la saison sur toute la page (classe
// page-saison, voir globals.css), cadres blancs transparents.
export default async function SaisonPage() {
  const [{ profile }, saison] = await Promise.all([
    requireProfile(),
    getCurrentSeason(),
  ]);
  const mois = getBabyMonth(new Date(profile.birthdate));

  const [meta, version] = await Promise.all([
    getSaisonMeta(mois),
    getSaisonVersion(mois, saison),
  ]);
  const theme = themeDuMois(meta?.sous_titre);
  const sousTitre = theme ? `${theme} ${EN_SAISON[saison]}` : EN_SAISON[saison];

  return (
    <section className="page-saison" style={{ background: SAISON_TONS[saison].fond }}>
      <SaisonEntete saison={saison} sousTitre={sousTitre} />
      {meta && version ? (
        <SaisonView version={version} saison={saison} />
      ) : (
        <p style={{ background: CADRE_BLANC, borderRadius: 12, padding: "11px 13px", fontSize: 11, lineHeight: 1.55 }}>
          Le conseil de saison du mois {mois} n&apos;est pas encore disponible.
        </p>
      )}
    </section>
  );
}
