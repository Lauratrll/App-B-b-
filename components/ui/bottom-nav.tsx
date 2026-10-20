"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { togglePinAction } from "@/lib/pinned-actions";
import { useNav } from "./nav-context";

// ----------------------------------------------------------------------------
// Barre du bas (choix Laura, 20/10/2026) : quatre entrées seulement.
//   Accueil · Cohérence cardiaque · SOS · Épinglés
// Les deux boutons du milieu sont ronds et débordent de la barre : 2/3 sur la
// barre, 1/3 au-dessus, sur le fond de la page. Visibles, mais pas principaux.
// Accueil et Épinglés : pictos seuls (sans mot), même trait que les pictos des
// cases Guide-moi (24 px de grille, trait 1,6, bouts arrondis), dans une
// pastille ronde. Couleur active Corail, inactive Eucalyptus (SKILL_ui).
// Les deux boutons ronds et les Épinglés n'apparaissent QUE sur l'accueil
// (Laura, 20/10) : ce sont des portes d'entrée. Ailleurs, la barre porte
// Accueil, le Retour (flèche + nom de la page parente, en pastille) et, quand
// la page s'épingle, le bouton « épingler » (épingle + plus), sinon rien.
// Les réglages (mon bébé, mes informations, mon abonnement) sont dans le menu
// « 3 traits » de l'en-tête (components/ui/app-menu.tsx).
// ----------------------------------------------------------------------------

const ACTIVE = "#D4604A";
const INACTIVE = "#8A9E98";

/** Hauteur de la barre, hors encoche iPhone. Reprise par la page SOS. */
export const BOTTOM_NAV_HEIGHT = 56;

/** Diamètre des boutons ronds : 1/3 dépasse au-dessus de la barre. */
const ROND = 54;

function Picto({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ display: "block" }}
    >
      {children}
    </svg>
  );
}

const ICONE_ACCUEIL = (
  <>
    <path d="M4 11.2L12 4.5l8 6.7" />
    <path d="M6.2 9.6V18.5c0 .6.4 1 1 1h3.3v-4.7c0-.6.4-1 1-1h1c.6 0 1 .4 1 1v4.7h3.3c.6 0 1-.4 1-1V9.6" />
  </>
);

const ICONE_RETOUR = <path d="M14.5 5.5L8 12l6.5 6.5" />;

// Épingle + petit plus : épingler la fiche ouverte.
const ICONE_EPINGLER = (
  <>
    <path d="M7.2 3.8h5.6" />
    <path d="M8.2 3.8l-.6 5.4c-1.7.8-2.8 2.1-3 3.8h10.8c-.2-1.7-1.3-3-3-3.8l-.6-5.4" />
    <path d="M10 13v7" />
    <path d="M18.5 15.5v5M16 18h5" />
  </>
);

// Déjà épinglée : l'épingle + une coche.
const ICONE_EPINGLEE = (
  <>
    <path d="M7.2 3.8h5.6" />
    <path d="M8.2 3.8l-.6 5.4c-1.7.8-2.8 2.1-3 3.8h10.8c-.2-1.7-1.3-3-3-3.8l-.6-5.4" />
    <path d="M10 13v7" />
    <path d="M15.8 18l1.8 1.8 3.4-3.6" />
  </>
);

const ICONE_EPINGLE = (
  <>
    <path d="M9.2 3.8h5.6" />
    <path d="M10.2 3.8l-.6 5.4c-1.7.8-2.8 2.1-3 3.8h10.8c-.2-1.7-1.3-3-3-3.8l-.6-5.4" />
    <path d="M12 13v7" />
  </>
);

// Cœur traversé d'une onde douce : la respiration régulière de la cohérence.
const ICONE_COHERENCE = (
  <>
    <path d="M12 20s-7.5-4.3-7.5-10.2A4.2 4.2 0 0112 7.3a4.2 4.2 0 017.5 2.5C19.5 15.7 12 20 12 20z" />
    <path d="M6.3 12.2q1.43-2.6 2.85 0t2.85 0 2.85 0 2.85 0" />
  </>
);

function OngletPicto({
  href,
  label,
  actif,
  children,
}: {
  href: string;
  label: string;
  actif: boolean;
  children: React.ReactNode;
}) {
  const color = actif ? ACTIVE : INACTIVE;
  return (
    <Link prefetch
      href={href}
      aria-label={label}
      aria-current={actif ? "page" : undefined}
      className="flex items-center justify-center"
      style={{ height: BOTTOM_NAV_HEIGHT }}
    >
      <span
        className="flex items-center justify-center rounded-full transition-colors"
        style={{
          width: 40,
          height: 40,
          background: actif ? "#F5D0C8" : "rgba(255,255,255,.55)",
        }}
      >
        <Picto color={color}>{children}</Picto>
      </span>
    </Link>
  );
}

function BoutonRond({
  href,
  label,
  actif,
  fond,
  bord,
  children,
}: {
  href: string;
  label: string;
  actif: boolean;
  fond: string;
  bord: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex justify-center" style={{ height: BOTTOM_NAV_HEIGHT }}>
      <Link prefetch
        href={href}
        aria-label={label}
        aria-current={actif ? "page" : undefined}
        className="absolute flex items-center justify-center rounded-full transition-transform active:scale-[0.95]"
        style={{
          width: ROND,
          height: ROND,
          top: -ROND / 3,
          background: fond,
          border: `${actif ? 2 : 1.5}px solid ${actif ? ACTIVE : bord}`,
          boxShadow: "0 2px 8px rgba(58,50,40,.12)",
        }}
      >
        {children}
      </Link>
    </div>
  );
}

