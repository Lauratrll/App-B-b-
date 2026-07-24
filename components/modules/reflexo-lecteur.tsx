"use client";

// Lecteur animé d'un protocole de Réflexologie — mode paysage.
// Reproduit la maquette validée (reflexologie/maquette-lecteur-paysage.html) :
// l'illustration des pieds calée à gauche (fond #DFBEB0), le texte synchronisé
// sur le côté (nom « Le Cardia » / intention / description), les zones de
// l'étape en cours mises en avant par un repère pulsé, navigation pas à pas.
//
// Palier 1 (celui-ci) : mise en page paysage + synchro texte↔zone + repère
// pulsé, comme la maquette. Palier 2 (plus tard) : les 6 mouvements fins
// (spirale, glissé, boucles…) viendront se greffer dans drawMarkers(), à partir
// des prototypes mouvement-*.html.

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReflexoAnimStep } from "@/lib/reflexologie";

const SVG_URL = "/reflexologie/pieds_bebe_zones_reflexes.svg";
const NS = "http://www.w3.org/2000/svg";
const DUREE_ETAPE = 5000; // ms par étape en lecture auto (geste lent, nourrisson)
const INK = "#3A3228";
const EUCAL = "#6f5f52";
const BG_PIED = "#DFBEB0";

// « Le Cardia » : majuscule à l'article ET au nom, le reste en minuscules.
const ARTICLES = new Set(["le", "la", "les", "l'", "du", "de", "des", "au", "aux"]);
function capMot(w: string): string {
  if (!w) return w;
  const elision = w.match(/^([A-Za-zÀ-ÿ]['’])(.*)$/); // l'estomac → L'Estomac
  if (elision) {
    const [, art, reste] = elision;
    return (
      art.charAt(0).toUpperCase() +
      art.slice(1) +
      (reste ? reste.charAt(0).toUpperCase() + reste.slice(1) : "")
    );
  }
  return w.charAt(0).toUpperCase() + w.slice(1);
}
function nomZone(designation: string): string {
  const mots = designation.split(" ");
  mots[0] = capMot(mots[0]);
  const artNorm = mots[0].toLowerCase().replace("’", "'");
  if (mots.length > 1 && ARTICLES.has(artNorm)) mots[1] = capMot(mots[1]);
  return mots.join(" ");
}

type Geom = { cx: number; cy: number; fill: string; el: SVGGraphicsElement };

export function ReflexoLecteur({
  steps,
  titre,
  onClose,
}: {
  steps: ReflexoAnimStep[];
  titre: string;
  onClose: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<SVGSVGElement>(null);
  const geomRef = useRef<Map<string, Geom>>(new Map());
  const allCiblesRef = useRef<string[]>([]);

  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [portrait, setPortrait] = useState(false);

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Toutes les cibles du protocole (pour préparer/cacher les zones une fois).
  if (allCiblesRef.current.length === 0) {
    allCiblesRef.current = Array.from(
      new Set(steps.flatMap((s) => s.cibles)),
    );
  }

  // Verrou du défilement + Échap pour fermer + suivi de l'orientation.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const mq = window.matchMedia("(orientation: portrait)");
    const sync = () => setPortrait(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", sync);
    };
  }, [onClose]);

  // Injection du SVG des pieds + calcul des centres/couleurs de chaque zone.
  useEffect(() => {
    let cancelled = false;
    fetch(SVG_URL)
      .then((r) => r.text())
      .then((txt) => {
        if (cancelled || !stageRef.current) return;
        stageRef.current.innerHTML = txt;
        const svg = stageRef.current.querySelector("svg");
        if (!svg) return;
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.style.display = "block";
        svg.style.width = "100%";
        svg.style.height = "100%";

        const geom = new Map<string, Geom>();
        for (const id of allCiblesRef.current) {
          const el = svg.getElementById(id) as SVGGraphicsElement | null;
          if (!el) continue;
          let box: DOMRect;
          try {
            box = el.getBBox();
          } catch {
            continue;
          }
          let fill = getComputedStyle(el).fill;
          if (!fill || fill === "none" || fill === "rgb(0, 0, 0)") {
            const stroke = getComputedStyle(el).stroke;
            if (stroke && stroke !== "none") fill = stroke;
          }
          geom.set(id, {
            cx: box.x + box.width / 2,
            cy: box.y + box.height / 2,
            fill: fill || INK,
            el,
          });
        }
        geomRef.current = geom;
        // On masque toutes les zones : chaque étape révèle les siennes.
        geom.forEach((g) => {
          g.el.style.display = "none";
        });
        setReady(true);
      })
      .catch(() => {
        /* image indisponible : le texte reste lisible sans l'illustration */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Rendu d'une étape : zones révélées (précédentes atténuées) + repères pulsés.
  const drawStep = useCallback(
    (i: number) => {
      const geom = geomRef.current;
      const ov = overlayRef.current;
      if (ov) ov.innerHTML = "";
      // Cache tout, puis révèle les zones jusqu'à l'étape courante.
      geom.forEach((g) => {
        g.el.style.display = "none";
      });
      for (let k = 0; k <= i && k < steps.length; k++) {
        for (const id of steps[k].cibles) {
          const g = geom.get(id);
          if (!g) continue;
          g.el.style.display = "";
          g.el.style.opacity = k < i ? "0.4" : "0.95";
        }
      }
      // Repère pulsé (anneau + point) sur les zones de l'étape courante.
      if (ov) {
        for (const id of steps[i]?.cibles ?? []) {
          const g = geom.get(id);
          if (!g) continue;
          if (!reducedMotion) {
            const ring = document.createElementNS(NS, "circle");
            ring.setAttribute("cx", String(g.cx));
            ring.setAttribute("cy", String(g.cy));
            ring.setAttribute("r", "20");
            ring.setAttribute("fill", "none");
            ring.setAttribute("stroke", g.fill);
            ring.setAttribute("stroke-width", "5");
            ring.setAttribute("class", "reflexo-pulse");
            ov.appendChild(ring);
          }
          const dot = document.createElementNS(NS, "circle");
          dot.setAttribute("cx", String(g.cx));
          dot.setAttribute("cy", String(g.cy));
          dot.setAttribute("r", "9");
          dot.setAttribute("fill", g.fill);
          ov.appendChild(dot);
        }
      }
    },
    [steps, reducedMotion],
  );

  // Redessine à chaque changement d'étape (une fois le SVG prêt).
  useEffect(() => {
    if (ready) drawStep(step);
  }, [ready, step, drawStep]);

  // Lecture auto : avance d'une étape toutes les DUREE_ETAPE, s'arrête à la fin.
  useEffect(() => {
    if (!ready || !playing) return;
    const t = setTimeout(() => {
      setStep((s) => {
        if (s < steps.length - 1) return s + 1;
        setPlaying(false);
        return s;
      });
    }, DUREE_ETAPE);
    return () => clearTimeout(t);
  }, [ready, playing, step, steps.length]);

  const s = steps[step];
  const goPrev = () => {
    setPlaying(false);
    setStep((v) => Math.max(0, v - 1));
  };
  const goNext = () => {
    setPlaying(false);
    setStep((v) => Math.min(steps.length - 1, v + 1));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Lecteur de réflexologie — ${titre}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: BG_PIED,
        color: INK,
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes reflexoPulse {
          0%   { r: 16px; opacity: .9; }
          70%  { r: 38px; opacity: 0; }
          100% { opacity: 0; }
        }
        .reflexo-pulse { animation: reflexoPulse 1.5s ease-out infinite; }
        .reflexo-fade { transition: opacity .35s; }
      `}</style>

      {/* Fermer */}
      <button
        onClick={onClose}
        aria-label="Fermer le lecteur"
        style={{
          position: "absolute",
          top: 12,
          right: 14,
          zIndex: 3,
          width: 38,
          height: 38,
          borderRadius: "50%",
          border: "none",
          background: "rgba(58,50,40,.12)",
          color: INK,
          fontSize: 20,
          lineHeight: 1,
          cursor: "pointer",
        }}
      >
        ×
      </button>

      {/* Invitation à tourner le téléphone (portrait uniquement) */}
      {portrait ? (
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 16,
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            gap: 7,
            fontSize: 12,
            color: EUCAL,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={EUCAL} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="7" y="3" width="10" height="18" rx="2" />
            <path d="M3 12a9 9 0 0 1 3-6M21 12a9 9 0 0 0-3-6" />
          </svg>
          Tourne ton téléphone sur le côté
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          height: "100%",
          alignItems: "stretch",
          flexDirection: portrait ? "column" : "row",
        }}
      >
        {/* Scène : l'illustration des pieds, calée à gauche, fond #DFBEB0 */}
        <div
          style={{
            position: "relative",
            flex: portrait ? "1 1 55%" : "1.7 1 0",
            minWidth: 0,
            minHeight: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <div ref={stageRef} style={{ width: "100%", height: "100%" }} />
          <svg
            ref={overlayRef}
            viewBox="0 0 1264 848"
            preserveAspectRatio="xMidYMid meet"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
            aria-hidden
          />
          {/* Gros bouton lecture au repos */}
          {!playing ? (
            <button
              onClick={() => setPlaying(true)}
              aria-label="Lancer la lecture"
              style={{
                position: "absolute",
                left: "38%",
                top: "50%",
                transform: "translate(-50%,-50%)",
                width: 82,
                height: 82,
                borderRadius: "50%",
                border: "none",
                background: "rgba(58,50,40,.8)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: 4 }}>
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            </button>
          ) : null}
        </div>

        {/* Panneau texte, synchronisé avec l'étape */}
        <div
          style={{
            flex: portrait ? "0 0 auto" : "1 1 0",
            minWidth: portrait ? 0 : 260,
            maxWidth: portrait ? "none" : 440,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: portrait ? "16px 22px 26px" : "32px 40px 32px 12px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: EUCAL,
              marginBottom: 12,
            }}
          >
            {titre} · étape {s?.ordre ?? step + 1} / {steps.length}
          </div>

          <h2
            className="reflexo-fade"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: portrait ? 24 : 30,
              letterSpacing: ".3px",
              margin: "0 0 12px",
              lineHeight: 1.15,
            }}
          >
            {s?.horsPied ? s.designation : nomZone(s?.designation ?? "")}
          </h2>

          <p className="reflexo-fade" style={{ fontSize: portrait ? 16 : 19, lineHeight: 1.45, margin: "0 0 14px" }}>
            {s?.intention}
          </p>

          {s?.desc ? (
            <p className="reflexo-fade" style={{ fontSize: 14, color: EUCAL, lineHeight: 1.5, margin: 0 }}>
              {s.desc}
            </p>
          ) : null}

          {/* Points d'étape */}
          <div style={{ display: "flex", gap: 7, margin: "22px 0 0", flexWrap: "wrap" }}>
            {steps.map((_, k) => (
              <span
                key={k}
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background:
                    k === step
                      ? INK
                      : k < step
                        ? "rgba(58,50,40,.5)"
                        : "rgba(58,50,40,.22)",
                }}
              />
            ))}
          </div>

          {/* Contrôles */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 20 }}>
            <button onClick={goPrev} aria-label="Étape précédente" disabled={step === 0} style={ctlGhost(step === 0)}>
              ◀
            </button>
            <button onClick={() => setPlaying((p) => !p)} style={ctlSolid}>
              {playing ? "Pause ⏸" : "Lecture ▶"}
            </button>
            <button
              onClick={goNext}
              aria-label="Étape suivante"
              disabled={step === steps.length - 1}
              style={ctlGhost(step === steps.length - 1)}
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ctlSolid: React.CSSProperties = {
  border: "none",
  background: INK,
  color: "#fff",
  borderRadius: 11,
  padding: "10px 16px",
  fontSize: 15,
  cursor: "pointer",
};
function ctlGhost(disabled: boolean): React.CSSProperties {
  return {
    border: "none",
    background: "rgba(58,50,40,.12)",
    color: INK,
    borderRadius: 11,
    padding: "10px 14px",
    fontSize: 15,
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.4 : 1,
  };
}

// --- La carte visuelle + déclenchement du lecteur --------------------------

/**
 * Carte « Les zones réflexes, pas à pas » : l'image récapitulative avec un
 * bouton ▶ qui ouvre le lecteur animé en plein écran. Remplace l'ancien bouton
 * inerte. Le titre/sous-titre du bloc restent côté page serveur.
 */
export function ReflexoCarte({
  visuel,
  titre,
  steps,
}: {
  visuel: string;
  titre: string;
  steps: ReflexoAnimStep[];
}) {
  const [open, setOpen] = useState(false);
  const jouable = steps.some((s) => s.cibles.length > 0);

  return (
    <>
      <div
        style={{
          position: "relative",
          borderRadius: 14,
          overflow: "hidden",
          background: BG_PIED,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={visuel}
          alt={`Zones réflexes du protocole ${titre}, numérotées dans l'ordre des étapes`}
          style={{ display: "block", width: "100%", height: "auto" }}
        />
        {jouable ? (
          <button
            onClick={() => setOpen(true)}
            aria-label="Lancer la lecture animée"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                width: 54,
                height: 54,
                borderRadius: "50%",
                background: "rgba(255,255,255,.85)",
                boxShadow: "0 2px 10px rgba(58,50,40,.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill={INK}>
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            </span>
          </button>
        ) : null}
      </div>

      {open ? (
        <ReflexoLecteur steps={steps} titre={titre} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}
