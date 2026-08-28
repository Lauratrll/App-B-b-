import Link from "next/link";
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { getBabyMonth } from "@/lib/utils";
import {
  getDureeAnimation,
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
  REFLEXO_FOND_LECTEUR,
  REFLEXO_FOND_LECTEUR_TEXTE,
  REFLEXO_TERRACOTTA,
  slotReflexo,
  texteGras,
} from "@/components/modules/reflexo-design";

// Écran d'un protocole de « Réflexologie ».
// Ordre imposé par reflexologie/CONSIGNES_CLAUDE_CODE_onglet_reflexologie.md §4 :
// titre + intro (l'accueil de l'émotion y est intégré) → ouverture → carte des
// zones → séquence repliée → régularité (toujours) → disclaimer (toujours).
// La note de fin ne s'affiche plus ici : elle vit dans le lecteur animé.

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
  // « Avant de commencer » prend la couleur DU PROTOCOLE (choix Laura, 25/08) :
  // même teinte que sa carte dans la liste et que son picto, pour que l'entrée
  // dans la fiche prolonge la case sur laquelle le parent a tapé.
  const C_OUVERTURE = famille;
  const C_VARIANTE = REFLEXO_GAMME[1]; // violet lilas — la version alternative
  // « Jour après jour » forme une UNITÉ avec « Avant de commencer » (choix
  // Laura) : même fond (`doux`) et même couleur d'intitulé (`profond`), donc
  // même famille — celle du protocole, variable d'une fiche à l'autre. Les deux
  // encarts encadrent la séance : ce qu'on installe avant, ce qu'on répète après.
  const C_REGULARITE = famille;

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
        {/* La phrase qui accueille l'émotion : même bloc que l'intro, distinguée
            par l'italique seul (pas d'encart, pas de marqueur dans le texte). */}
        {protocole.intro_note ? (
          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.6,
              color: REFLEXO_TEXT,
              fontStyle: "italic",
              textAlign: "left",
              margin: "10px 0 0",
            }}
          >
            {texteGras(protocole.intro_note)}
          </p>
        ) : null}
      </header>

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
          </div>

          {/* Carte cliquable : image + ▶ qui ouvre le lecteur animé paysage. */}
          <ReflexoCarte
            visuel={visuel}
            titre={protocole.titre}
            steps={getStepsAnimation(protocole)}
            couleur={famille.profond}
            noteFin={protocole.note_fin}
            dureeMs={getDureeAnimation(params.id)}
          />
        </section>
      ) : null}

      {/* 4 bis. Séquence — REPLIÉE par défaut (choix Laura, 25/08) : le détail
          du geste vit dans le lecteur animé, où il est calé sur le pied. Ici on
          ne garde qu'un aide-mémoire, zone + pourquoi, pour le parent qui
          connaît déjà le protocole et veut décoder les numéros de la carte. */}
      <style>{`
        details.reflexo-sequence > summary { list-style: none; }
        details.reflexo-sequence > summary::-webkit-details-marker { display: none; }
        details.reflexo-sequence[open] .reflexo-chevron-seq { transform: rotate(180deg); }
      `}</style>
      {/* Même encart que l'« Introduction » de l'accueil (choix Laura, 28/08) :
          le fond du lecteur — celui de l'image des pieds juste au-dessus — pour
          rattacher l'aide-mémoire à la carte qu'il sert à décoder, et des étapes
          en cartes blanches à l'intérieur. */}
      <details
        className="reflexo-sequence"
        style={{
          background: REFLEXO_FOND_LECTEUR,
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <summary
          style={{
            listStyle: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 16px",
          }}
        >
          <span style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                display: "block",
                fontFamily: PLAYFAIR,
                fontWeight: 700,
                fontSize: 18,
                color: REFLEXO_TEXT,
                lineHeight: 1.2,
              }}
            >
              Les zones réflexes en bref
            </span>
            <span
              style={{
                display: "block",
                marginTop: 3,
                fontSize: 9,
                color: REFLEXO_FOND_LECTEUR_TEXTE,
                letterSpacing: ".13em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {protocole.sequence.length} étapes
            </span>
          </span>
          <svg
            className="reflexo-chevron-seq"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke={REFLEXO_TEXT}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            style={{ flexShrink: 0, transition: "transform .2s ease" }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </summary>

        <div style={{ display: "grid", gap: 9, padding: "0 16px 18px" }}>
          {protocole.sequence.map((etape) => (
            <EtapeCarte key={etape.ordre} etape={etape} />
          ))}
        </div>
      </details>

      {/* 4 ter. Régularité — encart COMMUN à tous les protocoles, placé juste
          après l'aide-mémoire des zones (choix Laura) : c'est la
          répétition des stimulations qui compte, pas une séance isolée. Même
          traitement que « Avant de commencer » : intitulé en capitales. */}
      {protocole.regularite ? (
        <section
          style={{
            background: C_REGULARITE.doux,
            borderRadius: 12,
            padding: "13px 15px",
          }}
        >
          <h2
            style={{
              fontSize: 10,
              color: C_REGULARITE.profond,
              letterSpacing: ".13em",
              textTransform: "uppercase",
              fontWeight: 700,
              margin: "0 0 8px 0",
            }}
          >
            {protocole.regularite_titre ?? "Jour après jour"}
          </h2>
          <p
            style={{
              fontSize: 12.5,
              lineHeight: 1.6,
              color: REFLEXO_TEXT,
              margin: 0,
            }}
          >
            {texteGras(protocole.regularite)}
          </p>
        </section>
      ) : null}

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
                titre={`${protocole.titre}, ${protocole.variante.condition.toLowerCase()}`}
                steps={getStepsAnimation(protocole, { avecVariante: true })}
                couleur={C_VARIANTE.profond}
                noteFin={protocole.note_fin}
                dureeMs={getDureeAnimation(params.id, { avecVariante: true })}
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

      {/* 6. La sortie en douceur — retirée de la page (choix Laura, 28/08) :
          elle n'est PAS une note de bas de page, c'est le dernier geste. Le
          lecteur animé la garde et s'y termine — cf. `noteFin` passé à
          <ReflexoCarte /> plus haut. Ne pas la réintroduire ici. */}

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

      {/* Disclaimer — note discrète, POSÉE SUR LE FOND, sans encart (choix
          Laura) : c'est une mention légale, pas un bloc de contenu. */}
      <p
        style={{
          padding: "0 2px",
          fontSize: 11,
          lineHeight: 1.5,
          color: REFLEXO_TEXT,
          opacity: 0.7,
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
 * Une étape de la séquence, en version AIDE-MÉMOIRE : son numéro, son libellé
 * parent et le POURQUOI (`phrase` du protocole). La description du geste n'est
 * plus reprise ici (choix Laura, 25/08) : elle est induite par la forme de la
 * zone sur la carte, et détaillée dans le lecteur animé.
 *
 * Une étape porte le plus souvent UNE zone : son nom est alors déjà le titre
 * de l'étape, on ne le répète pas. Les étapes à gestes enchaînés (bassin,
 * dents, cardia/pylore) en portent deux, numérotées dans l'ordre de jeu.
 */
// Les étapes vivent DANS l'encart terracotta : carte blanche, comme les
// précautions de l'introduction de l'accueil. Le numéro et les sous-lignes de
// zones gardent la famille du geste, la même sur toutes les fiches.
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
        background: "#FFFFFF",
        borderRadius: 10,
        padding: "11px 13px",
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
          {/* Aucune distinction (choix Laura, 28/08) : ni encart, ni gras, ni
              corps différent — ces lignes sont du texte de la carte comme le
              reste, elles ne sont pas d'un autre niveau de lecture. */}
          {zones.map((z, i) => (
            <li
              key={`${z.designation}-${i}`}
              style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: REFLEXO_TEXT,
              }}
            >
              {etape.gestes_enchaines ? `${i + 1}. ` : null}
              {z.designation}
              {z.phrase ? <> : {texteGras(z.phrase)}</> : null}
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
      l&apos;ongle), et non sous la plante, contrairement au dessin.
    </p>
  );
}
