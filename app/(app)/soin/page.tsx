import Link from "next/link";
import type { ReactNode } from "react";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getSoinConseils, getSoinMeta } from "@/lib/content";

// Page 1 « Prendre soin de moi » — accueil de la rubrique.
// Spec de référence (figée V1) :
//   skills/CONSIGNES_CLAUDE_CODE_prendre_soin_de_moi_page1.md
// Adaptations à l'app : données lues depuis Supabase (pas de JSON local) ;
// le bandeau (TopBar) et la nav du bas sont fournis par le layout (comme la
// page 1 de Guide-moi), donc non re-rendus ici.

const PLAYFAIR = "var(--font-playfair), 'Playfair Display', Georgia, serif";
const INK = "#3A3228";
const EUCAL = "#8A9E98";
const PEACH_DARK = "#C8806A";
const INTRO = "#5A4A40";

// §4 — fonds des 5 cases, gamme alim/sommeil alternée, FIXE par numero.
const FOND_CASE: Record<number, string> = {
  1: "#EABDB1",
  2: "#F8DBC9",
  3: "#E7B99F",
  4: "#F5D0C8",
  5: "#EEC7B0",
};
const CERCLE: Record<number, number> = { 1: 0.48, 2: 0.55, 3: 0.48, 4: 0.55, 5: 0.48 };

// §5.4 — titres courts (1 ligne) par numero ; le nom_outil reste canonique.
const TITRE_CASE: Record<number, string> = {
  1: "Auto-massage",
  2: "Méditation audio",
  3: "Auto-reconnaissance",
  4: "Réalité du post-partum",
  5: "Challenge couple",
};

