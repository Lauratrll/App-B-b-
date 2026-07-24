import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import {
  getIdsPublies,
  getProtocole,
  ouvertureCommune,
  varianteVisible,
  visuelUrl,
  type ReflexoZone,
} from "@/lib/reflexologie";
import {
  PLAYFAIR,
  REFLEXO_BG_ACCENT,
  REFLEXO_BG_CADRE,
  REFLEXO_BG_DOUX,
  REFLEXO_MUTED,
  REFLEXO_TEXT,
} from "@/components/modules/reflexo-design";

// Écran d'un protocole de « Réflexologie ».
// Ordre imposé par reflexologie/CONSIGNES_CLAUDE_CODE_onglet_reflexologie.md §4 :
// titre + intro → émotion → ouverture → séquence → variante (selon l'âge)
// → note de fin (toujours) → disclaimer (toujours).

export function generateStaticParams() {
  return getIdsPublies().map((id) => ({ id }));
}

export default async function ProtocoleReflexoPage({
  params,
}: {
  params: { id: string };
}) {
  const { profile } = await requireProfile();
  const moisBebe = getBabyMonth(new Date(profile.birthdate));
  const protocole = getProtocole(params.id);

  // Protocole inconnu OU reporté (lancement: false) → 404, jamais affiché.
  if (!protocole) notFound();

  const afficherVariante = varianteVisible(protocole.variante, moisBebe);
  const visuel = visuelUrl(protocole.visuel);

  return (
    <article style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Retour */}
      <Link
        href="/reflexologie"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 11,
          color: REFLEXO_MUTED,
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke={REFLEXO_MUTED}
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M15 6l-6 6 6 6" />
        </svg>
        Tous les protocoles
      </Link>

      {/* 1. Titre + intro */}
      <header>
        <h1
          style={{
            fontFamily: PLAYFAIR,
            fontWeight: 700,
            fontSize: 25,
            color: REFLEXO_TEXT,
            letterSpacing: "-.015em",
            lineHeight: 1.15,
            margin: "0 0 10px 0",
          }}
        >
          {protocole.titre}
        </h1>
        {protocole.s_applique ? (
          <p
            style={{
              fontSize: 10,
              color: REFLEXO_MUTED,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              fontWeight: 700,
              margin: "0 0 10px 0",
            }}
          >
            Pour {protocole.s_applique}
          </p>
        ) : null}
        <p
          style={{
            fontSize: 13.5,
            lineHeight: 1.6,
            color: REFLEXO_TEXT,
            margin: 0,
          }}
        >
          {protocole.intro}
        </p>
      </header>

      {/* 2. Émotion — accueille le ressenti, si présente */}
      {protocole.emotion ? (
        <p
          style={{
            background: REFLEXO_BG_ACCENT,
            borderRadius: 12,
            padding: "13px 15px",
            fontSize: 13,
            lineHeight: 1.6,
            color: REFLEXO_TEXT,
            fontStyle: "italic",
            margin: 0,
          }}
        >
          {protocole.emotion}
        </p>
      ) : null}

      {/* 3. Ouverture — installation, avant tout toucher réflexe. Source COMMUNE
          (version courte : libellé gras + phrase brève), cf. consignes §4.3. */}
      <section
        style={{
          background: REFLEXO_BG_DOUX,
          borderRadius: 14,
          padding: "15px 16px",
        }}
      >
        <h2
          style={{
            fontSize: 10,
            color: REFLEXO_MUTED,
            letterSpacing: ".13em",
            textTransform: "uppercase",
            fontWeight: 700,
            margin: "0 0 10px 0",
          }}
        >
          {ouvertureCommune.titre}
        </h2>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 7 }}>
          {ouvertureCommune.etapes.map((e, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: 9,
                fontSize: 13,
                lineHeight: 1.5,
                color: REFLEXO_TEXT,
              }}
            >
              <span
                aria-hidden
                style={{ color: REFLEXO_MUTED, marginTop: 1 }}
              >
                ·
              </span>
              <span>
                <strong style={{ fontWeight: 600 }}>{e.gras}</strong>
                {" : "}
                {e.texte}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. Carte récapitulative « Les zones réflexes, pas à pas » — image des
          pieds numérotés + bouton lecture (inerte : le lecteur animé paysage
          sera construit ensuite avec Laura, cf. consignes §4 bis). */}
      {visuel ? (
        <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <h2
              style={{
                fontFamily: PLAYFAIR,
                fontWeight: 700,
                fontSize: 17,
                color: REFLEXO_TEXT,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Les zones réflexes, pas à pas
            </h2>
            <p
              style={{
                fontSize: 9,
                color: REFLEXO_MUTED,
                letterSpacing: ".13em",
                textTransform: "uppercase",
                fontWeight: 600,
                margin: "3px 0 0 0",
              }}
            >
              Dans l&apos;ordre des étapes
            </p>
          </div>

          <div
            style={{
              position: "relative",
              borderRadius: 14,
              overflow: "hidden",
              // Fond calé sur la couleur du fond des pieds pour un rendu fondu.
              background: "#DFBEB0",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={visuel}
              alt={`Zones réflexes du protocole ${protocole.titre}, numérotées dans l'ordre des étapes`}
              style={{ display: "block", width: "100%", height: "auto" }}
            />
            {/* Bouton lecture — inerte pour l'instant (placeholder visuel). */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,.82)",
                  boxShadow: "0 2px 10px rgba(58,50,40,.22)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill={REFLEXO_TEXT}>
                  <path d="M8 5.5v13l11-6.5z" />
                </svg>
              </span>
            </span>
          </div>
          <p
            style={{
              fontSize: 10.5,
              color: REFLEXO_MUTED,
              fontStyle: "italic",
              textAlign: "center",
              margin: 0,
            }}
          >
            Lecture animée — bientôt disponible
          </p>
        </section>
      ) : null}

      {/* 5. Séquence — une étape = un libellé parent, une intention, ses zones */}
      <section style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        <h2
          style={{
            fontSize: 10,
            color: REFLEXO_MUTED,
            letterSpacing: ".13em",
            textTransform: "uppercase",
            fontWeight: 700,
            margin: 0,
          }}
        >
          Le geste, pas à pas
        </h2>

        {protocole.sequence.map((etape) => (
          <div
            key={etape.ordre}
            style={{
              border: "1px solid rgba(58,50,40,.10)",
              borderRadius: 13,
              padding: "13px 15px",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 9 }}>
              <span
                aria-hidden
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: REFLEXO_MUTED,
                  letterSpacing: ".08em",
                }}
              >
                {String(etape.ordre).padStart(2, "0")}
              </span>
              <h3
                style={{
                  flex: 1,
                  fontFamily: PLAYFAIR,
                  fontWeight: 600,
                  fontSize: 16,
                  color: REFLEXO_TEXT,
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                {etape.designation}
              </h3>
            </div>

            <p
              style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: REFLEXO_TEXT,
                margin: "8px 0 0 0",
              }}
            >
              {etape.intention}
            </p>

            {etape.note ? (
              <p
                style={{
                  fontSize: 12,
                  lineHeight: 1.55,
                  color: REFLEXO_TEXT,
                  opacity: 0.8,
                  fontStyle: "italic",
                  margin: "7px 0 0 0",
                }}
              >
                {etape.note}
              </p>
            ) : null}

            {/* Étape hors pied : pas d'animation, juste le texte. */}
            {etape.hors_pied ? (
              <p
                style={{
                  fontSize: 10,
                  color: REFLEXO_MUTED,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  margin: "9px 0 0 0",
                }}
              >
                Hors du pied
              </p>
            ) : (
              <ZonesEtape
                zones={etape.zones ?? []}
                enchainees={etape.gestes_enchaines === true}
              />
            )}
          </div>
        ))}
      </section>

      {/* 5. Variante — seulement si l'âge de bébé la rend pertinente */}
      {protocole.variante && afficherVariante ? (
        <section
          style={{
            background: REFLEXO_BG_ACCENT,
            borderRadius: 13,
            padding: "14px 15px",
          }}
        >
          <h2
            style={{
              fontSize: 10,
              color: REFLEXO_MUTED,
              letterSpacing: ".13em",
              textTransform: "uppercase",
              fontWeight: 700,
              margin: "0 0 7px 0",
            }}
          >
            {protocole.variante.condition}
          </h2>
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: REFLEXO_TEXT,
              margin: 0,
            }}
          >
            {protocole.variante.texte}
          </p>
          {protocole.variante.ajout && protocole.variante.ajout.length > 0 ? (
            <ZonesEtape zones={protocole.variante.ajout} enchainees={false} />
          ) : null}
        </section>
      ) : null}

      {/* Vigilance — ligne de sécurité mise en avant, si présente */}
      {protocole.vigilance ? (
        <p
          style={{
            background: REFLEXO_BG_CADRE,
            borderRadius: 12,
            padding: "12px 14px",
            fontSize: 12.5,
            lineHeight: 1.55,
            color: REFLEXO_TEXT,
            fontWeight: 500,
            margin: 0,
          }}
        >
          <span
            aria-hidden
            style={{ marginRight: 7 }}
          >
            ⚠️
          </span>
          {protocole.vigilance}
        </p>
      ) : null}

      {/* 6. Note de fin — consentement + sortie en douceur, toujours affichée */}
      <p
        style={{
          background: REFLEXO_BG_DOUX,
          borderRadius: 12,
          padding: "13px 15px",
          fontSize: 13,
          lineHeight: 1.6,
          color: REFLEXO_TEXT,
          margin: 0,
        }}
      >
        {protocole.note_fin}
      </p>

      {/* 7. Disclaimer — toujours affiché */}
      <p
        style={{
          background: REFLEXO_BG_CADRE,
          borderRadius: 11,
          padding: "11px 13px",
          fontSize: 11,
          lineHeight: 1.5,
          color: REFLEXO_TEXT,
          opacity: 0.9,
          fontStyle: "italic",
          margin: 0,
        }}
      >
        {protocole.disclaimer}
      </p>
    </article>
  );
}

