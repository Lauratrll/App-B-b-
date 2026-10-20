import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import {
  SOS,
  SOS_MUTED,
  SOS_SANGUINE,
  SOS_TEXT,
  SosAccueil,
  SosBandeau,
  SosIcone,
  tonSlot,
  trancheSos,
} from "@/components/modules/sos-design";

// Page 1 « S.O.S — Dois-je consulter ? » : un slot par maladie, comme la
// page 1 de Guide-moi. Tranche choisie selon l'âge : avant 3 mois (M0-M2) ou
// à partir de 3 mois (M3+). Vouvoiement, contenu officiel cité mot pour mot.

const PLAYFAIR = "var(--font-playfair), Georgia, serif";

export default async function SosPage() {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));
  const tranche = trancheSos(mois);

  return (
    // Contenu centré verticalement entre l'en-tête et la barre du bas, même
    // marge en haut et en bas (choix Laura, 19/10). 157 px = en-tête 45 +
    // barre du bas 56 + marges du <main> 56 (app/(app)/layout.tsx, 20/10).
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "calc(100dvh - 157px)",
        // Le <main> a 24 px en haut et 32 px en bas, dont 18 couverts par les
        // boutons ronds de la barre : 10 px ici égalisent.
        paddingBottom: 10,
      }}
    >
      <div style={{ textAlign: "center", padding: "0 0 14px" }}>
        <h1
          style={{
            fontFamily: PLAYFAIR,
            fontWeight: 700,
            fontSize: 26,
            color: SOS_TEXT,
            letterSpacing: "-.015em",
            margin: "0 0 8px",
            lineHeight: 1.1,
          }}
        >
          Dois-je consulter ?
        </h1>
        <div
          style={{
            fontSize: 9,
            color: SOS_MUTED,
            letterSpacing: ".07em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {[SOS.accueil?.origine, tranche.label].filter(Boolean).join(" · ")}
        </div>
      </div>

      {tranche.intro ? (
        <div style={{ margin: "0 0 10px" }}>
          <div
            style={{
              background: SOS_SANGUINE.bg,
              borderLeft: `3px solid ${SOS_SANGUINE.accent}`,
              borderRadius: "0 12px 12px 0",
              padding: "11px 13px",
              marginBottom: 8,
              fontSize: 11,
              lineHeight: 1.55,
              fontWeight: 600,
              color: SOS_SANGUINE.label,
            }}
          >
            {tranche.intro.texte}
          </div>
        </div>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "max-content",
          justifyContent: "center",
          gap: 8,
          maxWidth: "100%",
        }}
      >
        {tranche.themes.map((t, i) => {
          const ton = tonSlot(i);
          return (
            <Link
              key={t.id}
              href={`/sos/${t.id}`}
              style={{
                background: ton.slot,
                borderRadius: 11,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "9px 14px",
                width: "100%",
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: ton.pastille,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <SosIcone id={t.id} color={ton.label} />
              </span>
              <span
                style={{
                  flex: 1,
                  fontFamily: PLAYFAIR,
                  fontWeight: 600,
                  fontSize: 15,
                  color: SOS_TEXT,
                  letterSpacing: "-.01em",
                  whiteSpace: "nowrap",
                }}
              >
                {t.nom}
              </span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke={SOS_TEXT}
                strokeWidth="1.7"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Link>
          );
        })}
      </div>

      {/* Numéros d'urgence sous les slots (choix Laura, 19/10) */}
      <div style={{ marginTop: 40 }}>
        <SosBandeau complet />
      </div>

      {/* Phrase de protection, en bas comme sur Guide-moi */}
      <SosAccueil />
    </div>
  );
}
