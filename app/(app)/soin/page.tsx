import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getSoinConseils, getSoinMeta } from "@/lib/content";
import {
  PLAYFAIR,
  INK,
  EUCAL,
  PEACH_DARK,
  WARM_BODY,
  CERCLE,
  COULEUR_SLOT,
  TITRE_COURT,
  formatTitre,
  SoinPicto,
} from "@/components/modules/soin-design";

// Écran A — accueil « Prendre soin de moi ».
// Spec de référence (figée V1) :
//   skills/CONSIGNES_CLAUDE_CODE_prendre_soin_de_moi.md §5
// Adaptations à l'app : données lues depuis Supabase (pas de JSON local) ;
// le bandeau (TopBar) et la nav du bas sont fournis par le layout (comme la
// page 1 de Guide-moi), donc non re-rendus ici.
// Intro affichée EN ENTIER (décision fondatrice ; les textes seront raccourcis
// éditorialement). Pictos fleur (3) + tourbillon (4) — cf. soin-design.

export default async function SoinPage() {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));
  const meta = await getSoinMeta(mois);
  const conseils = await getSoinConseils(mois);

  if (conseils.length === 0) {
    return (
      <section className="space-y-5">
        <header className="space-y-1">
          <p className="text-2xl" aria-hidden>🌸</p>
          <h1 className="text-2xl font-semibold">Prends soin de toi</h1>
        </header>
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          Les conseils du mois {mois} ne sont pas encore disponibles.
          Mois disponibles : 0, 1, 2, 3, 6, 9 et 14.
        </p>
      </section>
    );
  }

  // Hiérarchie VALIDÉE :
  //   grand titre = promesse_du_mois · label = nom_rubrique · intro = intention_du_mois
  const grandTitre =
    meta?.promesse_du_mois ?? meta?.theme_du_mois ?? meta?.titre_rubrique ?? "Prendre soin de moi";
  const label = meta?.nom_rubrique ?? "Prendre soin de moi";
  const intro = meta?.intention_du_mois ?? meta?.description ?? "";

  // Tri stable par numero (l'id change chaque mois) ; repli sur l'ordre.
  const items = [...conseils].sort(
    (a, b) => (a.numero ?? a.ordre) - (b.numero ?? b.ordre),
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* §5 — En-tête éditorial : grand titre, label dessous, trait, intro */}
      <h1
        style={{
          fontFamily: PLAYFAIR,
          fontWeight: 700,
          fontSize: 24,
          lineHeight: 1.13,
          color: INK,
          textAlign: "center",
          textWrap: "balance",
          margin: "0 0 6px",
        }}
      >
        {formatTitre(grandTitre)}
      </h1>
      <div
        style={{
          textAlign: "center",
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: ".16em",
          textTransform: "uppercase",
          color: EUCAL,
          marginBottom: 9,
        }}
      >
        {label}
      </div>
      <div
        style={{ width: 34, height: 1, background: PEACH_DARK, opacity: 0.55, margin: "0 auto 11px" }}
      />
      {intro ? (
        <p
          style={{
            fontSize: 12,
            lineHeight: 1.5,
            color: WARM_BODY,
            textAlign: "center",
            margin: "0 auto 14px",
            maxWidth: 320,
          }}
        >
          {intro}
        </p>
      ) : null}

      {/* §5 — 5 cases, 82 % centrées, sans bordure */}
      <div
        style={{ display: "flex", flexDirection: "column", gap: 8, width: "82%", margin: "0 auto" }}
      >
        {items.map((c, i) => {
          const numero = c.numero ?? i + 1;
          const fond = COULEUR_SLOT[numero] ?? "#EEC7B0";
          const cercle = CERCLE[numero] ?? 0.5;
          const titre = TITRE_COURT[numero] ?? c.nom_outil ?? c.titre ?? "";
          const promesse = c.promesse ?? c.sous_titre;
          return (
            <Link
              key={c.id}
              href={`/soin/${c.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 13,
                borderRadius: 11,
                padding: "9px 12px",
                background: fond,
                textDecoration: "none",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `rgba(255,255,255,${cercle})`,
                }}
              >
                {COULEUR_SLOT[numero] ? (
                  <SoinPicto numero={numero} size={21} color={INK} strokeWidth={1.6} />
                ) : (
                  <span style={{ fontSize: 19, lineHeight: 1 }}>{c.icone ?? "•"}</span>
                )}
              </span>
              <span style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                <span
                  style={{
                    fontFamily: PLAYFAIR,
                    fontWeight: 600,
                    fontSize: 14,
                    color: INK,
                    lineHeight: 1.18,
                  }}
                >
                  {titre}
                </span>
                {promesse ? (
                  <span
                    style={{
                      fontSize: 11.5,
                      fontStyle: "italic",
                      lineHeight: 1.3,
                      marginTop: 2,
                      color: INK,
                    }}
                  >
                    {promesse}
                  </span>
                ) : null}
              </span>
              <span style={{ flexShrink: 0, display: "flex", color: INK, opacity: 0.85 }}>
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
