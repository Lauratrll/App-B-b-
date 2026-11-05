import { cookies } from "next/headers";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { COOKIE_ONGLET, ONGLET_PAR_DEFAUT, getGestesDuMois, getOnglets } from "@/lib/apaisement";
import { ApaisementOnglets } from "@/components/modules/apaisement-onglets";
import { APAISEMENT, PLAYFAIR } from "@/components/modules/apaisement-design";

// Gestes d'apaisement — boîte à outils (case de l'accueil, 20/10/2026).
// Consignes : docs/apaisement notes/BRIEF_Claude_Code_gestes_apaisement.md.
// Seuls les gestes du mois de bébé sont listés (mois_debut ≤ mois ≤ mois_fin).

export default async function ApaisementPage() {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));
  const gestes = getGestesDuMois(mois);
  const onglets = getOnglets(mois);

  // Dernier onglet consulté ; « Tous » la première fois, ou s'il est masqué ce mois-ci.
  const memorise = cookies().get(COOKIE_ONGLET)?.value;
  const ongletInitial =
    memorise && onglets.some((o) => o.id === memorise) ? memorise : ONGLET_PAR_DEFAUT;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "0 8px" }}>
      <header style={{ textAlign: "center", padding: "4px 0 2px" }}>
        <h1
          style={{
            fontFamily: PLAYFAIR,
            fontWeight: 700,
            fontSize: 26,
            color: APAISEMENT.texte,
            letterSpacing: "-.015em",
            lineHeight: 1.1,
            margin: "0 0 8px 0",
          }}
        >
          Gestes d&apos;apaisement
        </h1>
        <p
          style={{
            fontSize: 9,
            color: APAISEMENT.muted,
            letterSpacing: ".15em",
            textTransform: "uppercase",
            fontWeight: 600,
            margin: 0,
          }}
        >
          Boîte à outils
        </p>
      </header>

      {gestes.length === 0 ? (
        <p style={{ fontSize: 13, color: APAISEMENT.muted, fontStyle: "italic", textAlign: "center" }}>
          Aucun geste n&apos;est encore publié pour cet âge.
        </p>
      ) : (
        <ApaisementOnglets
          onglets={onglets}
          gestes={gestes}
          ongletInitial={ongletInitial}
          cookie={COOKIE_ONGLET}
        />
      )}
    </div>
  );
}
