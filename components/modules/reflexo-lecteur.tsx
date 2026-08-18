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

// Pression circulaire (tête) — réglages du prototype mouvement-zone-tete.html.
// Un orteil à la fois (gros → petit), 3 tours par orteil ; l'orteil se colorie
// au passage du doigt (traînée plus transparente car le doigt repasse 3 fois),
// se fige à 0.90 en fin de parcours, puis on passe au suivant.
// Durée d'un orteil : interpolée entre MIN (petit orteil) et MAX (gros orteil)
// selon la longueur de son tracé. Le gros orteil dure 5 s ; les petits orteils
// gardent un « juste milieu » (~4 s) plutôt qu'une durée proportionnelle qui les
// rendrait trop rapides.
const CIRC_T_ORTEIL_MIN = 4000; // durée du plus PETIT orteil
const CIRC_T_ORTEIL_MAX = 5000; // durée du plus GRAND orteil (gros orteil)
const CIRC_T_PAUSE = 500; // respiration entre deux orteils
const CIRC_SEUIL_FIN = 0.78; // à partir d'où l'orteil se fige (fondu croisé)
const CIRC_OP_TRAINEE = 0.6; // traînée plus transparente (repassages, §3)

// Système urinaire — mouvement composite (§14 quater) : maintenue vessie →
// glissée lente → maintenue rein, répété `passages` fois. Réglages des pressions
// maintenues repris du prototype ; la glissée entre les deux points est LENTE.
const U_POSE = 1000; // le disque grandit depuis le centre (easeOut)
const U_MAINT = 3000; // maintien + 3 ondes
const U_GLISSE = 2900; // glissée lente vessie → rein
const U_FINGER_R = 16; // rayon du doigt pendant la glissée

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
      /**
       * Écart (ms) entre deux passages successifs de CETTE zone. Vaut la durée
       * d'un passage (durAct + effacement) en temps normal ; pour le gros
       * intestin (`enchaine`) les deux pieds sont ENTRELACÉS — un « mouvement » =
       * pied droit puis pied gauche — donc chaque pied attend que l'autre ait
       * fini son passage avant le sien : stride = nbPieds × durée d'un passage.
       */
      stride: number;
      /** Sens inverse (Diarrhée) : trajectoire parcourue depuis la fin. */
      reverse: boolean;
    }
  // Système urinaire — mouvement COMPOSITE en 3 temps, répété `passages` fois
  // (§14 quater) : pression maintenue ~3 s sur la VESSIE (point bas) → pression
  // glissée LENTE vessie→rein le long du trait → pression maintenue ~3 s sur le
  // REIN (point haut). Chaque appui = un disque + 3 ondes (comme pression-maintenue).
  | {
      kind: "urinaire";
      groupe: CibleInfo;
      trait: SVGPathElement;
      traitLen: number;
      doigt: SVGCircleElement;
      fingerR: number;
      vessie: UrinairePoint;
      rein: UrinairePoint;
      passages: number;
    }
  // Pression circulaire (tête) : les orteils se travaillent UN À UN (gros → petit),
  // 3 tours chacun ; l'orteil se colorie au passage puis se fige, on passe au suivant.
  | { kind: "circulaire"; groupe: CibleInfo; orteils: Orteil[] }
  // Zones tracé sans géométrie encore branchée : coloriage progressif seul.
  | { kind: "reveal"; groupe: CibleInfo };

type Orteil = {
  fill: SVGGraphicsElement; // la forme de l'orteil (opacité pilotée à part)
  trail: SVGPathElement; // le tracé circulaire (3 tours), clippé sur l'orteil
  trailLen: number;
  doigt: SVGCircleElement;
  fingerR: number;
  dur: number; // durée de cet orteil (∝ longueur du tracé, vitesse constante)
};

