"use client";

import { useEffect, useRef, useState } from "react";

// ----------------------------------------------------------------------------
// Le Métronome du souffle (Laura, 06/11/2026) — page /coherence.
// Une vague douce défile de droite à gauche ; la bille reste au milieu de
// l'écran et ne bouge que de haut en bas : elle semble suivre la vague.
// Elle grossit en montant (inspiration), diminue en descendant (expiration).
// Montée et descente : 5 s par défaut, réglable 4, 5, 6 ou 7 s.
// Rien de médical : pas de tracé type électrocardiogramme, pas de chiffre de
// fréquence, juste une onde lente. Couleurs : la lavande de la carte
// « Parents submergés » de Guide-moi (GUIDE_SLOT_PARENT, guide-design.tsx).
// ----------------------------------------------------------------------------

import { LAVANDE } from "./metronome-design";

const RYTHMES = [4, 5, 6, 7] as const;
type Rythme = (typeof RYTHMES)[number];
const RYTHME_DEFAUT: Rythme = 5;
const CLE_RYTHME = "metronome_souffle_rythme";
const CLE_SON = "metronome_souffle_son";

/** Durée d'une séance (Laura, 06/11) : 5 min, puis la bille s'arrête en bas,
 *  à la fin d'une expiration. On relance simplement avec « Commencer ». */
const DUREE_SEANCE_S = 5 * 60;

// ----------------------------------------------------------------------------
// Carillon : un « ding » de bol chantant, fabriqué par le navigateur (Web Audio),
// sans fichier son. Une note grave et ses harmoniques un peu « inharmoniques »
// (comme un vrai bol), attaque douce, longue résonance. Note plus claire en
// haut (on commence à expirer), plus grave en bas (on commence à inspirer).
// ----------------------------------------------------------------------------
type Ctx = AudioContext;

function creerContexte(): Ctx | null {
  try {
    const C =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    return C ? new C() : null;
  } catch {
    return null;
  }
}

function carillon(ctx: Ctx, frequence: number, volume = 0.18, duree = 3.2) {
  const t = ctx.currentTime + 0.01;
  const sortie = ctx.createGain();
  sortie.gain.setValueAtTime(0, t);
  sortie.gain.linearRampToValueAtTime(volume, t + 0.015);
  sortie.gain.exponentialRampToValueAtTime(0.0001, t + duree);
  sortie.connect(ctx.destination);
  // Harmoniques d'un bol : rapports ≈ 1 · 2,76 · 5,4, de plus en plus brefs.
  const partiels: [number, number, number][] = [
    [1, 1, 1],
    [2.76, 0.35, 0.55],
    [5.4, 0.12, 0.3],
  ];
  for (const [ratio, gain, part] of partiels) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequence * ratio, t);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duree * part);
    osc.connect(g).connect(sortie);
    osc.start(t);
    osc.stop(t + duree + 0.1);
  }
}

const NOTE_HAUT = 660; // mi : début de l'expiration
const NOTE_BAS = 495; // si, une quinte plus bas : début de l'inspiration

// Dessin (unités du viewBox SVG).
const W = 340;
const H = 300;
const CX = W / 2;
const MILIEU = H / 2;
const AMPLITUDE = 92;
const LONGUEUR_ONDE = 250; // une respiration complète = une longueur d'onde
const R_MIN = 9;
const R_MAX = 24;

/** Hauteur de la vague, de -1 (en bas) à 1 (en haut), pour une phase en tours. */
const hauteur = (phase: number) => -Math.cos(2 * Math.PI * phase);

