import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import {
  SOS_MUTED,
  SOS_SANGUINE,
  SOS_TEXT,
  SosAccueil,
  SosBandeau,
  SosIcone,
  SosSource,
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
    <div style={{ display: "flex", flexDirection: "column" }}>
      <SosBandeau complet />

      <SosAccueil />

      <div style={{ textAlign: "center", padding: "4px 0 20px" }}>
        <div
          style={{
            fontSize: 10,
            color: SOS_SANGUINE.label,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            fontWeight: 700,
            margin: "0 0 6px",
          }}
        >
          S.O.S
        </div>
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
          Repères officiels · {tranche.label}
        </div>
      </div>

      {tranche.intro ? (
        <div style={{ margin: "0 0 14px" }}>
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
          <SosSource>{tranche.intro.source}</SosSource>
        </div>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "max-content",
          justifyContent: "center",
          gap: 10,
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
                padding: "11px 14px",
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
    </div>
  );
}
