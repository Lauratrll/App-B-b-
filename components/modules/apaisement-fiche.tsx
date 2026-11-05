import type { Geste } from "@/lib/apaisement";
import {
  AFFICHER_MENTION_DESCRIPTION,
  MENTION_DESCRIPTION,
  PLACEHOLDER_VISUEL,
} from "@/lib/apaisement";
import { ApaisementIcone, familleDuPicto } from "./apaisement-icone";
import { APAISEMENT, CADRE_SECURITE, PLAYFAIR, styleIntitule, texteRiche } from "./apaisement-design";

// Fiche d'un geste d'apaisement. Ordre imposé par le brief (§4.4) :
// titre → objectif (sans libellé) → visuel → Gestes pas à pas → Cadre de
// sécurité (si présent) → Pourquoi ça fonctionne → Sources (si présentes).

export function GesteFiche({ geste }: { geste: Geste }) {
  const pas = geste.pas_a_pas;
  // Une seule étape (ou aucune) : pas de liste, du texte simple (brief §4.4).
  const etapesEnListe = pas && pas.etapes.length > 1;
  const texteSimple = pas
    ? [...pas.intro, ...(etapesEnListe ? [] : pas.etapes)]
    : [];

  return (
    <article style={{ display: "flex", flexDirection: "column", gap: 18, padding: "0 4px" }}>
      {/* 1-2. Titre + objectif en sous-titre, sans libellé */}
      <header style={{ textAlign: "center", margin: "10px 0 0" }}>
        <span
          aria-hidden
          style={{
            width: 46,
            height: 46,
            margin: "0 auto 12px",
            borderRadius: "50%",
            background: APAISEMENT.bg,
            color: APAISEMENT.profond,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ApaisementIcone famille={familleDuPicto(geste)} taille={24} />
        </span>
        <h1
          style={{
            fontFamily: PLAYFAIR,
            fontWeight: 700,
            fontSize: 26,
            color: APAISEMENT.texte,
            letterSpacing: "-.015em",
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          {geste.titre}
        </h1>
        {geste.objectif ? (
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.55,
              color: APAISEMENT.texte,
              opacity: 0.85,
              fontStyle: "italic",
              margin: "10px auto 0",
              maxWidth: 320,
            }}
          >
            {texteRiche(geste.objectif)}
          </p>
        ) : null}
      </header>

      {/* 3. Visuel : en attendant les vidéos et images */}
      {geste.visuel_attendu ? <VisuelAVenir format={geste.format_prevu} /> : null}

      {/* 4. Gestes pas à pas */}
      {pas ? (
        <section style={{ background: APAISEMENT.doux, borderRadius: 14, padding: "15px 16px" }}>
          <h2 style={styleIntitule(APAISEMENT.profond)}>Gestes pas à pas</h2>

          {texteSimple.map((t, i) => (
            <p key={`i${i}`} style={{ ...corps, margin: i === 0 ? 0 : "8px 0 0" }}>
              {texteRiche(t)}
            </p>
          ))}

          {etapesEnListe ? (
            <ol
              style={{
                listStyle: "none",
                margin: texteSimple.length ? "12px 0 0" : 0,
                padding: 0,
                display: "grid",
                gap: 9,
              }}
            >
              {pas.etapes.map((e, i) => (
                <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  {/* Pastille calée sur la PREMIÈRE ligne : 20 px de haut pour
                      une ligne de 13,5 × 1.55 ≈ 21 px, d'où le léger décalage. */}
                  <span
                    aria-hidden
                    style={{
                      flexShrink: 0,
                      width: 20,
                      height: 20,
                      marginTop: 1,
                      borderRadius: "50%",
                      background: APAISEMENT.profond,
                      color: "#FFFFFF",
                      fontSize: 10.5,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ ...corps, flex: 1, minWidth: 0 }}>{texteRiche(e)}</span>
                </li>
              ))}
            </ol>
          ) : null}

          {pas.suite.map((t, i) => (
            <p key={`s${i}`} style={{ ...corps, margin: "12px 0 0" }}>
              {texteRiche(t)}
            </p>
          ))}

          {AFFICHER_MENTION_DESCRIPTION ? (
            <p
              style={{
                fontSize: 11,
                color: APAISEMENT.profond,
                fontStyle: "italic",
                opacity: 0.8,
                margin: "14px 0 0",
              }}
            >
              {MENTION_DESCRIPTION}
            </p>
          ) : null}
        </section>
      ) : null}

      {/* 5. Cadre de sécurité : seulement s'il existe, jamais de bloc vide */}
      {geste.cadre_securite && geste.cadre_securite.length > 0 ? (
        <section
          style={{
            background: CADRE_SECURITE.bg,
            border: `1px solid ${CADRE_SECURITE.bord}`,
            borderRadius: 10,
            padding: "13px 15px",
          }}
        >
          <h2 style={styleIntitule(CADRE_SECURITE.label)}>Cadre de sécurité</h2>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 7 }}>
            {geste.cadre_securite.map((c, i) => (
              <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    width: 5,
                    height: 5,
                    marginTop: 8,
                    borderRadius: "50%",
                    background: CADRE_SECURITE.bord,
                  }}
                />
                <span style={{ fontSize: 13, lineHeight: 1.55, color: CADRE_SECURITE.texte }}>
                  {texteRiche(c)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* 6. Pourquoi ça fonctionne */}
      {geste.pourquoi ? (
        <section
          style={{
            background: "rgba(255,255,255,.55)",
            border: "1px solid rgba(0,0,0,.05)",
            borderRadius: 14,
            padding: "15px 16px",
          }}
        >
          <h2 style={styleIntitule(APAISEMENT.profond)}>Pourquoi ça fonctionne</h2>
          <p style={{ ...corps, margin: 0 }}>{texteRiche(geste.pourquoi)}</p>
        </section>
      ) : null}

      {/* 7. Sources : discrètes, posées sur le fond */}
      {geste.sources.length > 0 ? (
        <section style={{ padding: "0 4px" }}>
          <h2 style={{ ...styleIntitule(APAISEMENT.muted), fontSize: 9, margin: "0 0 5px" }}>
            Sources
          </h2>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 3 }}>
            {geste.sources.map((s, i) => (
              <li key={i} style={{ fontSize: 11, lineHeight: 1.5, color: APAISEMENT.texte, opacity: 0.7 }}>
                {texteRiche(s)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}


const corps = { fontSize: 13.5, lineHeight: 1.55, color: APAISEMENT.texte } as const;

/** L'emplacement de la future vidéo ou image (brief §4.4, point 3). */
function VisuelAVenir({ format }: { format: string }) {
  const video = /vid[ée]o/i.test(format);
  return (
    <div
      style={{
        aspectRatio: "16 / 10",
        borderRadius: 14,
        border: `1.5px dashed ${APAISEMENT.avatarBg}`,
        background: "rgba(229,235,221,.45)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: 16,
        textAlign: "center",
      }}
    >
      <span
        aria-hidden
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: APAISEMENT.avatarBg,
          color: APAISEMENT.profond,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {video ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
          </svg>
        ) : (
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
            <circle cx="9" cy="10" r="1.6" />
            <path d="M20.5 15.5l-5-4.5-8 8" />
          </svg>
        )}
      </span>
      <p style={{ fontSize: 12, color: APAISEMENT.profond, fontStyle: "italic", margin: 0 }}>
        {PLACEHOLDER_VISUEL}
      </p>
    </div>
  );
}
