"use client";

// Lecteur animé d'un protocole de Réflexologie — mode paysage.
// Reproduit la maquette validée (reflexologie/maquette-lecteur-paysage.html) :
// l'illustration des pieds calée à gauche (fond #DFBEB0), le texte synchronisé
// sur le côté (nom « Le Cardia » / intention / description), UNE seule zone
// travaillée par étape, animée selon son mouvement.
//
// Rotation : le visuel est TOUJOURS présenté en paysage. Si le téléphone est en
// portrait, on pivote la scène de 90° (on n'attend pas que l'utilisateur tourne
// l'appareil, et le sens ne dépend pas de l'orientation).
//
// Moteur d'animation (consignes CONSIGNES_CLAUDE_CODE_animation_reflexologie.md) :
//  - « points » (pression maintenue) : rendu FIDÈLE — le doigt grossit depuis le
//    centre (easeOut), maintien avec 3 ondes concentriques, puis relâchement.
//  - zones « surface / trait » (glissé, circulaire, spirale, boucles, composite) :
//    coloriage progressif PERSISTANT de la zone (opacité 0.3→0.9, couleur du SVG)
//    + un doigt qui parcourt le tracé de la zone. La géométrie fine bakée dans les
//    prototypes mouvement-*.html sera branchée ici au palier suivant.

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReflexoAnimStep } from "@/lib/reflexologie";

const SVG_URL = "/reflexologie/pieds_bebe_zones_reflexes.svg";
const GEOM_URL = "/reflexologie/mouvements-glisse.json";
const GEOM_TRACE_URL = "/reflexologie/mouvements-trace.json";
const NS = "http://www.w3.org/2000/svg";
// Glissé — vitesse constante (px/ms) et bornes de durée, réglages du prototype.
const GLISSE_VITESSE = 0.105;
const GLISSE_T_MIN = 2000;
const GLISSE_T_MAX = 7000;
const INK = "#3A3228";
const EUCAL = "#6f5f52";
const BG_PIED = "#DFBEB0";

// Pression maintenue — réglages des prototypes (ms).
const T_INTRO = 1000; // la forme reste 1 s en opacité faible avant le geste
const T_POSE = 1000;
const T_MAINTIEN = 3000;
const T_RELACHE = 3000;
const T_RETRAIT = 900;
const T_CYCLE = T_POSE + T_MAINTIEN + T_RELACHE; // 7000
const CYCLES_SIMPLE = 3; // 1 point → 3 passages
const CYCLES_MULTI = 2; // plusieurs points → 2 passages
const POINT_T_INTER = 1000; // transition entre deux points (zones multi-points)
const N_ONDES = 3;
const ONDE_ECART = 1000;
const ONDE_DUREE = 1000;
const ONDE_EXPANSION = 1.5;
const ONDE_OP = 0.38;

// Glissé — réglages du prototype mouvement-pression-glissee.html.
const GLISSE_T_EFFACE = 550; // effacement de la traînée entre 2 passages
const GLISSE_T_FIN = 1200; // temps de maintien de l'état figé avant reprise
const GLISSE_SEUIL_FIN = 0.82; // au-delà, le dernier passage fige la couleur
const OP_TRAINEE = 0.75; // opacité de la traînée (le sillage du doigt)

// Opacités communes (consignes §3).
const OP_REPOS = 0.3; // zone au repos
const OP_FIN = 0.9; // zone terminée (valeur du SVG d'origine)

// Zones « tracé » sans géométrie encore branchée : durée d'un passage.
const PASS_DUR = 3600;

const easeOut = (k: number) => 1 - Math.pow(1 - k, 3);

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

type Point = { cx: number; cy: number; r: number; fill: string };
type CibleInfo = {
  el: SVGGraphicsElement;
  fill: string;
  points: Point[];
  path: SVGPathElement | null;
  len: number;
};