// §5.5 — pictos au trait (stroke #3A3228), stables par numero.
const PICTO_CASE: Record<number, ReactNode> = {
  1: (
    <>
      <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M11 11V4.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M14 11V5.5a1.5 1.5 0 0 1 3 0V12" />
      <path d="M17 12V8a1.5 1.5 0 0 1 3 0v6a6 6 0 0 1-6 6h-2.5a5 5 0 0 1-3.9-1.9L4 13.5a1.6 1.6 0 0 1 2.5-2L8 13.5" />
    </>
  ),
  2: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="13" width="4" height="7" rx="2" />
      <rect x="17" y="13" width="4" height="7" rx="2" />
    </>
  ),
  // Fleur vue du dessus : cœur central + 6 pétales.
  3: (
    <>
      <circle cx="12" cy="12" r="2" />
      <ellipse cx="12" cy="6.8" rx="1.8" ry="2.8" transform="rotate(0 12 12)" />
      <ellipse cx="12" cy="6.8" rx="1.8" ry="2.8" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="6.8" rx="1.8" ry="2.8" transform="rotate(120 12 12)" />
      <ellipse cx="12" cy="6.8" rx="1.8" ry="2.8" transform="rotate(180 12 12)" />
      <ellipse cx="12" cy="6.8" rx="1.8" ry="2.8" transform="rotate(240 12 12)" />
      <ellipse cx="12" cy="6.8" rx="1.8" ry="2.8" transform="rotate(300 12 12)" />
    </>
  ),
  // Tourbillon : spirale d'Archimède ronde (~2,75 tours), queue à droite,
  // virgule au centre — d'après le modèle fourni.
  4: (
    <path d="M21 12 L20.81 13.4 L20.41 14.73 L19.81 15.98 L19.03 17.11 L18.09 18.09 L17.02 18.91 L15.84 19.54 L14.59 19.98 L13.3 20.21 L12 20.23 L10.72 20.05 L9.5 19.68 L8.37 19.13 L7.34 18.41 L6.45 17.55 L5.71 16.57 L5.14 15.49 L4.76 14.35 L4.55 13.18 L4.54 12 L4.7 10.84 L5.05 9.74 L5.56 8.72 L6.21 7.79 L6.99 6.99 L7.88 6.33 L8.86 5.83 L9.88 5.49 L10.94 5.31 L12 5.3 L13.04 5.46 L14.02 5.78 L14.94 6.24 L15.75 6.83 L16.46 7.54 L17.04 8.34 L17.49 9.2 L17.78 10.12 L17.93 11.06 L17.93 12 L17.78 12.92 L17.49 13.78 L17.08 14.59 L16.55 15.3 L15.92 15.92 L15.21 16.42 L14.45 16.8 L13.64 17.05 L12.82 17.17 L12 17.16 L11.2 17.02 L10.45 16.76 L9.76 16.39 L9.15 15.93 L8.62 15.38 L8.2 14.76 L7.88 14.1 L7.68 13.4 L7.59 12.7 L7.61 12 L7.74 11.33 L7.97 10.69 L8.29 10.11 L8.7 9.6 L9.17 9.17 L9.69 8.82 L10.25 8.57 L10.83 8.41 L11.42 8.35 L12 8.38 L12.55 8.5 L13.07 8.7 L13.54 8.98 L13.95 9.32 L14.29 9.71 L14.56 10.14 L14.75 10.6 L14.86 11.07 L14.9 11.54 L14.85 12 L14.74 12.43 L14.57 12.83 L14.34 13.19 L14.06 13.5 L13.75 13.75 L13.41 13.94 L13.05 14.06 L12.69 14.13 L12.34 14.14 L12 14.09 L11.69 13.98 L11.4 13.84 L11.16 13.65 L10.95 13.44 L10.8 13.2 L10.68 12.96 L10.62 12.7 L10.6 12.45 L10.62 12.22 L10.68 12 L10.77 11.81 L10.89 11.64 L11.03 11.51 L11.18 11.41 L11.34 11.34 L11.5 11.31 L11.65 11.3 L11.78 11.33 L11.9 11.38 L12 11.45" />
  ),
  // Deux cœurs : un grand devant, un plus petit en retrait.
  5: (
    <>
      <path d="M9.5 19C9.5 19 4 15.4 4 10.9 4 8.9 5.5 7.4 7.3 7.4 8.4 7.4 9.1 8.1 9.5 8.7 9.9 8.1 10.6 7.4 11.7 7.4 13.5 7.4 15 8.9 15 10.9 15 15.4 9.5 19 9.5 19Z" />
      <path d="M16.5 15C16.5 15 12.5 12.3 12.5 9 12.5 7.6 13.5 6.6 14.8 6.6 15.5 6.6 16.1 7 16.5 7.5 16.9 7 17.5 6.6 18.2 6.6 19.5 6.6 20.5 7.6 20.5 9 20.5 12.3 16.5 15 16.5 15Z" />
    </>
  ),
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
      {/* §5.2 — En-tête éditorial : grand titre, label dessous, trait, intro */}
      <h1
        style={{
          fontFamily: PLAYFAIR,
          fontWeight: 700,
          fontSize: 24,
          lineHeight: 1.13,
          color: INK,
          textAlign: "center",
          margin: "0 0 6px",
        }}
      >
        {grandTitre}
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
        // Intro affichée EN ENTIER (consigne fondatrice) ; resserrée pour
        // limiter le scroll sur les mois à intro longue.
        <p
          style={{
            fontSize: 12,
            lineHeight: 1.5,
            color: INTRO,
            textAlign: "center",
            margin: "0 auto 14px",
            maxWidth: 320,
          }}
        >
          {intro}
        </p>
      ) : null}

      {/* §5.3 — 5 cases, 82 % centrées, sans bordure */}
      <div
        style={{ display: "flex", flexDirection: "column", gap: 8, width: "82%", margin: "0 auto" }}
      >
        {items.map((c, i) => {
          const numero = c.numero ?? i + 1;
          const fond = FOND_CASE[numero] ?? "#EEC7B0";
          const cercle = CERCLE[numero] ?? 0.5;
          const titre = TITRE_CASE[numero] ?? c.nom_outil ?? c.titre ?? "";
          const promesse = c.promesse ?? c.sous_titre;
          const picto = PICTO_CASE[numero];
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
                {picto ? (
                  <svg
                    width={21}
                    height={21}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={INK}
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {picto}
                  </svg>
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
