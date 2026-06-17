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
  // Tourbillon : spirale enroulée (~3,5 tours) terminée par une virgule au centre.
  4: (
    <path d="M12 12.55 A0.62 0.62 0 1 1 12.95 12 A1.4 1.4 0 0 1 10.2 12 A2.2 2.2 0 0 0 14.6 12 A3 3 0 0 1 8.6 12 A3.8 3.8 0 0 0 16.2 12 A4.6 4.6 0 0 1 7 12 A5.4 5.4 0 0 0 17.8 12" />
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