/**
 * Les zones d'une étape. En attendant les animations (prototypes
 * mouvement-*.html), on affiche le libellé de la zone et son mouvement.
 * `enchainees` = deux zones jouées l'une après l'autre.
 */
function ZonesEtape({
  zones,
  enchainees,
}: {
  zones: ReflexoZone[];
  enchainees: boolean;
}) {
  if (zones.length === 0) return null;
  return (
    <ul
      style={{
        listStyle: "none",
        margin: "11px 0 0 0",
        padding: 0,
        display: "grid",
        gap: 7,
      }}
    >
      {zones.map((z, i) => (
        <li
          key={`${z.zone}-${i}`}
          style={{
            background: REFLEXO_BG_DOUX,
            borderRadius: 10,
            padding: "9px 11px",
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: REFLEXO_TEXT,
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {/* Deux zones enchaînées : on indique l'ordre au parent. */}
            {enchainees && zones.length > 1 ? `${i + 1}. ` : null}
            {z.designation}
          </p>
          <p
            style={{
              fontSize: 12,
              lineHeight: 1.5,
              color: REFLEXO_TEXT,
              opacity: 0.82,
              margin: "2px 0 0 0",
            }}
          >
            {z.description_mouvement}
          </p>
        </li>
      ))}
    </ul>
  );
}
