import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import {
  SOS_MUTED,
  SOS_TEXT,
  SosBandeau,
  SosBlocView,
  SosIcone,
  tonSlot,
  trancheSos,
} from "@/components/modules/sos-design";

// Page 2 S.O.S : tous les blocs d'une maladie, empilés comme un protocole
// Guide-moi (pas d'onglets ni de dépliage). Couleur du bloc = niveau d'urgence.

const PLAYFAIR = "var(--font-playfair), Georgia, serif";

export default async function SosThemePage({
  params,
}: {
  params: { theme: string };
}) {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));
  const tranche = trancheSos(mois);
  const index = tranche.themes.findIndex((t) => t.id === params.theme);
  if (index < 0) notFound();
  const theme = tranche.themes[index];
  const ton = tonSlot(index);

  return (
    <div style={{ display: "flex", flexDirection: "column", paddingBottom: 40 }}>
      <SosBandeau />

      <Link
        href="/sos"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          color: SOS_MUTED,
          fontSize: 11,
          textDecoration: "none",
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke={SOS_MUTED}
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M15 6l-6 6 6 6" />
        </svg>
        <span>Dois-je consulter ?</span>
      </Link>

      <div style={{ textAlign: "center", margin: "22px 0 20px" }}>
        <span
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: ton.slot,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 10px",
          }}
        >
          <SosIcone id={theme.id} color={ton.label} size={22} />
        </span>
        <h1
          style={{
            fontFamily: PLAYFAIR,
            fontWeight: 700,
            fontSize: 22,
            color: SOS_TEXT,
            letterSpacing: "-.01em",
            margin: "0 0 6px",
            lineHeight: 1.15,
          }}
        >
          {theme.nom}
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
          {tranche.label}
        </div>
      </div>

      {theme.blocs.map((b, i) => (
        <SosBlocView key={i} bloc={b} />
      ))}
    </div>
  );
}
