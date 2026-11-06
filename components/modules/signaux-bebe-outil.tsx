"use client";

import { useMemo, useState } from "react";
import { analyserSignaux, estValable } from "@/lib/signaux-bebe";
import type { ContenuSignaux, SourceRef } from "@/lib/signaux-bebe-contenu";

// ----------------------------------------------------------------------------
// « Que me dit bébé ? » : les écrans (maquette validée par Laura le 05/11/2026).
//   1. Une catégorie par écran   2. Résultat
//   (06/11 : plus d'écran « âge » : l'app connaît déjà l'âge de bébé, pris dans le profil.)
// AUCUNE donnée enregistrée : pas de base, pas de cookie, pas de stockage
// local, pas d'analytics. Tout est dans l'état React de la page et disparaît
// quand on la quitte (prompt §7 : données sur un mineur, proches de la santé).
// Tout le texte vient du JSON, sauf les libellés d'interface de la maquette et
// la mention fixe du bas (même formule que la page SOS).
// ----------------------------------------------------------------------------

const PLAYFAIR = "var(--font-playfair), Georgia, serif";
const C = {
  texte: "#3A3229",
  doux: "#5A4A40",
  muted: "#8A9E98",
  corail: "#D4604A",
  corailClair: "#F5D0C8",
  corailFonce: "#8A3020",
  cadre: "#EDE9E4",
  principeFond: "#E8F0F2",
  principeTexte: "#384E48",
  bordure: "#E4DDD6",
};

const LABEL: React.CSSProperties = {
  fontSize: 10,
  color: C.muted,
  letterSpacing: ".07em",
  textTransform: "uppercase",
  fontWeight: 600,
  margin: "0 0 8px",
};

const AGE_MIN = 0;
const AGE_MAX = 23;

type Props = { contenu: ContenuSignaux; ageProfil: number };

export function SignauxBebeOutil({ contenu, ageProfil }: Props) {
  // L'âge vient du profil : on ne le redemande pas.
  const age = Math.max(AGE_MIN, Math.min(AGE_MAX, ageProfil));
  const [coches, setCoches] = useState<Set<string>>(() => new Set());
  // 0..n-1 = catégories ; n = résultat.
  const [ecran, setEcran] = useState(0);
  const [voirAlertes, setVoirAlertes] = useState(false);

  // Catégories qui ont au moins une réponse à cet âge (les autres sont sautées).
  const categories = useMemo(
    () =>
      contenu.categories
        .map((c) => ({
          ...c,
          options: contenu.options.filter((o) => o.categorie === c.id && estValable(o, age)),
        }))
        .filter((c) => c.options.length > 0),
    [contenu, age],
  );

  const resultat = useMemo(() => analyserSignaux(contenu, age, coches), [contenu, age, coches]);
  const nbCoches = resultat.nbValables;

  const aller = (n: number) => {
    setEcran(n);
    window.scrollTo({ top: 0 });
  };

  const basculer = (id: string) =>
    setCoches((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });

  const recommencer = () => {
    setCoches(new Set());
    setVoirAlertes(false);
    aller(0);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "0 4px", color: C.texte }}>
      {ecran < categories.length ? (
        <EcranCategorie
          index={ecran}
          total={categories.length}
          titre={categories[ecran].titre}
          options={categories[ecran].options}
          coches={coches}
          basculer={basculer}
          nbCoches={nbCoches}
          precedent={ecran > 0 ? () => aller(ecran - 1) : undefined}
          suivant={() => aller(ecran + 1)}
          dernier={ecran === categories.length - 1}
        />
      ) : (
        <EcranResultat
          contenu={contenu}
          resultat={resultat}
          coches={coches}
          age={age}
          voirAlertes={voirAlertes}
          quandConsulter={() => {
            setVoirAlertes(true);
            requestAnimationFrame(() =>
              document.getElementById("alertes")?.scrollIntoView({ behavior: "smooth" }),
            );
          }}
          modifier={() => aller(categories.length - 1)}
          recommencer={recommencer}
        />
      )}

      <MentionFixe />
    </div>
  );
}

// --- En-tête commun ----------------------------------------------------------

function Titre({ children, sousTitre }: { children: React.ReactNode; sousTitre?: string }) {
  return (
    <header style={{ textAlign: "center", padding: "4px 0 2px" }}>
      <h1
        style={{
          fontFamily: PLAYFAIR,
          fontWeight: 700,
          fontSize: 26,
          color: C.texte,
          letterSpacing: "-.015em",
          lineHeight: 1.1,
          margin: sousTitre ? "0 0 8px" : 0,
        }}
      >
        {children}
      </h1>
      {sousTitre ? (
        <p style={{ ...LABEL, letterSpacing: ".15em", fontSize: 9, margin: 0 }}>{sousTitre}</p>
      ) : null}
    </header>
  );
}

