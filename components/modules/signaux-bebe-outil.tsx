"use client";

import { useMemo, useState } from "react";
import { analyserSignaux, estValable } from "@/lib/signaux-bebe";
import type { ContenuSignaux } from "@/lib/signaux-bebe-contenu";

// ----------------------------------------------------------------------------
// « Que me dit bébé ? » : les écrans (maquette validée par Laura le 05/11/2026).
//   1. Âge   2. Une catégorie par écran   3. Résultat
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
  const ageDepart = Math.max(AGE_MIN, Math.min(AGE_MAX, ageProfil));
  const [age, setAge] = useState(ageDepart);
  const [coches, setCoches] = useState<Set<string>>(() => new Set());
  // -1 = écran de l'âge ; 0..n-1 = catégories ; n = résultat.
  const [ecran, setEcran] = useState(-1);
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
    setAge(ageDepart);
    setCoches(new Set());
    setVoirAlertes(false);
    aller(-1);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "0 4px", color: C.texte }}>
      {ecran === -1 ? (
        <EcranAge age={age} setAge={setAge} onCommencer={() => aller(0)} />
      ) : ecran < categories.length ? (
        <EcranCategorie
          index={ecran}
          total={categories.length}
          titre={categories[ecran].titre}
          options={categories[ecran].options}
          coches={coches}
          basculer={basculer}
          nbCoches={nbCoches}
          precedent={() => aller(ecran - 1)}
          suivant={() => aller(ecran + 1)}
          dernier={ecran === categories.length - 1}
        />
      ) : (
        <EcranResultat
          contenu={contenu}
          resultat={resultat}
          voirAlertes={voirAlertes}
          quandConsulter={() => {
            if (resultat.alerte) {
              document.getElementById("alertes")?.scrollIntoView({ behavior: "smooth" });
            } else {
              setVoirAlertes(true);
              requestAnimationFrame(() =>
                document.getElementById("alertes")?.scrollIntoView({ behavior: "smooth" }),
              );
            }
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

// --- 1. Âge ------------------------------------------------------------------

function EcranAge({
  age,
  setAge,
  onCommencer,
}: {
  age: number;
  setAge: (n: number) => void;
  onCommencer: () => void;
}) {
  const rond = (signe: "-" | "+", desactive: boolean, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      disabled={desactive}
      aria-label={signe === "-" ? "Un mois de moins" : "Un mois de plus"}
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        border: `1.5px solid ${C.muted}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: desactive ? 0.35 : 1,
        background: "transparent",
      }}
    >
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth={1.8} strokeLinecap="round" aria-hidden>
        <path d="M6 12h12" />
        {signe === "+" ? <path d="M12 6v12" /> : null}
      </svg>
    </button>
  );

  return (
    <>
      <Titre sousTitre="Ce qu'il te dit peut-être">Que me dit bébé ?</Titre>
      <section>
        <p style={LABEL}>Quel âge a bébé ?</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#fff",
            borderRadius: 16,
            padding: "14px 16px",
          }}
        >
          {rond("-", age <= AGE_MIN, () => setAge(Math.max(AGE_MIN, age - 1)))}
          <span aria-live="polite" style={{ fontFamily: PLAYFAIR, fontSize: 32, lineHeight: 1 }}>
            {age} <span style={{ fontSize: 15, color: C.muted, fontFamily: "inherit" }}>mois</span>
          </span>
          {rond("+", age >= AGE_MAX, () => setAge(Math.min(AGE_MAX, age + 1)))}
        </div>
        <p style={{ fontSize: 12, color: C.muted, margin: "8px 2px 0", lineHeight: 1.5 }}>
          L&apos;âge de ton profil, modifiable de 0 à 23 mois.
        </p>
      </section>
      <div style={{ display: "flex" }}>
        <Bouton onClick={onCommencer}>Commencer</Bouton>
      </div>
    </>
  );
}

// --- 2. Une catégorie par écran ---------------------------------------------

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
  precedent: () => void;
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
        <Bouton secondaire onClick={precedent}>
          Précédent
        </Bouton>
        <Bouton onClick={suivant}>{dernier ? "Voir le résultat" : "Suivant"}</Bouton>
      </div>
    </>
  );
}

// --- 3. Résultat -------------------------------------------------------------

function ListeAlertes({ alertes }: { alertes: ContenuSignaux["alertes"] }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
      {alertes.map((a) => (
        <li key={a.situation} style={{ fontSize: 13, lineHeight: 1.45 }}>
          <span>{a.situation}</span>
          <span style={{ display: "block", fontWeight: 600, color: C.corailFonce }}>{a.a_dire}</span>
        </li>
      ))}
    </ul>
  );
}

function BlocAlertes({ alertes, enTete }: { alertes: ContenuSignaux["alertes"]; enTete: boolean }) {
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
      <p style={{ fontSize: 14, fontWeight: 600, color: C.corailFonce, margin: "0 0 10px" }}>
        {enTete ? "Avant tout, ces signes demandent un avis" : "Quand consulter ?"}
      </p>
      <ListeAlertes alertes={alertes} />
    </section>
  );
}

function EcranResultat({
  contenu,
  resultat,
  voirAlertes,
  quandConsulter,
  modifier,
  recommencer,
}: {
  contenu: ContenuSignaux;
  resultat: ReturnType<typeof analyserSignaux>;
  voirAlertes: boolean;
  quandConsulter: () => void;
  modifier: () => void;
  recommencer: () => void;
}) {
  return (
    <>
      <Titre>Ce qu&apos;il te dit peut-être</Titre>

      {resultat.alerte ? <BlocAlertes alertes={contenu.alertes} enTete /> : null}

      {resultat.top3.length > 0 ? (
        <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {resultat.top3.map((c) => (
            <article key={c.piste.code} style={{ background: "#fff", borderRadius: 14, padding: "12px 14px" }}>
              <p style={{ ...LABEL, color: C.corail, margin: "0 0 3px" }}>
                {c.rang} · {c.piste.nom}
              </p>
              <p style={{ fontFamily: PLAYFAIR, fontSize: 17, lineHeight: 1.3, margin: "0 0 5px" }}>
                {contenu.phrases[c.piste.code] ?? c.piste.nom}
              </p>
              <p style={{ fontSize: 13, color: C.doux, lineHeight: 1.5, margin: 0 }}>{c.piste.action}</p>
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
          {contenu.etapes.map((e) => (
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
              <span>{e.texte}</span>
            </li>
          ))}
        </ol>
      </section>

      {voirAlertes && !resultat.alerte ? <BlocAlertes alertes={contenu.alertes} enTete={false} /> : null}

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
