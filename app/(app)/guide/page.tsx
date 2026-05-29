import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import { getGuideMeta } from "@/lib/content";
import {
  CategoryIcon,
  GUIDE_MUTED,
  GUIDE_TEXT,
  slotFor,
} from "@/components/modules/guide-design";

// Page 1 « Guide-moi ! » — grille des catégories du mois.
// Design : skills/CONSIGNES_CLAUDE_CODE_guide_moi_page1.md (V10), adapté au
// chrome existant (header + nav du layout) et aux catégories variables par mois.

const PLAYFAIR = "var(--font-playfair), Georgia, serif";

export default async function GuidePage() {
  const { profile } = await requireProfile();
  const mois = getBabyMonth(new Date(profile.birthdate));
  const meta = await getGuideMeta(mois);

  if (!meta || !meta.categories || meta.categories.length === 0) {
    return (
      <section className="space-y-5">
        <header className="space-y-1">
          <p className="text-2xl" aria-hidden>
            🧭
          </p>
          <h1 className="text-2xl font-semibold">Guide-moi !</h1>
          <p className="text-sm text-neutral-600">
            {profile.baby_name} a {mois} mois.
          </p>
        </header>
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          Les protocoles du mois {mois} ne sont pas encore disponibles.
        </p>
      </section>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Titre éditorial centré */}
      <div style={{ padding: "8px 0 22px", textAlign: "center" }}>
        <h1
          style={{
            fontFamily: PLAYFAIR,
            fontWeight: 700,
            fontSize: 26,
            color: GUIDE_TEXT,
            letterSpacing: "-.015em",
            margin: "0 0 8px 0",
            lineHeight: 1.1,
          }}
        >
          {meta.titre_rubrique ?? "Guide-moi !"}
        </h1>
        <div
          style={{
            fontSize: 9,
            color: GUIDE_MUTED,
            letterSpacing: ".07em",
            textTransform: "uppercase",
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          Mais n&apos;oublie jamais que chaque bébé est unique.
        </div>
      </div>

      {/* Cases catégories — 75 % de largeur, centrées */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          alignItems: "center",
        }}
      >
        {meta.categories.map((cat, i) => {
          const slot = slotFor(i);
          return (
            <Link
              key={cat.id}
              href={`/guide/${cat.id}`}
              style={{
                background: slot.bg,
                borderRadius: 11,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                width: "75%",
                textDecoration: "none",
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: slot.avatarBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <CategoryIcon
                  categoryKey={cat.id}
                  color={GUIDE_TEXT}
                  size={17}
                  emoji={cat.icone}
                />
              </span>
              <span
                style={{
                  flex: 1,
                  fontFamily: PLAYFAIR,
                  fontWeight: 600,
                  fontSize: 15,
                  color: GUIDE_TEXT,
                  letterSpacing: "-.01em",
                }}
              >
                {cat.nom}
              </span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke={GUIDE_TEXT}
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

      {/* Mention préventive */}
      <div
        style={{
          padding: "26px 4px 8px",
          fontSize: 9,
          color: GUIDE_MUTED,
          lineHeight: 1.4,
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        En cas de doute médical, contacte le 15 ou ton pédiatre.
      </div>
    </div>
  );
}
