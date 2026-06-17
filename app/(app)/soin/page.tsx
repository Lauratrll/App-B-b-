import Link from "next/link";
import type { CSSProperties } from "react";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getSoinConseils, getSoinMeta } from "@/lib/content";

// Page 1 « Prends soin de toi » — grille des gestes du mois.
// Reprend les codes Guide-moi / Coucher (serif Playfair, texte #3A3228,
// pastilles d'icône, coins arrondis) mais avec une palette restreinte aux
// tons chauds et féminins (corail / rose / pêche / terracotta), pour parler
// du soin de la maman. Objectif : titre + intro + 6 cartes visibles sur un
// écran, sans défiler (grille 2 colonnes compacte).

const PLAYFAIR = "var(--font-playfair), Georgia, serif";
const TEXT = "#3A3228"; // texte principal (cohérent Guide/Coucher)
const CHAPO = "#8A5B4E"; // chapô des cartes (brun chaud adouci)
const LABEL = "#A98C86"; // étiquette de rubrique (taupe rosé)

// Camaïeu chaud & féminin par position (pas toute la gamme chromatique).
const SOIN_TONES = [
  "#F2BCB0", // corail tendre
  "#F4C0CC", // rose poudré
  "#F7D0C4", // pêche
  "#EFC6C9", // rose ancien
  "#ECC1B2", // terracotta clair
  "#F5CFD0", // rose lait
];

const clamp2: CSSProperties = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

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

  // Hiérarchie établie :
  //   en-tête → nom_rubrique (label) · promesse_du_mois (grand) · description (intro)
  //   carte   → icone · nom_outil (grand) · promesse (chapô)
  const titrePrincipal =
    meta?.promesse_du_mois ?? meta?.titre_rubrique ?? "Prends soin de toi";
  const etiquetteRubrique = meta?.nom_rubrique ?? meta?.sous_titre;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* En-tête éditorial centré */}
      <div style={{ padding: "4px 0 12px", textAlign: "center" }}>
        <p aria-hidden style={{ fontSize: 18, lineHeight: 1, margin: "0 0 6px" }}>
          🌸
        </p>
        {etiquetteRubrique ? (
          <div
            style={{
              fontSize: 11,
              color: LABEL,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {etiquetteRubrique}
          </div>
        ) : null}
        <h1
          style={{
            fontFamily: PLAYFAIR,
            fontWeight: 700,
            fontSize: 22,
            color: TEXT,
            letterSpacing: "-.015em",
            lineHeight: 1.15,
            margin: "5px auto 0",
            maxWidth: 320,
          }}
        >
          {titrePrincipal}
        </h1>
      </div>

      {/* Intro courte — 2 lignes max pour garder la vue d'ensemble */}
      {meta?.description ? (
        <p
          style={{
            ...clamp2,
            fontSize: 12.5,
            lineHeight: 1.5,
            color: CHAPO,
            textAlign: "center",
            margin: "0 2px 16px",
          }}
        >
          {meta.description}
        </p>
      ) : null}

      {/* Grille 2 colonnes — tons chauds par position */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 9,
        }}
      >
        {conseils.map((c, i) => {
          const principal = c.nom_outil ?? c.titre;
          const chapo = c.promesse ?? c.sous_titre;
          const tone = SOIN_TONES[i % SOIN_TONES.length];
          return (
            <Link
              key={c.id}
              href={`/soin/${c.id}`}
              style={{
                background: tone,
                borderRadius: 14,
                padding: "11px 11px 12px",
                textDecoration: "none",
                display: "block",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,.55)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 17,
                  lineHeight: 1,
                  marginBottom: 7,
                }}
              >
                {c.icone ?? "•"}
              </span>
              <span
                style={{
                  display: "block",
                  fontFamily: PLAYFAIR,
                  fontWeight: 600,
                  fontSize: 13,
                  lineHeight: 1.15,
                  color: TEXT,
                  letterSpacing: "-.01em",
                }}
              >
                {principal}
              </span>
              {chapo ? (
                <span
                  style={{
                    ...clamp2,
                    fontSize: 10.5,
                    lineHeight: 1.3,
                    color: CHAPO,
                    marginTop: 3,
                  }}
                >
                  {chapo}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