// Libellé du Retour selon la page de destination (même mot que l'ancien
// lien du haut). Une page dont le libellé dépend des données (la catégorie de
// Guide-moi) le déclare elle-même avec <NavBack />.
const LIBELLES: Record<string, string> = {
  "/guide": "Guide-moi !",
  "/reflexologie": "Réflexologie",
  "/sos": "Dois-je consulter ?",
  "/soin": "Prendre soin de moi",
  "/epingles": "Mes épingles",
};

/** Retour par défaut : la page parente, seulement sous une rubrique (sur la
 *  page d'une rubrique, c'est le bouton Accueil qui ramène). Une fiche ouverte
 *  depuis les épingles revient aux épingles. */
function retourParDefaut(pathname: string): { href: string; label: string } | null {
  if (pathname.startsWith("/epingle/")) return { href: "/epingles", label: LIBELLES["/epingles"] };
  const morceaux = pathname.split("/").filter(Boolean);
  if (morceaux.length <= 1) return null;
  const href = "/" + morceaux.slice(0, -1).join("/");
  return { href, label: LIBELLES[href] ?? "Retour" };
}

function Pastille({ actif, children }: { actif: boolean; children: React.ReactNode }) {
  return (
    <span
      className="flex items-center justify-center rounded-full transition-colors"
      style={{ width: 40, height: 40, background: actif ? "#F5D0C8" : "rgba(255,255,255,.55)" }}
    >
      {children}
    </span>
  );
}

function BoutonEpingler() {
  const { pin } = useNav();
  if (!pin) return <span aria-hidden />;
  const action = togglePinAction.bind(null, pin.contentId, pin.returnUrl);
  return (
    <form action={action} className="flex items-center justify-center" style={{ height: BOTTOM_NAV_HEIGHT }}>
      <button
        type="submit"
        aria-pressed={pin.isPinned}
        aria-label={pin.isPinned ? "Retirer des épinglés" : "Épingler"}
        className="flex items-center justify-center"
      >
        <Pastille actif={pin.isPinned}>
          <Picto color={pin.isPinned ? ACTIVE : INACTIVE}>
            {pin.isPinned ? ICONE_EPINGLEE : ICONE_EPINGLER}
          </Picto>
        </Pastille>
      </button>
    </form>
  );
}

/** Retour : flèche + nom de la page où l'on revient, dans une pastille blanche
 *  qui englobe le texte. Même typographie que le sous-titre « Dans quelles
 *  situations ? » de Guide-moi (capitales espacées, gris eucalyptus). */
function BoutonRetour({ href, label }: { href: string; label: string }) {
  return (
    <Link prefetch
      href={href}
      aria-label={"Retour : " + label}
      className="flex min-w-0 items-center gap-1.5 rounded-full transition-transform active:scale-[0.97]"
      style={{ height: 40, padding: "0 14px 0 10px", background: "rgba(255,255,255,.55)" }}
    >
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={INACTIVE} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0 }}>
        {ICONE_RETOUR}
      </svg>
      <span
        className="truncate"
        style={{ fontSize: 10, color: INACTIVE, letterSpacing: ".07em", textTransform: "uppercase", fontWeight: 600 }}
      >
        {label}
      </span>
    </Link>
  );
}

const STYLE_BARRE = {
  background: "#F2EDE8",
  borderTop: "0.5px solid #C8D8DC",
  paddingBottom: "env(safe-area-inset-bottom)",
} as const;

export function BottomNav() {
  const pathname = usePathname() ?? "";
  const { back } = useNav();
  const estSur = (base: string) =>
    pathname === base || pathname.startsWith(base + "/");

  // Accueil : Accueil · Cohérence (rond) · SOS (rond) · Épinglés.
  if (estSur("/dashboard")) {
    return (
      <nav aria-label="Navigation principale" className="sticky bottom-0 z-30 grid grid-cols-4" style={STYLE_BARRE}>
        <OngletPicto href="/dashboard" label="Accueil" actif>
          {ICONE_ACCUEIL}
        </OngletPicto>
        <BoutonRond href="/coherence" label="Cohérence cardiaque" actif={false} fond="#F5D0C8" bord="#E0A48E">
          <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#8A3020" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            {ICONE_COHERENCE}
          </svg>
        </BoutonRond>
        <BoutonRond href="/sos" label="SOS, dois-je consulter ?" actif={false} fond="#FAD2B3" bord="#EDA36E">
          <span className="font-display font-bold" style={{ fontSize: 15, letterSpacing: "0.04em", color: "#A4471F" }}>
            SOS
          </span>
        </BoutonRond>
        <OngletPicto href="/epingles" label="Épinglés" actif={false}>
          {ICONE_EPINGLE}
        </OngletPicto>
      </nav>
    );
  }

  // Ailleurs : Accueil · Retour (avec son libellé) · … · Épingler (si la page
  // s'épingle). Les Épinglés ne s'ouvrent que depuis l'accueil (Laura, 20/10).
  const retour = back ?? retourParDefaut(pathname);
  return (
    <nav aria-label="Navigation principale" className="sticky bottom-0 z-30 flex items-center gap-1 px-2" style={STYLE_BARRE}>
      <div className="w-[64px] shrink-0">
        <OngletPicto href="/dashboard" label="Accueil" actif={false}>
          {ICONE_ACCUEIL}
        </OngletPicto>
      </div>
      {retour ? <BoutonRetour href={retour.href} label={retour.label} /> : null}
      <div className="ml-auto w-[64px] shrink-0">
        <BoutonEpingler />
      </div>
    </nav>
  );
}