// Médiane validée d'une zone (le trait que suit le doigt), extraite des
// prototypes → reflexologie/mouvements-glisse.json.
// Géométrie d'une zone, deux formes :
//  - glissé : médiane échantillonnée (pts = [x, y, épaisseur_locale]) + epMax.
//  - tracé  : chemin baké brut `d` (spirale, boucles, circulaire, composite)
//             suivi via getPointAtLength, avec sa largeur de brosse et sa durée.
type GeomGlisse = { pts: number[][]; epMax: number; passages: number; enchaine?: boolean };
type GeomTrace = { d: string; brush: number; passages: number; duree: number; traineeOp: number };
type Geom = GeomGlisse | GeomTrace;
const estTrace = (g: Geom): g is GeomTrace => "d" in g;

// Position + épaisseur locale sur une polyligne à l'abscisse curviligne k∈[0,1].
function pointSurMediane(m: PreparedMidline, k: number): { x: number; y: number; ep: number } {
  const cible = m.total * Math.max(0, Math.min(1, k));
  let i = 1;
  while (i < m.cum.length && m.cum[i] < cible) i++;
  const a = m.pts[i - 1];
  const b = m.pts[i] ?? m.pts[i - 1];
  const seg = m.cum[i] - m.cum[i - 1] || 1;
  const t = Math.max(0, Math.min(1, (cible - m.cum[i - 1]) / seg));
  const a2 = a[2] ?? 0;
  const b2 = b[2] ?? a2;
  return {
    x: a[0] + (b[0] - a[0]) * t,
    y: a[1] + (b[1] - a[1]) * t,
    ep: a2 + (b2 - a2) * t,
  };
}
type PreparedMidline = { pts: number[][]; cum: number[]; total: number };

function preparerMediane(pts: number[][]): PreparedMidline {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  return { pts, cum, total: cum[cum.length - 1] || 1 };
}

// Rayon du doigt : il épouse la largeur du trait, avec un plancher (§6).
const DOIGT_LARGEUR = 1.15;
const DOIGT_PLANCHER = 0.18;
function rayonDoigt(ep: number, epMax: number): number {
  return Math.max(ep * DOIGT_LARGEUR, epMax * DOIGT_PLANCHER);
}

