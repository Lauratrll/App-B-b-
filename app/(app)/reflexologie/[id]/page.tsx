import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import {
  getIdsPublies,
  getProtocole,
  getRangProtocole,
  getStepsAnimation,
  ouvertureCommune,
  texteZone,
  varianteVisible,
  visuelUrl,
  type ReflexoEtape,
  type ReflexoZoneTexte,
} from "@/lib/reflexologie";
import { ReflexoCarte } from "@/components/modules/reflexo-lecteur";
import { ReflexoIcone } from "@/components/modules/reflexo-icone";
import {
  PLAYFAIR,
  REFLEXO_MUTED,
  REFLEXO_TEXT,
  REFLEXO_GAMME,
  REFLEXO_TERRACOTTA,
  slotReflexo,
  texteGras,
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

  // La couleur PROPRE au protocole : celle de sa ligne dans la liste, pour que
  // l'ouverture de la fiche prolonge la case sur laquelle le parent a tapé.
  const famille = slotReflexo(Math.max(0, getRangProtocole(params.id)));

  // Chaque bloc de la fiche prend une famille de la gamme, toujours la même
  // d'un protocole à l'autre : c'est la fonction du bloc qui donne la couleur,
  // jamais le protocole. Le terracotta reste réservé à ce qui demande de
  // l'attention (vigilance, emplacement contre-intuitif, disclaimer).
  const C_EMOTION = REFLEXO_GAMME[0]; // violet bleuté — le ressenti du parent
  const C_OUVERTURE = REFLEXO_GAMME[4]; // sauge — l'installation, le vivant
  const C_GESTE = REFLEXO_GAMME[3]; // turquoise vert — l'identité de l'onglet
  const C_VARIANTE = REFLEXO_GAMME[1]; // violet lilas — la version alternative
  const C_FIN = REFLEXO_GAMME[2]; // bleu ciel — la sortie en douceur

  const afficherVariante = varianteVisible(protocole.variante, moisBebe);
  const visuel = visuelUrl(protocole.visuel);
  // La variante a sa propre carte récapitulative (Sommeil « avec cauchemars » :
  // 9 zones au lieu de 8) — affichée seulement quand la variante l'est.
  const visuelVariante = visuelUrl(protocole.visuel_cauchemars);

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

      {/* 1. Titre — centré, picto du protocole au-dessus dans SA couleur, même
          traitement que la page 2 de Guide-moi. La teinte vient du rang du
          protocole dans la liste : on retrouve la couleur de la ligne sur
          laquelle le parent vient de taper. */}
      <header style={{ textAlign: "center", margin: "10px 0 0" }}>
        <span style={{ display: "block", margin: "0 auto 12px", width: 34, color: famille.avatarBg }}>
          <ReflexoIcone id={protocole.id} taille={34} />
        </span>
        <h1
          style={{
            fontFamily: PLAYFAIR,
            fontWeight: 700,
            fontSize: 26,
            color: REFLEXO_TEXT,
            letterSpacing: "-.015em",
            lineHeight: 1.1,
            margin: "0 0 8px 0",
          }}
        >
          {protocole.titre}
        </h1>
        {protocole.s_applique ? (
          <p
            style={{
              fontSize: 9,
              color: famille.profond,
              letterSpacing: ".07em",
              textTransform: "uppercase",
              fontWeight: 600,
              margin: "0 0 12px 0",
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
            textAlign: "left",
            margin: "14px 0 0",
          }}
        >
          {texteGras(protocole.intro)}
        </p>
      </header>

      {/* 2. Émotion — accueille le ressenti, si présente */}
      {protocole.emotion ? (
        <p
          style={{
            background: C_EMOTION.accent,
            borderRadius: 12,
            padding: "13px 15px",
            fontSize: 13,
            lineHeight: 1.6,
            color: REFLEXO_TEXT,
            fontStyle: "italic",
            margin: 0,
          }}
        >
          {texteGras(protocole.emotion)}
        </p>
      ) : null}

      {/* 3. Ouverture — installation, avant tout toucher réflexe. Source COMMUNE
          (version courte : libellé gras + phrase brève), cf. consignes §4.3. */}
      <section
        style={{
          background: C_OUVERTURE.doux,
          borderRadius: 14,
          padding: "15px 16px",
        }}
      >
        <h2
          style={{
            fontSize: 10,
            color: C_OUVERTURE.profond,
            letterSpacing: ".13em",
            textTransform: "uppercase",
            fontWeight: 700,
            margin: "0 0 10px 0",
          }}
        >
          {ouvertureCommune.titre}
        </h2>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 7 }}>
          {ouvertureCommune.etapes.map((e, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: 9,
                alignItems: "flex-start",
                fontSize: 13,
                lineHeight: 1.5,
                color: REFLEXO_TEXT,
              }}
            >
              {/* Pastille numérotée — même traitement que « action immédiate » (Guide-moi). */}
              <span
                aria-hidden
                style={{
                  flexShrink: 0,
                  width: 17,
                  height: 17,
                  borderRadius: "50%",
                  background: C_OUVERTURE.profond,
                  color: "#FFFFFF",
                  fontSize: 9,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 2,
                }}
              >
                {i + 1}
              </span>
              <span>
                <strong style={{ fontWeight: 600 }}>{e.gras}</strong>
                {" : "}
                {e.texte}
              </span>
            </li>
          ))}
        </ol>
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

          {/* Carte cliquable : image + ▶ qui ouvre le lecteur animé paysage. */}
          <ReflexoCarte
            visuel={visuel}
            titre={protocole.titre}
            steps={getStepsAnimation(protocole)}
          />
          <p
            style={{
              fontSize: 10.5,
              color: REFLEXO_MUTED,
              fontStyle: "italic",
              textAlign: "center",
              margin: 0,
            }}
          >
            Appuie sur ▶ et tourne ton téléphone pour la lecture animée.
          </p>
        </section>
      ) : null}

      {/* 5. Séquence — une étape = un libellé parent, une intention, ses zones */}
      <section style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        <h2
          style={{
            fontSize: 10,
            color: C_GESTE.profond,
            letterSpacing: ".13em",
            textTransform: "uppercase",
            fontWeight: 700,
            margin: 0,
          }}
        >
          Le geste, pas à pas
        </h2>

        {protocole.sequence.map((etape) => (
          <EtapeCarte key={etape.ordre} etape={etape} />
        ))}
      </section>

      {/* 5. Variante — seulement si l'âge de bébé la rend pertinente */}
      {protocole.variante && afficherVariante ? (
        <section
          style={{
            background: C_VARIANTE.accent,
            borderRadius: 13,
            padding: "14px 15px",
          }}
        >
          <h2
            style={{
              fontSize: 10,
              color: C_VARIANTE.profond,
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
            {texteGras(protocole.variante.texte)}
          </p>
          {/* Carte récapitulative de la version complète (séquence + variante),
              avec son propre lecteur animé. */}
          {visuelVariante ? (
            <div style={{ marginTop: 12 }}>
              <ReflexoCarte
                visuel={visuelVariante}
                titre={`${protocole.titre} — ${protocole.variante.condition.toLowerCase()}`}
                steps={getStepsAnimation(protocole, { avecVariante: true })}
              />
            </div>
          ) : null}

          {/* L'ajout de la variante est une (ou plusieurs) ÉTAPE(S) complète(s),
              à la suite de la séquence — même rendu que les étapes normales. */}
          {protocole.variante.ajout && protocole.variante.ajout.length > 0 ? (
            <div style={{ display: "grid", gap: 11, marginTop: 11 }}>
              {protocole.variante.ajout.map((etape) => (
                <EtapeCarte key={etape.ordre} etape={etape} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {/* Vigilance — ligne de sécurité mise en avant, si présente */}
      {protocole.vigilance ? (
        <p
          style={{
            background: REFLEXO_TERRACOTTA.accent,
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
          {texteGras(protocole.vigilance)}
        </p>
      ) : null}

      {/* 6. Note de fin — consentement + sortie en douceur, toujours affichée */}
      <p
        style={{
          background: C_FIN.doux,
          borderRadius: 12,
          padding: "13px 15px",
          fontSize: 13,
          lineHeight: 1.6,
          color: REFLEXO_TEXT,
          margin: 0,
        }}
      >
        {texteGras(protocole.note_fin)}
      </p>

      {/* 7. Disclaimer — toujours affiché */}
      <p
        style={{
          background: REFLEXO_TERRACOTTA.doux,
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
 * Une étape de la séquence : son numéro, son libellé parent, puis — pour
 * chaque zone — le GESTE (`geste_court` du catalogue) et le POURQUOI
 * (`phrase` du protocole, cf. consignes §4 « Textes affichés par zone »).
 *
 * Une étape porte le plus souvent UNE zone : son nom est alors déjà le titre
 * de l'étape, on ne le répète pas. Les étapes à gestes enchaînés (bassin,
 * dents, cardia/pylore) en portent deux, numérotées dans l'ordre de jeu.
 */
// La famille du geste, la même pour toutes les étapes de toutes les fiches.
const GESTE = REFLEXO_GAMME[3];

function EtapeCarte({ etape }: { etape: ReflexoEtape }) {
  const zones = (etape.zones ?? []).map(texteZone);
  const uneSeule = zones.length === 1;
  // Le pourquoi de l'étape : la phrase de la zone prime sur l'intention
  // historique (elles sont identiques depuis la relecture des textes). Quand
  // l'étape enchaîne deux zones, chacune porte déjà sa phrase et l'intention
  // n'en est que la concaténation : on ne la répète pas au-dessus.
  const pourquoi = uneSeule
    ? zones[0].phrase || etape.intention
    : zones.every((z) => z.phrase)
      ? ""
      : etape.intention;

  return (
    <div
      style={{
        background: GESTE.doux,
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
            color: GESTE.profond,
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

      {pourquoi ? (
        <p
          style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: REFLEXO_TEXT,
            margin: "8px 0 0 0",
          }}
        >
          {texteGras(pourquoi)}
        </p>
      ) : null}

      {/* Le geste, quand l'étape ne porte qu'une zone. */}
      {uneSeule && zones[0].geste ? (
        <p
          style={{
            fontSize: 12,
            lineHeight: 1.5,
            color: GESTE.profond,
            fontStyle: "italic",
            margin: "5px 0 0 0",
          }}
        >
          {texteGras(zones[0].geste)}
        </p>
      ) : null}

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
      ) : null}

      {/* Gestes enchaînés : une ligne par zone, dans l'ordre où on les joue. */}
      {!uneSeule && zones.length > 0 ? (
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
              key={`${z.designation}-${i}`}
              style={{
                background: GESTE.accent,
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
                {etape.gestes_enchaines ? `${i + 1}. ` : null}
                {z.designation}
              </p>
              {z.phrase ? (
                <p
                  style={{
                    fontSize: 12,
                    lineHeight: 1.5,
                    color: REFLEXO_TEXT,
                    opacity: 0.85,
                    margin: "2px 0 0 0",
                  }}
                >
                  {texteGras(z.phrase)}
                </p>
              ) : null}
              {z.geste ? (
                <p
                  style={{
                    fontSize: 11.5,
                    lineHeight: 1.45,
                    color: GESTE.profond,
                    fontStyle: "italic",
                    margin: "2px 0 0 0",
                  }}
                >
                  {z.geste}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Emplacement contre-intuitif (les dents sont SUR LE DESSUS du pied) :
          mis en avant, sinon le parent suit l'illustration plantaire. */}
      <EmplacementNote zones={zones} />
    </div>
  );
}

/**
 * L'avertissement d'emplacement d'une zone qui ne se travaille PAS sous la
 * plante (aujourd'hui : les deux zones « dents »). Rien n'est affiché pour
 * toutes les autres zones.
 */
function EmplacementNote({ zones }: { zones: ReflexoZoneTexte[] }) {
  const note = zones.find((z) => z.emplacement)?.emplacement;
  if (!note) return null;
  return (
    <p
      style={{
        background: REFLEXO_TERRACOTTA.accent,
        borderRadius: 10,
        padding: "9px 11px",
        margin: "9px 0 0 0",
        fontSize: 12,
        lineHeight: 1.5,
        color: REFLEXO_TEXT,
        fontWeight: 500,
      }}
    >
      <span aria-hidden style={{ marginRight: 6 }}>
        👆
      </span>
      {/* Capitales via textTransform : à l'écran c'est bien « SUR LE DESSUS DU
          PIED » (choix Laura, l'info est contre-intuitive), mais les lecteurs
          d'écran lisent le mot au lieu de l'épeler lettre par lettre. */}
      Ce geste se fait{" "}
      <strong style={{ textTransform: "uppercase" }}>sur le dessus du pied</strong>,
      autour de l&apos;ongle du gros orteil (au-dessus et en dessous de
      l&apos;ongle) — et non sous la plante, contrairement au dessin.
    </p>
  );
}