function cheminVague(phase: number): string {
  const pts: string[] = [];
  for (let x = -10; x <= W + 10; x += 4) {
    const p = phase + (x - CX) / LONGUEUR_ONDE;
    const y = MILIEU - AMPLITUDE * hauteur(p);
    pts.push(`${x === -10 ? "M" : "L"}${x},${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

export function MetronomeSouffle() {
  const [rythme, setRythme] = useState<Rythme>(RYTHME_DEFAUT);
  const [enCours, setEnCours] = useState(false);
  const [phase, setPhase] = useState(0);

  const [son, setSon] = useState(true);

  const phaseRef = useRef(0);
  const rythmeRef = useRef<Rythme>(RYTHME_DEFAUT);
  const ecouleRef = useRef(0); // secondes de séance déjà jouées (hors pauses)
  const sonRef = useRef(true);
  const audioRef = useRef<Ctx | null>(null);

  // Rythme et son mémorisés sur l'appareil (simple confort).
  useEffect(() => {
    try {
      const v = Number(window.localStorage.getItem(CLE_RYTHME));
      if ((RYTHMES as readonly number[]).includes(v)) {
        setRythme(v as Rythme);
        rythmeRef.current = v as Rythme;
      }
      if (window.localStorage.getItem(CLE_SON) === "0") {
        setSon(false);
        sonRef.current = false;
      }
    } catch {
      /* stockage indisponible : on garde 5 s et le son */
    }
  }, []);

  useEffect(() => () => void audioRef.current?.close().catch(() => {}), []);

  function basculerSon() {
    const v = !sonRef.current;
    sonRef.current = v;
    setSon(v);
    try {
      window.localStorage.setItem(CLE_SON, v ? "1" : "0");
    } catch {
      /* rien */
    }
  }

  function sonner(frequence: number, volume?: number, duree?: number) {
    const ctx = audioRef.current;
    if (!sonRef.current || !ctx) return;
    try {
      carillon(ctx, frequence, volume, duree);
    } catch {
      /* son indisponible : l'animation continue */
    }
  }

  // Le son doit être « débloqué » par un geste du parent (règle des téléphones) :
  // on crée le contexte audio au moment où il appuie sur Commencer.
  function lancerOuPause() {
    if (enCours) {
      setEnCours(false);
      return;
    }
    if (!audioRef.current) audioRef.current = creerContexte();
    audioRef.current?.resume().catch(() => {});
    if (phaseRef.current === 0) sonner(NOTE_BAS); // premier ding : on inspire
    setEnCours(true);
  }

  function choisirRythme(r: Rythme) {
    setRythme(r);
    rythmeRef.current = r;
    try {
      window.localStorage.setItem(CLE_RYTHME, String(r));
    } catch {
      /* rien */
    }
  }

  // Boucle d'animation : la phase avance d'un tour par respiration complète.
  // Changer de rythme en cours ne fait pas sauter la bille.
  useEffect(() => {
    if (!enCours) return;
    let id = 0;
    let avant = performance.now();
    const pas = (now: number) => {
      // Plafond : après une mise en veille, la bille reprend où elle était.
      const dt = Math.min(0.5, (now - avant) / 1000);
      avant = now;
      const avantPas = phaseRef.current;
      const apres = avantPas + dt / (2 * rythmeRef.current);
      ecouleRef.current += dt;

      // Fin d'une expiration (bille en bas) : séance finie après 5 min.
      if (Math.floor(apres) > Math.floor(avantPas) && ecouleRef.current >= DUREE_SEANCE_S) {
        phaseRef.current = 0;
        ecouleRef.current = 0;
        setPhase(0);
        setEnCours(false);
        sonner(NOTE_BAS, 0.2, 5); // un dernier ding, plus long : c'est fini
        return;
      }
      // Changement de mouvement : un ding en haut et en bas.
      if (Math.floor(apres * 2) > Math.floor(avantPas * 2)) {
        sonner(Math.floor(apres * 2) % 2 === 1 ? NOTE_HAUT : NOTE_BAS);
      }
      phaseRef.current = apres;
      setPhase(apres);
      id = requestAnimationFrame(pas);
    };
    id = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(id);
  }, [enCours]);

  // L'écran reste allumé pendant l'exercice, si le téléphone le permet.
  useEffect(() => {
    if (!enCours) return;
    type Verrou = { release: () => Promise<void> };
    let verrou: Verrou | null = null;
    const nav = navigator as Navigator & {
      wakeLock?: { request: (t: "screen") => Promise<Verrou> };
    };
    nav.wakeLock?.request("screen").then((v) => (verrou = v)).catch(() => {});
    return () => {
      verrou?.release().catch(() => {});
    };
  }, [enCours]);

  const h = hauteur(phase);
  const montee = (h + 1) / 2; // 0 en bas, 1 en haut
  const yBille = MILIEU - AMPLITUDE * h;
  const rBille = R_MIN + (R_MAX - R_MIN) * montee;
  const frac = phase - Math.floor(phase);
  const inspire = frac < 0.5;
  const consigne = !enCours ? "Quand tu veux" : inspire ? "Inspire" : "Expire";
  const chemin = cheminVague(phase);

  return (
    <div className="flex flex-col items-center" style={{ gap: 18 }}>
      <div
        className="relative w-full overflow-hidden"
        style={{
          borderRadius: 28,
          background: `linear-gradient(180deg, ${LAVANDE.clair} 0%, ${LAVANDE.fond} 100%)`,
        }}
      >
        <p
          aria-live="polite"
          className="font-display text-center"
          style={{
            position: "absolute",
            top: 18,
            left: 0,
            right: 0,
            margin: 0,
            fontSize: 22,
            fontStyle: "italic",
            color: LAVANDE.texte,
            opacity: enCours ? 0.55 + 0.45 * Math.sin(Math.PI * ((frac * 2) % 1)) : 0.8,
          }}
        >
          {consigne}
        </p>

        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" aria-hidden style={{ marginTop: 34 }}>
          <defs>
            {/* La vague s'efface sur les bords : elle vient de loin et repart. */}
            <linearGradient id="ms-trait" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor={LAVANDE.profond} stopOpacity="0" />
              <stop offset="0.35" stopColor={LAVANDE.profond} stopOpacity="0.35" />
              <stop offset="0.5" stopColor={LAVANDE.profond} stopOpacity="0.75" />
              <stop offset="0.75" stopColor={LAVANDE.profond} stopOpacity="0.55" />
              <stop offset="1" stopColor={LAVANDE.profond} stopOpacity="0" />
            </linearGradient>
            <radialGradient id="ms-bille" cx="0.38" cy="0.35" r="0.7">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.45" stopColor={LAVANDE.moyen} />
              <stop offset="1" stopColor={LAVANDE.profond} />
            </radialGradient>
            <radialGradient id="ms-halo">
              <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.7" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Écho de la vague, plus large et plus pâle, pour la douceur. */}
          <path d={chemin} fill="none" stroke={LAVANDE.soutenu} strokeOpacity="0.35" strokeWidth={14} strokeLinecap="round" />
          <path d={chemin} fill="none" stroke="url(#ms-trait)" strokeWidth={3} strokeLinecap="round" />

          {/* Le rail vertical de la bille, à peine visible. */}
          <line x1={CX} x2={CX} y1={MILIEU - AMPLITUDE} y2={MILIEU + AMPLITUDE} stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth={1} strokeDasharray="2 6" />

          <circle cx={CX} cy={yBille} r={rBille * 2.4} fill="url(#ms-halo)" opacity={0.4 + 0.6 * montee} />
          <circle cx={CX} cy={yBille} r={rBille} fill="url(#ms-bille)" />
        </svg>
      </div>

      <div className="flex flex-col items-center" style={{ gap: 8 }}>
        <p
          className="m-0 font-semibold uppercase"
          style={{ fontSize: 9, letterSpacing: ".15em", color: LAVANDE.texte, opacity: 0.75 }}
        >
          Durée d&apos;une montée et d&apos;une descente
        </p>
        <div role="radiogroup" aria-label="Rythme du souffle" className="flex" style={{ gap: 8 }}>
          {RYTHMES.map((r) => {
            const choisi = r === rythme;
            return (
              <button
                key={r}
                type="button"
                role="radio"
                aria-checked={choisi}
                onClick={() => choisirRythme(r)}
                className="rounded-full transition-colors"
                style={{
                  minWidth: 56,
                  height: 36,
                  fontSize: 14,
                  fontWeight: choisi ? 700 : 500,
                  color: choisi ? "#FFFFFF" : LAVANDE.texte,
                  background: choisi ? LAVANDE.profond : "rgba(255,255,255,.6)",
                }}
              >
                {r} s
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center" style={{ gap: 10 }}>
        <button
          type="button"
          onClick={lancerOuPause}
          className="rounded-full font-semibold transition-transform active:scale-[0.97]"
          style={{
            height: 46,
            padding: "0 28px",
            fontSize: 15,
            color: "#FFFFFF",
            background: LAVANDE.texte,
          }}
        >
          {enCours ? "Pause" : phase > 0 ? "Reprendre" : "Commencer"}
        </button>
        {/* Son du carillon : picto cloche, barrée quand le son est coupé. */}
        <button
          type="button"
          onClick={basculerSon}
          aria-pressed={son}
          aria-label={son ? "Couper le carillon" : "Activer le carillon"}
          className="flex items-center justify-center rounded-full"
          style={{ width: 46, height: 46, background: "rgba(255,255,255,.6)" }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={LAVANDE.texte} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ opacity: son ? 1 : 0.55 }}>
            <path d="M6 16.5V11a6 6 0 0112 0v5.5l1.5 1.5h-15L6 16.5z" />
            <path d="M10 20.5a2 2 0 004 0" />
            {son ? null : <path d="M4 4l16 16" />}
          </svg>
        </button>
      </div>
    </div>
  );
}