// Éléments animés créés pour l'étape courante.
type Anim =
  | {
      kind: "points";
      groupe: CibleInfo;
      // Un « point » = un appui (le doigt) + ses 3 ondes. Les zones à plusieurs
      // points (ganglions) se jouent UN POINT À LA FOIS (consignes §5).
      pts: {
        appui: SVGCircleElement;
        r0: number;
        ondes: { el: SVGCircleElement; r0: number; decalage: number }[];
      }[];
      nbCycles: number;
    }
  // Glissé validé : le doigt suit la médiane ; une traînée clippée sur la zone
  // se dévoile à son passage (coloriage), s'efface entre passages, fige à la fin.
  | {
      kind: "glisse";
      groupe: CibleInfo;
      doigt: SVGCircleElement;
      trainee: SVGPathElement;
      trLen: number;
      /** Médiane (glissé) pour la position + l'épaisseur locale ; null pour un tracé baké. */
      med: PreparedMidline | null;
      durAct: number;
      passages: number;
      /** Épaisseur max de la zone (plancher du rayon du doigt, glissé). */
      epMax: number;
      /** Rayon fixe du doigt pour les tracés bakés (spirale, boucles, …). */
      fingerR: number;
      /** Opacité de la traînée (0.60 circulaire, 0.75 ailleurs). */
      trOp: number;
      /** Décalage de départ (ms) : les zones enchaînées démarrent l'une après l'autre. */
      offset: number;
      /** Durée du mouvement complet de cette zone (hors GLISSE_T_FIN). */
      total: number;
    }
  // Zones tracé sans géométrie encore branchée : coloriage progressif seul.
  | { kind: "reveal"; groupe: CibleInfo };

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
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gUnderRef = useRef<SVGGElement | null>(null);
  const gOverRef = useRef<SVGGElement | null>(null);
  const infoRef = useRef<Map<string, CibleInfo>>(new Map());
  const geomRef = useRef<Record<string, Geom>>({});
  const defsRef = useRef<SVGDefsElement | null>(null);
  const animsRef = useRef<Anim[]>([]);
  const stepDurRef = useRef<number>(PASS_DUR * 2);
  const rafRef = useRef<number>(0);
  const t0Ref = useRef<number>(0);
  const stepRef = useRef<number>(0);
  const playingRef = useRef<boolean>(false);
  const allCiblesRef = useRef<string[]>([]);

  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [portrait, setPortrait] = useState(false);

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  if (allCiblesRef.current.length === 0) {
    allCiblesRef.current = Array.from(new Set(steps.flatMap((s) => s.cibles)));
  }


  // Verrou du défilement + Échap + suivi de l'orientation.
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

  // Lit les cercles (points) et le tracé d'une zone directement dans le SVG.
  const lireCible = useCallback((svg: SVGSVGElement, id: string): CibleInfo | null => {
    const el = svg.getElementById(id) as SVGGraphicsElement | null;
    if (!el) return null;
    const couleur = (node: Element): string => {
      let f = getComputedStyle(node).fill;
      if (!f || f === "none" || f === "rgb(0, 0, 0)") {
        const s = getComputedStyle(node).stroke;
        if (s && s !== "none") f = s;
      }
      return f || INK;
    };
    const circles = Array.from(el.querySelectorAll("circle"));
    const points: Point[] = circles.map((c) => ({
      cx: parseFloat(c.getAttribute("cx") || "0"),
      cy: parseFloat(c.getAttribute("cy") || "0"),
      r: parseFloat(c.getAttribute("r") || "0"),
      fill: couleur(c),
    }));
    const path = el.querySelector("path");
    let len = 0;
    if (path) {
      try {
        len = path.getTotalLength();
      } catch {
        len = 0;
      }
    }
    return { el, fill: couleur(el.querySelector("*") ?? el), points, path, len };
  }, []);

  // Géométrie validée des mouvements (glissé + tracés) — chargée une fois.
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(GEOM_URL).then((r) => (r.ok ? r.json() : {})).catch(() => ({})),
      fetch(GEOM_TRACE_URL).then((r) => (r.ok ? r.json() : {})).catch(() => ({})),
    ]).then(([glisse, trace]) => {
      if (!cancelled) geomRef.current = { ...glisse, ...trace } as Record<string, Geom>;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Injection du SVG + préparation des groupes de dessin.
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
        svgRef.current = svg;

        // Groupes de dessin : ondes SOUS les zones, traînée + doigt AU-DESSUS.
        const firstZone = svg.querySelector('g[id^="zone-"]');
        const gUnder = document.createElementNS(NS, "g");
        const gOver = document.createElementNS(NS, "g");
        if (firstZone) svg.insertBefore(gUnder, firstZone);
        else svg.appendChild(gUnder);
        svg.appendChild(gOver);
        gUnderRef.current = gUnder;
        gOverRef.current = gOver;
        const defs = document.createElementNS(NS, "defs");
        svg.appendChild(defs);
        defsRef.current = defs;

        // Le fond = l'illustration des pieds SEULE. On masque TOUTES les zones
        // du SVG (75+), pas seulement celles du protocole, sinon les autres
        // zones coloriées restent visibles et l'écran devient illisible.
        svg.querySelectorAll<SVGGraphicsElement>('g[id^="zone-"]').forEach((g) => {
          g.style.display = "none";
        });

        const info = new Map<string, CibleInfo>();
        for (const id of allCiblesRef.current) {
          const ci = lireCible(svg, id);
          if (ci) info.set(id, ci);
        }
        infoRef.current = info;
        setReady(true);
      })
      .catch(() => {
        /* illustration indisponible : le texte reste lisible */
      });
    return () => {
      cancelled = true;
    };
  }, [lireCible]);

  // Prépare les éléments animés de l'étape i (une seule zone travaillée).
  const setupStep = useCallback(
    (i: number) => {
      const svg = svgRef.current;
      const gUnder = gUnderRef.current;
      const gOver = gOverRef.current;
      const info = infoRef.current;
      if (!svg || !gUnder || !gOver) return;
      while (gUnder.firstChild) gUnder.removeChild(gUnder.firstChild);
      while (gOver.firstChild) gOver.removeChild(gOver.firstChild);
      // Une seule zone à la fois : on masque tout, on révèle l'étape courante.
      info.forEach((ci) => {
        ci.el.style.display = "none";
        ci.el.style.opacity = "";
      });

      const anims: Anim[] = [];
      const s = steps[i];
      if (!s) {
        animsRef.current = anims;
        return;
      }
      const defs = defsRef.current;
      const points = s.mouvement === "pression-maintenue";
      // Zones enchaînées (gros intestin) : les pieds se jouent l'un APRÈS l'autre
      // (pied droit -d puis pied gauche -g), pas simultanément. On accumule un
      // décalage de départ dans l'ordre des cibles (déjà -d avant -g).
      let enchaineOffset = 0;
      for (const id of s.cibles) {
        const ci = info.get(id);
        if (!ci) continue;
        ci.el.style.display = "";
        ci.el.style.opacity = String(OP_REPOS);
        const geom = geomRef.current[id];

        if (points && ci.points.length > 0 && !reducedMotion) {
          // PRESSION MAINTENUE : chaque point = un appui (doigt) + 3 ondes.
          const pts: {
            appui: SVGCircleElement;
            r0: number;
            ondes: { el: SVGCircleElement; r0: number; decalage: number }[];
          }[] = [];
          for (const p of ci.points) {
            const a = document.createElementNS(NS, "circle");
            a.setAttribute("cx", String(p.cx));
            a.setAttribute("cy", String(p.cy));
            a.setAttribute("r", "0");
            a.setAttribute("fill", p.fill);
            gOver.appendChild(a);
            const ondes: { el: SVGCircleElement; r0: number; decalage: number }[] = [];
            for (let o = 0; o < N_ONDES; o++) {
              const w = document.createElementNS(NS, "circle");
              w.setAttribute("cx", String(p.cx));
              w.setAttribute("cy", String(p.cy));
              w.setAttribute("fill", p.fill);
              w.setAttribute("opacity", "0");
              gUnder.appendChild(w);
              ondes.push({ el: w, r0: p.r, decalage: o * ONDE_ECART });
            }
            pts.push({ appui: a, r0: p.r, ondes });
          }
          const nbCycles = ci.points.length > 1 ? CYCLES_MULTI : CYCLES_SIMPLE;
          anims.push({ kind: "points", groupe: ci, pts, nbCycles });
        } else if (geom && defs && !reducedMotion) {
          // MOUVEMENT « TRACÉ » : le doigt suit une trajectoire validée ; une
          // traînée large clippée sur la zone se dévoile à son passage, s'efface
          // entre passages, fige à la fin. Deux sources de trajectoire :
          //  - glissé : médiane échantillonnée (+ épaisseur locale du doigt) ;
          //  - spirale/boucles/circulaire/composite : chemin baké brut `d`.
          let med: PreparedMidline | null = null;
          let traineeD: string;
          let brush: number;
          let durAct: number;
          let trOp: number;
          let epMax = 0;
          let fingerR = 0;
          let passages: number;
          let enchaine = false;
          if (estTrace(geom)) {
            traineeD = geom.d;
            brush = geom.brush;
            durAct = geom.duree;
            trOp = geom.traineeOp;
            fingerR = Math.max(10, brush * 0.42);
            passages = geom.passages || 3;
          } else {
            if (geom.pts.length <= 1) {
              anims.push({ kind: "reveal", groupe: ci });
              continue;
            }
            med = preparerMediane(geom.pts);
            traineeD = "M " + med.pts.map((p) => `${p[0]} ${p[1]}`).join(" L ");
            epMax = geom.epMax;
            brush = Math.max(epMax * 1.5, 22);
            durAct = Math.max(GLISSE_T_MIN, Math.min(GLISSE_T_MAX, med.total / GLISSE_VITESSE));
            trOp = OP_TRAINEE;
            passages = geom.passages || 3;
            enchaine = geom.enchaine === true;
          }
          // Clip = la forme exacte de la zone (aucun débordement).
          const clip = document.createElementNS(NS, "clipPath");
          const clipId = `rfxclip-${id}`;
          clip.setAttribute("id", clipId);
          ci.el.querySelectorAll("path").forEach((pth) => {
            const cp = document.createElementNS(NS, "path");
            cp.setAttribute("d", pth.getAttribute("d") || "");
            clip.appendChild(cp);
          });
          defs.appendChild(clip);
          // Traînée large, clippée sur la zone.
          const trainee = document.createElementNS(NS, "path");
          trainee.setAttribute("d", traineeD);
          trainee.setAttribute("fill", "none");
          trainee.setAttribute("stroke", ci.fill);
          trainee.setAttribute("stroke-width", String(brush));
          trainee.setAttribute("stroke-linecap", "round");
          trainee.setAttribute("stroke-linejoin", "round");
          trainee.setAttribute("clip-path", `url(#${clipId})`);
          trainee.setAttribute("opacity", "0");
          gOver.appendChild(trainee);
          const trLen = trainee.getTotalLength();
          trainee.style.strokeDasharray = String(trLen);
          trainee.style.strokeDashoffset = String(trLen);
          // Doigt (au-dessus de la traînée).
          const doigt = document.createElementNS(NS, "circle");
          const p0 = med ? pointSurMediane(med, 0) : trainee.getPointAtLength(0);
          doigt.setAttribute("cx", String(p0.x));
          doigt.setAttribute("cy", String(p0.y));
          doigt.setAttribute("r", String(med ? rayonDoigt((p0 as { ep: number }).ep, epMax) : fingerR));
          doigt.setAttribute("fill", ci.fill);
          doigt.setAttribute("opacity", "0");
          gOver.appendChild(doigt);
          const total = (passages - 1) * (durAct + GLISSE_T_EFFACE) + durAct;
          // Enchaînement (gros intestin) : démarre après les précédentes du groupe.
          const offset = enchaine ? enchaineOffset : 0;
          if (enchaine) enchaineOffset += total;
          anims.push({
            kind: "glisse",
            groupe: ci,
            doigt,
            trainee,
            trLen,
            med,
            durAct,
            passages,
            epMax,
            fingerR,
            trOp,
            offset,
            total,
          });
        } else {
          // Aucune géométrie (ne devrait plus arriver) : coloriage progressif.
          anims.push({ kind: "reveal", groupe: ci });
        }
      }
      animsRef.current = anims;

      // Durée totale de l'étape = durée réelle du mouvement (lecture auto).
      let dur = PASS_DUR * 2;
      for (const a of anims) {
        if (a.kind === "points") {
          const P = a.pts.length;
          dur = Math.max(
            dur,
            T_INTRO + P * a.nbCycles * T_CYCLE + (P - 1) * POINT_T_INTER,
          );
        } else if (a.kind === "glisse")
          // offset + durée du mouvement (les zones enchaînées s'additionnent).
          dur = Math.max(dur, a.offset + a.total + GLISSE_T_FIN);
      }
      stepDurRef.current = dur;
      t0Ref.current = performance.now();
    },
    [steps, reducedMotion],
  );

  // Rendu d'une frame en fonction du temps écoulé dans l'étape.
  const renderFrame = useCallback((elapsed: number) => {
    for (const a of animsRef.current) {
      if (a.kind === "points") {
        // Un point au repos (appui éteint, ondes éteintes).
        const eteindre = (pt: (typeof a.pts)[number]) => {
          pt.appui.setAttribute("r", "0");
          pt.ondes.forEach((o) => o.el.setAttribute("opacity", "0"));
        };
        // Anime un point à l'instant tc∈[0,T_CYCLE] : pose (doigt grossit) +
        // maintien 3 s avec 3 ondes + relâchement.
        const animer = (pt: (typeof a.pts)[number], tc: number) => {
          const finMaintien = T_POSE + T_MAINTIEN;
          let rk: number;
          if (tc < T_POSE) rk = easeOut(tc / T_POSE);
          else if (tc < finMaintien) rk = 1;
          else rk = 1 - easeOut(Math.min((tc - finMaintien) / T_RETRAIT, 1));
          pt.appui.setAttribute("r", String(pt.r0 * rk));
          pt.ondes.forEach((o) => {
            // Le rayonnement ne démarre qu'une fois le disque plein (à T_POSE).
            const tw = tc - (T_POSE + o.decalage);
            if (tw < 0 || tw > ONDE_DUREE) {
              o.el.setAttribute("opacity", "0");
              return;
            }
            const p = tw / ONDE_DUREE;
            o.el.setAttribute("r", String(o.r0 * (1 + (ONDE_EXPANSION - 1) * easeOut(p))));
            o.el.setAttribute("opacity", String(ONDE_OP * (1 - p)));
          });
        };

        // 1 s de forme au repos avant tout geste (consigne).
        if (elapsed < T_INTRO) {
          a.pts.forEach(eteindre);
          continue;
        }
        const te = elapsed - T_INTRO;
        const bloc = a.nbCycles * T_CYCLE; // durée d'un point (tous ses passages)
        const unite = bloc + POINT_T_INTER; // + transition vers le point suivant
        const P = a.pts.length;
        // Point actif : un seul à la fois, du gros orteil vers l'extérieur.
        let pIndex = 0;
        let t = te;
        while (pIndex < P - 1 && t >= unite) {
          t -= unite;
          pIndex++;
        }
        a.pts.forEach((pt, i) => {
          if (i !== pIndex) {
            eteindre(pt);
            return;
          }
          if (t < bloc) animer(pt, t % T_CYCLE); // dans ses passages
          else eteindre(pt); // en transition vers le point suivant
        });
      } else if (a.kind === "glisse") {
        const { durAct, passages: P, trLen, total } = a;
        // Enchaînement : cette zone attend son tour (décalage), invisible avant.
        const le = elapsed - a.offset;
        if (le < 0) {
          a.groupe.el.style.opacity = "0";
          a.trainee.setAttribute("opacity", "0");
          a.doigt.setAttribute("opacity", "0");
          continue;
        }
        const segFull = durAct + GLISSE_T_EFFACE;
        if (le >= total) {
          // État figé : la zone reste coloriée (OP_FIN), traînée et doigt éteints.
          a.groupe.el.style.opacity = String(OP_FIN);
          a.trainee.setAttribute("opacity", "0");
          a.doigt.setAttribute("opacity", "0");
          continue;
        }
        // Passage courant.
        let t = le;
        let p = 0;
        while (p < P - 1 && t >= segFull) {
          t -= segFull;
          p++;
        }
        const dernier = p === P - 1;
        if (t < durAct) {
          // GLISSE : le doigt avance, la traînée se dévoile à sa suite.
          const k = t / durAct;
          const actif = k > 0.004 && k < 0.999; // anti-artefact : rien au tout début/fin
          // Position + rayon : médiane (avec épaisseur locale) ou tracé baké.
          if (a.med) {
            const pt = pointSurMediane(a.med, k);
            a.doigt.setAttribute("cx", String(pt.x));
            a.doigt.setAttribute("cy", String(pt.y));
            a.doigt.setAttribute("r", String(rayonDoigt(pt.ep, a.epMax))); // épouse le trait
          } else {
            const pt = a.trainee.getPointAtLength(trLen * k);
            a.doigt.setAttribute("cx", String(pt.x));
            a.doigt.setAttribute("cy", String(pt.y));
            a.doigt.setAttribute("r", String(a.fingerR));
          }
          a.doigt.setAttribute("opacity", actif ? "1" : "0");
          a.trainee.style.strokeDashoffset = String(trLen * (1 - k));
          if (dernier && k > GLISSE_SEUIL_FIN) {
            // Fin : la zone monte vers OP_FIN, la traînée se résorbe (fondu croisé).
            const v = (k - GLISSE_SEUIL_FIN) / (1 - GLISSE_SEUIL_FIN);
            a.groupe.el.style.opacity = String(OP_REPOS + (OP_FIN - OP_REPOS) * v);
            a.trainee.setAttribute("opacity", String(a.trOp * (1 - v)));
          } else {
            a.groupe.el.style.opacity = String(OP_REPOS);
            // Traînée cachée tant que le geste n'a rien dévoilé (disque fantôme).
            a.trainee.setAttribute("opacity", k > 0.004 ? String(a.trOp) : "0");
          }
        } else {
          // EFFACEMENT de la traînée avant le passage suivant (forme au repos).
          const e = Math.min((t - durAct) / GLISSE_T_EFFACE, 1);
          a.doigt.setAttribute("opacity", "0");
          a.trainee.setAttribute("opacity", String(a.trOp * (1 - e)));
          a.groupe.el.style.opacity = String(OP_REPOS);
        }
      } else {
        // Coloriage progressif seul.
        const opad = Math.min(OP_REPOS + (OP_FIN - OP_REPOS) * (elapsed / PASS_DUR), OP_FIN);
        a.groupe.el.style.opacity = String(opad);
      }
    }
  }, []);

  // Boucle d'animation continue (une seule pour toute la durée de vie du lecteur).
  useEffect(() => {
    if (!ready) return;
    const loop = (now: number) => {
      rafRef.current = requestAnimationFrame(loop);
      if (!playingRef.current) {
        t0Ref.current = now; // gel en pause
        return;
      }
      renderFrame(now - t0Ref.current);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ready, renderFrame]);

  // (Re)prépare l'étape quand elle change ou dès que le SVG est prêt.
  useEffect(() => {
    stepRef.current = step;
    if (ready) setupStep(step);
  }, [ready, step, setupStep]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  // Lecture auto : avance quand le mouvement de l'étape est terminé (durée réelle
  // calculée dans setupStep → stepDurRef), s'arrête à la dernière étape.
  useEffect(() => {
    if (!ready || !playing) return;
    const t = setTimeout(() => {
      setStep((s) => {
        if (s < steps.length - 1) return s + 1;
        setPlaying(false);
        return s;
      });
    }, stepDurRef.current);
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

  // Scène + panneau, en paysage. En portrait, on pivote l'ensemble de 90°.
  const player = (
    <div style={{ display: "flex", height: "100%", width: "100%", alignItems: "stretch" }}>
      {/* Scène : illustration des pieds, calée à gauche, fond #DFBEB0 */}
      <div
        style={{
          position: "relative",
          flex: "1.7 1 0",
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <div ref={stageRef} style={{ width: "100%", height: "100%" }} />
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

      {/* Panneau texte, synchronisé */}
      <div
        style={{
          flex: "1 1 0",
          minWidth: 240,
          maxWidth: 460,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "28px 36px 28px 14px",
        }}
      >
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "2px", color: EUCAL, marginBottom: 12 }}>
          {titre} · étape {s?.ordre ?? step + 1} / {steps.length}
        </div>
        <h2
          className="reflexo-fade"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: 30,
            letterSpacing: ".3px",
            margin: "0 0 12px",
            lineHeight: 1.15,
          }}
        >
          {s?.horsPied ? s.designation : nomZone(s?.designation ?? "")}
        </h2>
        <p className="reflexo-fade" style={{ fontSize: 19, lineHeight: 1.45, margin: "0 0 14px" }}>
          {s?.intention}
        </p>
        {s?.desc ? (
          <p className="reflexo-fade" style={{ fontSize: 14, color: EUCAL, lineHeight: 1.5, margin: 0 }}>
            {s.desc}
          </p>
        ) : null}
        <div style={{ display: "flex", gap: 7, margin: "22px 0 0", flexWrap: "wrap" }}>
          {steps.map((_, k) => (
            <span
              key={k}
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: k === step ? INK : k < step ? "rgba(58,50,40,.5)" : "rgba(58,50,40,.22)",
              }}
            />
          ))}
        </div>
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
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Lecteur de réflexologie — ${titre}`}
      style={{ position: "fixed", inset: 0, zIndex: 60, background: BG_PIED, color: INK, overflow: "hidden" }}
    >
      <style>{`.reflexo-fade { transition: opacity .35s; }`}</style>

      {/* Fermer — sur la couche non pivotée, toujours en haut à droite de l'écran. */}
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
          background: "rgba(58,50,40,.14)",
          color: INK,
          fontSize: 20,
          lineHeight: 1,
          cursor: "pointer",
        }}
      >
        ×
      </button>

      {/* Le visuel est toujours en paysage : rotation de la scène si portrait. */}
      {portrait ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100vh",
            height: "100vw",
            transform: "translate(-50%,-50%) rotate(90deg)",
            transformOrigin: "center center",
          }}
        >
          {player}
        </div>
      ) : (
        <div style={{ width: "100%", height: "100%" }}>{player}</div>
      )}
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
 * bouton ▶ qui ouvre le lecteur animé en plein écran.
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
      <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", background: BG_PIED }}>
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

      {open ? <ReflexoLecteur steps={steps} titre={titre} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