function Bouton({
  children,
  onClick,
  secondaire,
}: {
  children: React.ReactNode;
  onClick: () => void;
  secondaire?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="transition-transform active:scale-[0.98]"
      style={{
        flex: 1,
        minHeight: 46,
        borderRadius: 999,
        fontSize: 14,
        fontWeight: 600,
        background: secondaire ? "rgba(255,255,255,.7)" : C.corail,
        color: secondaire ? C.muted : "#fff",
        border: secondaire ? `1px solid ${C.bordure}` : "none",
      }}
    >
      {children}
    </button>
  );
}

// --- 1. Une catégorie par écran ---------------------------------------------

function EcranCategorie({
  index,
  total,
  titre,
  options,
  coches,
  basculer,
  nbCoches,
  precedent,
  suivant,
  dernier,
}: {
  index: number;
  total: number;
  titre: string;
  options: ContenuSignaux["options"];
  coches: Set<string>;
  basculer: (id: string) => void;
  nbCoches: number;
  precedent?: () => void;
  suivant: () => void;
  dernier: boolean;
}) {
  // Les questions de la catégorie, dans l'ordre du classeur.
  const questions: { question: string; options: ContenuSignaux["options"] }[] = [];
  for (const o of options) {
    const q = questions.find((x) => x.question === o.question);
    if (q) q.options.push(o);
    else questions.push({ question: o.question, options: [o] });
  }

  return (
    <>
      {index === 0 ? <Titre sousTitre="Ce qu'il te dit peut-être">Que me dit bébé ?</Titre> : null}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted }}>
          <span>
            Étape {index + 1} sur {total}
          </span>
          <span aria-live="polite">
            {nbCoches} observation{nbCoches > 1 ? "s" : ""} cochée{nbCoches > 1 ? "s" : ""}
          </span>
        </div>
        <div style={{ height: 3, background: C.bordure, borderRadius: 2, marginTop: 6 }}>
          <div
            style={{
              width: `${((index + 1) / total) * 100}%`,
              height: 3,
              background: C.corail,
              borderRadius: 2,
              transition: "width .25s",
            }}
          />
        </div>
      </div>

      <h1 style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 24, lineHeight: 1.15, margin: 0 }}>{titre}</h1>

      {questions.map((q) => (
        <fieldset key={q.question} style={{ border: 0, padding: 0, margin: 0 }}>
          <legend style={{ ...LABEL, padding: 0 }}>{q.question}</legend>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {q.options.map((o) => {
              const coche = coches.has(o.id);
              return (
                <label
                  key={o.id}
                  style={{
                    display: "flex",
                    gap: 11,
                    alignItems: "flex-start",
                    background: coche ? "#FBEDE9" : "#fff",
                    border: `1px solid ${coche ? C.corailClair : "transparent"}`,
                    borderRadius: 12,
                    padding: "11px 12px",
                    fontSize: 14,
                    lineHeight: 1.4,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={coche}
                    onChange={() => basculer(o.id)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    style={{
                      width: 18,
                      height: 18,
                      flexShrink: 0,
                      marginTop: 1,
                      borderRadius: 5,
                      border: `1.5px solid ${coche ? C.corail : C.muted}`,
                      background: coche ? C.corail : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {coche ? (
                      <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    ) : null}
                  </span>
                  <span>{o.reponse}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div style={{ display: "flex", gap: 8 }}>
        {precedent ? (
          <Bouton secondaire onClick={precedent}>
            Précédent
          </Bouton>
        ) : null}
        <Bouton onClick={suivant}>{dernier ? "Voir le résultat" : "Suivant"}</Bouton>
      </div>
    </>
  );
}

// --- 2. Résultat -------------------------------------------------------------

/** Petits numéros de notes, comme dans les autres rubriques : le détail est en bas, dans « Sources ». */
function Refs({ n }: { n: number[] }) {
  if (n.length === 0) return null;
  return (
    <sup style={{ fontSize: 9, fontWeight: 600, color: C.muted, marginLeft: 3, whiteSpace: "nowrap" }}>
      {n.join(", ")}
    </sup>
  );
}

function ListeAlertes({ alertes, refs }: { alertes: ContenuSignaux["alertes"]; refs: number[][] }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
      {alertes.map((a, i) => (
        <li key={a.situation} style={{ fontSize: 13, lineHeight: 1.45 }}>
          <span>{a.situation}</span>
          <Refs n={refs[i] ?? []} />
          <span style={{ display: "block", fontWeight: 600, color: C.corailFonce }}>{a.a_dire}</span>
        </li>
      ))}
    </ul>
  );
}

/** Message d'appel : seulement les signes cochés qui demandent un avis. */
function AppelConsulter({ alertes, refs }: { alertes: ContenuSignaux["alertes"]; refs: number[][] }) {
  const immediat = alertes.some((a) => a.urgence === "Immédiate");
  return (
    <section
      id="appel"
      style={{ background: C.corailClair, border: `1.5px solid ${C.corail}`, borderRadius: 14, padding: "14px 15px" }}
    >
      <p style={{ fontSize: 15, fontWeight: 700, color: C.corailFonce, margin: "0 0 4px" }}>
        {immediat ? "Consulte sans attendre" : "Parles-en vite à un professionnel de santé"}
      </p>
      <p style={{ fontSize: 12.5, color: C.corailFonce, margin: "0 0 10px", lineHeight: 1.45 }}>
        Ce que tu as coché mérite un avis médical, avant de chercher une piste ci-dessous. En cas de doute, appelle le{" "}
        <a href="tel:15" style={{ color: C.corailFonce, fontWeight: 700 }}>
          15
        </a>
        .
      </p>
      <ListeAlertes alertes={alertes} refs={refs} />
    </section>
  );
}

function BlocAlertes({ alertes, refs }: { alertes: ContenuSignaux["alertes"]; refs: number[][] }) {
  return (
    <section
      id="alertes"
      style={{
        background: C.cadre,
        border: `1px solid ${C.corail}`,
        borderRadius: 14,
        padding: "14px 15px",
        scrollMarginTop: 16,
      }}
    >
      <p style={{ fontSize: 14, fontWeight: 600, color: C.corailFonce, margin: "0 0 10px" }}>Quand consulter ?</p>
      <ListeAlertes alertes={alertes} refs={refs} />
    </section>
  );
}

/** Même mécanisme que les autres rubriques : lien « Sources » souligné, liste repliée. */
function SourcesNumerotees({ liste }: { liste: { n: number; ref: SourceRef }[] }) {
  const [ouvert, setOuvert] = useState(false);
  if (liste.length === 0) return null;
  return (
    <div style={{ margin: "0" }}>
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-expanded={ouvert}
        style={{
          all: "unset",
          cursor: "pointer",
          fontSize: 10,
          fontWeight: 600,
          color: "#8A9E98",
          textDecoration: "underline",
        }}
      >
        {ouvert ? "Masquer les sources" : "Sources"}
      </button>
      {ouvert ? (
        <div style={{ fontSize: 10, color: "#6E7B72", lineHeight: 1.5, marginTop: 5 }}>
          {liste.map(({ n, ref }) => (
            <div key={n} style={{ marginBottom: 3 }}>
              {n}. {ref.titre}
              {ref.auteur ? `, ${ref.auteur}` : ""}
              {ref.lien ? (
                <>
                  {" "}
                  <a href={ref.lien} target="_blank" rel="noopener noreferrer" style={{ color: "#6E7B72" }}>
                    (lien)
                  </a>
                </>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function EcranResultat({
  contenu,
  resultat,
  coches,
  age,
  voirAlertes,
  quandConsulter,
  modifier,
  recommencer,
}: {
  contenu: ContenuSignaux;
  resultat: ReturnType<typeof analyserSignaux>;
  coches: Set<string>;
  age: number;
  voirAlertes: boolean;
  quandConsulter: () => void;
  modifier: () => void;
  recommencer: () => void;
}) {
  // Numérotation des sources dans l'ordre d'apparition à l'écran (appel, cartes, étapes, liste).
  const numeros = new Map<string, number>();
  const ref = (ids: string[] | undefined): number[] => {
    const out: number[] = [];
    for (const id of ids ?? []) {
      if (!contenu.sourcesRef[id]) continue;
      if (!numeros.has(id)) numeros.set(id, numeros.size + 1);
      out.push(numeros.get(id)!);
    }
    return out.sort((x, y) => x - y);
  };

  const valables = contenu.options.filter((o) => coches.has(o.id) && estValable(o, age));
  const reponsesAlerte = new Set(valables.filter((o) => o.type === "alerte").map((o) => o.reponse));
  const declenchees = contenu.alertes.filter((a) => (a.declencheurs ?? []).some((r) => reponsesAlerte.has(r)));
  const refsAppel = declenchees.map((a) => ref(a.sources));
  const sourcesPiste = (code: string) =>
    valables.filter((o) => (o.points[code] ?? 0) > 0).flatMap((o) => o.sources ?? []);
  const sourcesConseils = (code: string) => contenu.pistes.find((p) => p.code === code)?.sources ?? [];
  const refsCartes = resultat.top3.map((c) => ref([...sourcesPiste(c.piste.code), ...sourcesConseils(c.piste.code)]));
  const refsEtapes = contenu.etapes.map((e) => ref(e.sources));
  const refsToutes = voirAlertes ? contenu.alertes.map((a) => ref(a.sources)) : [];
  const liste = Array.from(numeros.entries())
    .map(([id, n]) => ({ n, ref: contenu.sourcesRef[id] }))
    .sort((x, y) => x.n - y.n);

  return (
    <>
      <Titre>Ce qu&apos;il te dit peut-être</Titre>

      {declenchees.length > 0 ? <AppelConsulter alertes={declenchees} refs={refsAppel} /> : null}

      {resultat.top3.length > 0 ? (
        <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {resultat.top3.map((c, i) => (
            <article key={c.piste.code} style={{ background: "#fff", borderRadius: 14, padding: "12px 14px" }}>
              <p style={{ ...LABEL, color: C.corail, margin: "0 0 3px" }}>
                {c.rang} · {c.piste.nom}
              </p>
              <p style={{ fontFamily: PLAYFAIR, fontSize: 17, lineHeight: 1.3, margin: "0 0 5px" }}>
                {contenu.phrases[c.piste.code] ?? c.piste.nom}
                <Refs n={refsCartes[i]} />
              </p>
              <p style={{ fontSize: 13, color: C.doux, lineHeight: 1.5, margin: 0 }}>{c.piste.action}</p>
              {c.piste.observer ? (
                <p style={{ fontSize: 12.5, color: C.doux, lineHeight: 1.5, margin: "7px 0 0" }}>
                  <strong style={{ fontWeight: 600 }}>À observer :</strong> {c.piste.observer}
                </p>
              ) : null}
              {c.piste.consulter ? (
                <p style={{ fontSize: 12.5, color: C.corailFonce, lineHeight: 1.5, margin: "5px 0 0" }}>
                  <strong style={{ fontWeight: 600 }}>Quand consulter :</strong> {c.piste.consulter}
                </p>
              ) : null}
            </article>
          ))}
        </section>
      ) : null}

      {resultat.messages.map((m) => (
        <p
          key={m}
          style={{
            background: C.principeFond,
            color: C.principeTexte,
            borderRadius: 12,
            padding: "11px 13px",
            fontSize: 13,
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {m}
        </p>
      ))}

      <p style={{ fontSize: 12.5, color: C.doux, margin: 0, lineHeight: 1.5 }}>
        <span style={{ ...LABEL, display: "inline", margin: 0 }}>Confiance</span>
        <br />
        {resultat.confiance}
      </p>

      <section>
        <p style={LABEL}>À essayer dans l&apos;ordre</p>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 7 }}>
          {contenu.etapes.map((e, i) => (
            <li key={e.n} style={{ display: "flex", gap: 10, fontSize: 13, lineHeight: 1.5, color: C.doux }}>
              <span
                aria-hidden
                style={{
                  flexShrink: 0,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: C.corailClair,
                  color: C.corailFonce,
                  fontSize: 11,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {e.n}
              </span>
              <span>
                {e.texte}
                <Refs n={refsEtapes[i]} />
              </span>
            </li>
          ))}
        </ol>
      </section>

      {voirAlertes ? <BlocAlertes alertes={contenu.alertes} refs={refsToutes} /> : null}

      <SourcesNumerotees liste={liste} />

      <div style={{ display: "flex", gap: 8 }}>
        <Bouton secondaire onClick={modifier}>
          Modifier
        </Bouton>
        <Bouton onClick={recommencer}>Recommencer</Bouton>
      </div>

      <p style={{ textAlign: "center", margin: 0 }}>
        <button
          type="button"
          onClick={quandConsulter}
          style={{ fontSize: 13, color: C.corailFonce, textDecoration: "underline", background: "none" }}
        >
          Quand consulter ?
        </button>
      </p>
    </>
  );
}

// --- Mention fixe (même formule que la page SOS) -----------------------------

function MentionFixe() {
  return (
    <p style={{ fontSize: 11, color: C.muted, textAlign: "center", lineHeight: 1.5, margin: "8px 8px 0" }}>
      Ce n&apos;est pas un diagnostic et ne remplace pas un avis médical. En cas de doute, appelez le{" "}
      <a href="tel:15" style={{ color: C.muted, textDecoration: "underline" }}>
        15
      </a>
      .
    </p>
  );
}