type UrinairePoint = {
  appui: SVGCircleElement;
  r0: number;
  cx: number;
  cy: number;
  ondes: { el: SVGCircleElement; r0: number; decalage: number }[];
};

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
  // La géométrie est chargée en asynchrone : tant qu'elle n'est pas là, une zone
  // glissée/tracée n'a pas de doigt (elle retombe sur le simple coloriage). On
  // suit son arrivée pour REJOUER la préparation de l'étape courante (sinon le
  // TOUT PREMIER mouvement s'affiche sans doigt tant qu'on n'a pas changé d'étape).
  const [geomReady, setGeomReady] = useState(false);
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
      if (!cancelled) {
        geomRef.current = { ...glisse, ...trace } as Record<string, Geom>;
        setGeomReady(true);
      }
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
      // Séquençage. Par défaut, toutes les zones de l'étape jouent ENSEMBLE.
      // Si `gestesEnchaines`, les GROUPES (zones) s'enchaînent l'un APRÈS l'autre
      // (§8, ex. bassin : d'abord la spirale, puis le glissé de l'ancrage).
      // Dans un groupe, les deux pieds jouent ensemble — sauf gros intestin
      // (`enchaine`), pied par pied ; en sens INVERSE (Diarrhée), ordre inversé.
      let groupeOffset = 0;
      for (const grp of s.groupes) {
        let grpDuree = 0;
        const grpCibles = s.inverse ? [...grp].reverse() : grp;
        let foisIndex = -1; // rang du pied dans le groupe (entrelacement enchaîné)
        for (const id of grpCibles) {
          foisIndex++;
          const ci = info.get(id);
          if (!ci) continue;
          ci.el.style.display = "";
          ci.el.style.opacity = String(OP_REPOS);
          const geom = geomRef.current[id];

        if (id.includes("tete") && geom && estTrace(geom) && defs && !reducedMotion) {
          // PRESSION CIRCULAIRE (tête) : le tracé baké concatène les 5 orteils
          // (sous-tracés « M … »). On les joue UN À UN (gros → petit), 3 tours
          // chacun ; chaque orteil se colorie au passage du doigt puis se fige à
          // 0.90, avant de passer au suivant. La forme (fill) de chaque orteil est
          // pilotée séparément → les orteils « en amont » restent transparents.
          ci.el.style.opacity = "1"; // opacité pilotée orteil par orteil
          const subs = geom.d.split(/(?=M)/).map((s) => s.trim()).filter(Boolean);
          const fills = Array.from(ci.el.querySelectorAll<SVGGraphicsElement>("path"));
          // Prépare chaque sous-tracé (longueur + milieu, pour l'appairage).
          const traces = subs.map((d) => {
            const tmp = document.createElementNS(NS, "path");
            tmp.setAttribute("d", d);
            gOver.appendChild(tmp);
            const len = tmp.getTotalLength();
            const mid = tmp.getPointAtLength(len / 2);
            gOver.removeChild(tmp);
            return { d, len, mid };
          });
          // Durée d'un orteil interpolée entre MIN (petit) et MAX (gros) selon la
          // longueur de son tracé : le gros orteil = 5 s, le petit ≈ 4 s.
          const lenMax = traces.reduce((m, t) => Math.max(m, t.len), 0) || 1;
          const lenMin = traces.reduce((m, t) => Math.min(m, t.len), Infinity);
          const lenSpan = lenMax - lenMin || 1;
          const usedFill = new Set<number>();
          const orteils: Orteil[] = [];
          for (const tr of traces) {
            // Appaire le sous-tracé à l'orteil (forme) le PLUS PROCHE (robuste à
            // l'ordre des <path> dans le SVG).
            let best = -1;
            let bestDist = Infinity;
            fills.forEach((fp, k) => {
              if (usedFill.has(k)) return;
              const b = fp.getBBox();
              const dx = b.x + b.width / 2 - tr.mid.x;
              const dy = b.y + b.height / 2 - tr.mid.y;
              const dist = dx * dx + dy * dy;
              if (dist < bestDist) {
                bestDist = dist;
                best = k;
              }
            });
            const fill = best >= 0 ? fills[best] : ci.el;
            if (best >= 0) usedFill.add(best);
            const bb = (fill as SVGGraphicsElement).getBBox();
            const rmax = (Math.max(bb.width, bb.height) / 2) * 1.15;
            const fingerR = Math.max(9, rmax * 0.55); // doigt très légèrement agrandi
            fill.style.opacity = String(OP_REPOS);
            // Clip du tracé/doigt sur la forme de l'orteil.
            const clip = document.createElementNS(NS, "clipPath");
            const clipId = `rfxclip-tete-${id}-${orteils.length}`;
            clip.setAttribute("id", clipId);
            const cp = document.createElementNS(NS, "path");
            cp.setAttribute("d", fill.getAttribute("d") || "");
            clip.appendChild(cp);
            defs.appendChild(clip);
            const trail = document.createElementNS(NS, "path");
            trail.setAttribute("d", tr.d);
            trail.setAttribute("fill", "none");
            trail.setAttribute("stroke", ci.fill);
            trail.setAttribute("stroke-width", String(Math.max(fingerR * 2, 18)));
            trail.setAttribute("stroke-linecap", "round");
            trail.setAttribute("stroke-linejoin", "round");
            trail.setAttribute("clip-path", `url(#${clipId})`);
            trail.setAttribute("opacity", "0");
            gOver.appendChild(trail);
            trail.style.strokeDasharray = String(tr.len);
            trail.style.strokeDashoffset = String(tr.len);
            const doigt = document.createElementNS(NS, "circle");
            doigt.setAttribute("r", String(fingerR));
            doigt.setAttribute("fill", ci.fill);
            doigt.setAttribute("clip-path", `url(#${clipId})`);
            doigt.setAttribute("opacity", "0");
            gOver.appendChild(doigt);
            orteils.push({
              fill,
              trail,
              trailLen: tr.len,
              doigt,
              fingerR,
              dur:
                CIRC_T_ORTEIL_MIN +
                (CIRC_T_ORTEIL_MAX - CIRC_T_ORTEIL_MIN) * ((tr.len - lenMin) / lenSpan),
            });
          }
          anims.push({ kind: "circulaire", groupe: ci, orteils });
          grpDuree = Math.max(
            grpDuree,
            orteils.reduce((s, o) => s + o.dur + CIRC_T_PAUSE, 0),
          );
        } else if (id.includes("systeme-urinaire") && ci.points.length >= 2 && defs && !reducedMotion) {
          // SYSTÈME URINAIRE — composite (§14 quater). Deux points : vessie (le
          // plus BAS = cy max) et rein (le plus HAUT = cy min). On construit un
          // trait vessie→rein (pas de clip : la zone n'a que 2 cercles, aucune
          // forme à écrêter), un doigt pour la glissée, et pour chaque point un
          // appui + 3 ondes (mécanique pression-maintenue).
          const tries = [...ci.points].sort((a, b) => b.cy - a.cy);
          const vessieP = tries[0]; // cy le plus grand → bas du pied
          const reinP = tries[tries.length - 1]; // cy le plus petit → haut
          const faireOndes = (cx: number, cy: number, r: number) => {
            const ondes: { el: SVGCircleElement; r0: number; decalage: number }[] = [];
            for (let o = 0; o < N_ONDES; o++) {
              const w = document.createElementNS(NS, "circle");
              w.setAttribute("cx", String(cx));
              w.setAttribute("cy", String(cy));
              w.setAttribute("fill", ci.fill);
              w.setAttribute("opacity", "0");
              gUnder.appendChild(w);
              ondes.push({ el: w, r0: r, decalage: o * ONDE_ECART });
            }
            return ondes;
          };
          const faireAppui = (p: Point): UrinairePoint => {
            const a = document.createElementNS(NS, "circle");
            a.setAttribute("cx", String(p.cx));
            a.setAttribute("cy", String(p.cy));
            a.setAttribute("r", "0");
            a.setAttribute("fill", p.fill);
            gOver.appendChild(a);
            return { appui: a, r0: p.r, cx: p.cx, cy: p.cy, ondes: faireOndes(p.cx, p.cy, p.r) };
          };
          const vessie = faireAppui(vessieP);
          const rein = faireAppui(reinP);
          // Trait vessie→rein (le doigt le colorie pendant la glissée).
          const trait = document.createElementNS(NS, "path");
          trait.setAttribute("d", `M ${vessie.cx} ${vessie.cy} L ${rein.cx} ${rein.cy}`);
          trait.setAttribute("fill", "none");
          trait.setAttribute("stroke", ci.fill);
          trait.setAttribute("stroke-width", String(Math.max(vessie.r0, rein.r0) * 1.4));
          trait.setAttribute("stroke-linecap", "round");
          trait.setAttribute("opacity", "0");
          gOver.insertBefore(trait, vessie.appui); // trait SOUS les appuis
          const traitLen = trait.getTotalLength();
          trait.style.strokeDasharray = String(traitLen);
          trait.style.strokeDashoffset = String(traitLen);
          const doigt = document.createElementNS(NS, "circle");
          doigt.setAttribute("r", String(U_FINGER_R));
          doigt.setAttribute("fill", ci.fill);
          doigt.setAttribute("opacity", "0");
          gOver.appendChild(doigt);
          const passages = geom && "passages" in geom ? geom.passages : 3;
          anims.push({
            kind: "urinaire",
            groupe: ci,
            trait,
            traitLen,
            doigt,
            fingerR: U_FINGER_R,
            vessie,
            rein,
            passages,
          });
          const cycle = 2 * (U_POSE + U_MAINT) + U_GLISSE;
          grpDuree = Math.max(grpDuree, passages * cycle);
        } else if (points && ci.points.length > 0 && !reducedMotion) {
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
          const nbP = ci.points.length;
          grpDuree = Math.max(grpDuree, T_INTRO + nbP * nbCycles * T_CYCLE + (nbP - 1) * POINT_T_INTER);
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
          // Zone dessinée AU TRAIT (fill:none, ex. thyroïde) : la traînée EST un
          // trait de la largeur de la zone → PAS de clip (clipper un tracé sans
          // remplissage crée une région fantôme à côté). Sinon : clip sur la forme.
          const pathEl = ci.el.querySelector("path");
          const stroked = pathEl ? getComputedStyle(pathEl).fill === "none" : false;
          if (stroked && pathEl) {
            const sw = parseFloat(getComputedStyle(pathEl).strokeWidth);
            if (sw) brush = sw;
          }
          // Le doigt COIFFE la traînée (même largeur) : le trait coloré ne le
          // dépasse jamais. (Glissé : demi-brosse ; tracés bakés : un peu moins.)
          fingerR = med ? brush / 2 : Math.max(10, brush * 0.42);

          let clipId = "";
          if (!stroked) {
            const clip = document.createElementNS(NS, "clipPath");
            clipId = `rfxclip-${id}`;
            clip.setAttribute("id", clipId);
            ci.el.querySelectorAll("path").forEach((pth) => {
              const cp = document.createElementNS(NS, "path");
              cp.setAttribute("d", pth.getAttribute("d") || "");
              clip.appendChild(cp);
            });
            defs.appendChild(clip);
          }
          // Traînée large (clippée sur la zone, sauf zone au trait).
          const trainee = document.createElementNS(NS, "path");
          trainee.setAttribute("d", traineeD);
          trainee.setAttribute("fill", "none");
          trainee.setAttribute("stroke", ci.fill);
          trainee.setAttribute("stroke-width", String(brush));
          trainee.setAttribute("stroke-linecap", "round");
          trainee.setAttribute("stroke-linejoin", "round");
          if (clipId) trainee.setAttribute("clip-path", `url(#${clipId})`);
          trainee.setAttribute("opacity", "0");
          gOver.appendChild(trainee);
          const trLen = trainee.getTotalLength();
          trainee.style.strokeDasharray = String(trLen);
          trainee.style.strokeDashoffset = String(trLen);
          // Doigt (au-dessus de la traînée), de la largeur de la traînée. Clippé
          // sur la forme de la zone (sauf zone au trait) : l'empreinte RESTE dans
          // la zone, elle ne déborde jamais du contour (ex. orteils de la tête).
          const doigt = document.createElementNS(NS, "circle");
          const p0 = med ? pointSurMediane(med, 0) : trainee.getPointAtLength(0);
          doigt.setAttribute("cx", String(p0.x));
          doigt.setAttribute("cy", String(p0.y));
          doigt.setAttribute("r", String(fingerR));
          doigt.setAttribute("fill", ci.fill);
          if (clipId) doigt.setAttribute("clip-path", `url(#${clipId})`);
          doigt.setAttribute("opacity", "0");
          gOver.appendChild(doigt);
          const segFull = durAct + GLISSE_T_EFFACE; // durée d'un passage
          // Gros intestin (`enchaine`) : les deux pieds sont ENTRELACÉS — un
          // « mouvement » = pied droit PUIS pied gauche, le tout répété `passages`
          // fois (droit+gauche / droit+gauche / droit+gauche). Chaque pied joue
          // donc un passage tous les `stride` = nbPieds × segFull, décalé de son
          // rang `foisIndex` dans le groupe. Sans enchaînement : passages
          // consécutifs (stride = segFull), pas de décalage intra-groupe.
          const stride = enchaine ? grpCibles.length * segFull : segFull;
          const withinOffset = enchaine ? foisIndex * segFull : 0;
          const total = (passages - 1) * stride + durAct;
          const offset = groupeOffset + withinOffset;
          grpDuree = Math.max(grpDuree, withinOffset + total);
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
            stride,
            reverse: s.inverse === true,
          });
        } else {
          // Aucune géométrie (ne devrait plus arriver) : coloriage progressif.
          anims.push({ kind: "reveal", groupe: ci });
        }
        }
        // Zones enchaînées : le groupe suivant démarre APRÈS celui-ci (+ un petit
        // temps de repos) — on ne joue jamais les deux mouvements en même temps.
        if (s.gestesEnchaines) groupeOffset += grpDuree + GLISSE_T_FIN;
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
        else if (a.kind === "urinaire") {
          const cycle = 2 * (U_POSE + U_MAINT) + U_GLISSE;
          dur = Math.max(dur, a.passages * cycle + GLISSE_T_FIN);
        } else if (a.kind === "circulaire") {
          dur = Math.max(
            dur,
            a.orteils.reduce((s, o) => s + o.dur + CIRC_T_PAUSE, 0) + GLISSE_T_FIN,
          );
        }
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
        // Enchaînement : cette zone attend son tour (décalage). AVANT son tour,
        // on montre déjà la zone en transparence (OP_REPOS) — les DEUX pieds sont
        // visibles dès le début — mais sans traînée ni doigt.
        const le = elapsed - a.offset;
        if (le < 0) {
          a.groupe.el.style.opacity = String(OP_REPOS);
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
        // Passage courant : un passage tous les `stride` (= segFull sans
        // entrelacement ; = 2×segFull pour le gros intestin, le temps que
        // l'autre pied joue le sien).
        let t = le;
        let p = 0;
        while (p < P - 1 && t >= a.stride) {
          t -= a.stride;
          p++;
        }
        const dernier = p === P - 1;
        if (t < durAct) {
          // GLISSE : le doigt avance, la traînée se dévoile à sa suite.
          const k = t / durAct;
          const actif = k > 0.004 && k < 0.999; // anti-artefact : rien au tout début/fin
          // Sens inverse (Diarrhée) : on parcourt la trajectoire depuis la fin.
          const kk = a.reverse ? 1 - k : k;
          // Position + rayon : médiane (avec épaisseur locale) ou tracé baké.
          const pt = a.med ? pointSurMediane(a.med, kk) : a.trainee.getPointAtLength(trLen * kk);
          a.doigt.setAttribute("cx", String(pt.x));
          a.doigt.setAttribute("cy", String(pt.y));
          a.doigt.setAttribute("r", String(a.fingerR)); // coiffe la traînée
          a.doigt.setAttribute("opacity", actif ? "1" : "0");
          // Dévoilement : depuis la fin du tracé si inverse (décalage négatif).
          a.trainee.style.strokeDashoffset = String(a.reverse ? -trLen * (1 - k) : trLen * (1 - k));
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
        } else if (t < segFull) {
          // EFFACEMENT de la traînée avant le passage suivant (forme au repos).
          const e = Math.min((t - durAct) / GLISSE_T_EFFACE, 1);
          a.doigt.setAttribute("opacity", "0");
          a.trainee.setAttribute("opacity", String(a.trOp * (1 - e)));
          a.groupe.el.style.opacity = String(OP_REPOS);
        } else {
          // ATTENTE (gros intestin entrelacé) : ce pied a fini son passage et
          // patiente pendant que l'AUTRE pied joue le sien. Zone au repos, sans
          // traînée ni doigt. (Sans entrelacement, stride = segFull → ce cas
          // n'arrive jamais.)
          a.doigt.setAttribute("opacity", "0");
          a.trainee.setAttribute("opacity", "0");
          a.groupe.el.style.opacity = String(OP_REPOS);
        }
      } else if (a.kind === "urinaire") {
        // COMPOSITE : maintenue vessie → glissée lente → maintenue rein, ×passages.
        const cycle = 2 * (U_POSE + U_MAINT) + U_GLISSE;
        const totalU = a.passages * cycle;
        const eteindre = (p: UrinairePoint) => {
          p.appui.setAttribute("r", "0");
          p.ondes.forEach((o) => o.el.setAttribute("opacity", "0"));
        };
        // Un appui à l'instant tc∈[0, U_POSE+U_MAINT] : le disque grandit
        // (easeOut) puis se maintient avec 3 ondes.
        const maintenir = (p: UrinairePoint, tc: number) => {
          const rk = tc < U_POSE ? easeOut(tc / U_POSE) : 1;
          p.appui.setAttribute("r", String(p.r0 * rk));
          p.ondes.forEach((o) => {
            const tw = tc - (U_POSE + o.decalage);
            if (tw < 0 || tw > ONDE_DUREE) {
              o.el.setAttribute("opacity", "0");
              return;
            }
            const q = tw / ONDE_DUREE;
            o.el.setAttribute("r", String(o.r0 * (1 + (ONDE_EXPANSION - 1) * easeOut(q))));
            o.el.setAttribute("opacity", String(ONDE_OP * (1 - q)));
          });
        };
        if (elapsed >= totalU) {
          // État figé : la zone reste coloriée, appuis/doigt/trait éteints.
          a.groupe.el.style.opacity = String(OP_FIN);
          eteindre(a.vessie);
          eteindre(a.rein);
          a.doigt.setAttribute("opacity", "0");
          a.trait.setAttribute("opacity", "0");
          continue;
        }
        const tc = elapsed % cycle;
        const dernierCycle = elapsed >= (a.passages - 1) * cycle;
        a.groupe.el.style.opacity = String(OP_REPOS);
        const finMaintien = U_POSE + U_MAINT;
        if (tc < finMaintien) {
          // 1) Maintenue VESSIE.
          maintenir(a.vessie, tc);
          eteindre(a.rein);
          a.doigt.setAttribute("opacity", "0");
          a.trait.setAttribute("opacity", "0");
          a.trait.style.strokeDashoffset = String(a.traitLen);
        } else if (tc < finMaintien + U_GLISSE) {
          // 2) Glissée LENTE vessie → rein : la vessie reste posée, le doigt
          //    remonte, le trait se dévoile (coloriage persistant).
          const k = (tc - finMaintien) / U_GLISSE;
          a.vessie.appui.setAttribute("r", String(a.vessie.r0));
          a.vessie.ondes.forEach((o) => o.el.setAttribute("opacity", "0"));
          eteindre(a.rein);
          const pt = a.trait.getPointAtLength(a.traitLen * k);
          a.doigt.setAttribute("cx", String(pt.x));
          a.doigt.setAttribute("cy", String(pt.y));
          a.doigt.setAttribute("opacity", k > 0.01 && k < 0.99 ? "1" : "0");
          a.trait.setAttribute("opacity", String(OP_TRAINEE));
          a.trait.style.strokeDashoffset = String(a.traitLen * (1 - k));
        } else {
          // 3) Maintenue REIN (le trait reste dévoilé, la vessie reste posée).
          const tr = tc - (finMaintien + U_GLISSE);
          a.vessie.appui.setAttribute("r", String(a.vessie.r0));
          a.vessie.ondes.forEach((o) => o.el.setAttribute("opacity", "0"));
          a.doigt.setAttribute("opacity", "0");
          a.trait.setAttribute("opacity", String(OP_TRAINEE));
          a.trait.style.strokeDashoffset = "0";
          maintenir(a.rein, tr);
          // Fondu de fin sur le tout dernier maintien : la zone monte vers OP_FIN.
          if (dernierCycle) {
            const v = Math.min(tr / finMaintien, 1);
            a.groupe.el.style.opacity = String(OP_REPOS + (OP_FIN - OP_REPOS) * v);
          }
        }
      } else if (a.kind === "circulaire") {
        // PRESSION CIRCULAIRE : orteils joués UN À UN (gros → petit). Chaque
        // orteil : le doigt fait 3 tours, la traînée se dévoile au passage
        // (coloriage qui s'opacifie au fur et à mesure), puis l'orteil se fige à
        // 0.90 et on passe au suivant. Les orteils « en amont » restent au repos.
        let start = 0;
        for (const o of a.orteils) {
          const fin = start + o.dur;
          if (elapsed < start) {
            // Pas encore : orteil au repos, rien dessiné.
            o.fill.style.opacity = String(OP_REPOS);
            o.trail.setAttribute("opacity", "0");
            o.doigt.setAttribute("opacity", "0");
          } else if (elapsed >= fin) {
            // Terminé : l'orteil reste colorié (0.90), traînée et doigt éteints.
            o.fill.style.opacity = String(OP_FIN);
            o.trail.setAttribute("opacity", "0");
            o.doigt.setAttribute("opacity", "0");
          } else {
            // En cours : 3 tours, la traînée se dévoile derrière le doigt.
            const k = (elapsed - start) / o.dur;
            const pt = o.trail.getPointAtLength(o.trailLen * k);
            o.doigt.setAttribute("cx", String(pt.x));
            o.doigt.setAttribute("cy", String(pt.y));
            o.doigt.setAttribute("opacity", k > 0.004 && k < 0.999 ? "1" : "0");
            o.trail.style.strokeDashoffset = String(o.trailLen * (1 - k));
            if (k > CIRC_SEUIL_FIN) {
              // Fin du parcours : la forme monte vers 0.90, la traînée se résorbe.
              const v = (k - CIRC_SEUIL_FIN) / (1 - CIRC_SEUIL_FIN);
              o.fill.style.opacity = String(OP_REPOS + (OP_FIN - OP_REPOS) * v);
              o.trail.setAttribute("opacity", String(CIRC_OP_TRAINEE * (1 - v)));
            } else {
              o.fill.style.opacity = String(OP_REPOS);
              o.trail.setAttribute("opacity", k > 0.004 ? String(CIRC_OP_TRAINEE) : "0");
            }
          }
          start = fin + CIRC_T_PAUSE;
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
    // On (re)prépare l'étape dès que le SVG est prêt, ET à nouveau quand la
    // géométrie arrive (geomReady) : la 1re étape est ainsi rebâtie AVEC son doigt.
    if (ready) setupStep(step);
  }, [ready, geomReady, step, setupStep]);

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
