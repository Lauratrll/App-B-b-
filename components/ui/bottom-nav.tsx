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
// Les deux boutons ronds n'apparaissent QUE sur l'accueil (Laura, 20/10) :
// ce sont des portes d'entrée de rubrique. Ailleurs, leurs places reçoivent
// le Retour (la flèche qui était en haut des pages) et, quand la page
// s'épingle, le bouton « épingler » (épingle + plus), à côté des Épinglés.
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
    <Link
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
      <Link
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

/** Où mène le Retour : la page parente dans l'arborescence, l'accueil pour
 *  une rubrique. Une fiche ouverte depuis les épingles revient aux épingles. */
function cibleRetour(pathname: string): string {
  if (pathname.startsWith("/epingle/")) return "/epingles";
  const morceaux = pathname.split("/").filter(Boolean);
  if (morceaux.length <= 1) return "/dashboard";
  return "/" + morceaux.slice(0, -1).join("/");
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

export function BottomNav() {
  const pathname = usePathname() ?? "";
  const estSur = (base: string) =>
    pathname === base || pathname.startsWith(`${base}/`);
  const accueil = estSur("/dashboard");

  return (
    <nav
      aria-label="Navigation principale"
      className="sticky bottom-0 z-30 grid grid-cols-4"
      style={{
        background: "#F2EDE8",
        borderTop: "0.5px solid #C8D8DC",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <OngletPicto href="/dashboard" label="Accueil" actif={accueil}>
        {ICONE_ACCUEIL}
      </OngletPicto>

      {accueil ? (
        <>
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
        </>
      ) : (
        <>
          <OngletPicto href={cibleRetour(pathname)} label="Retour" actif={false}>
            {ICONE_RETOUR}
          </OngletPicto>
          <BoutonEpingler />
        </>
      )}

      <OngletPicto href="/epingles" label="Épinglés" actif={estSur("/epingles")}>
        {ICONE_EPINGLE}
      </OngletPicto>
    </nav>
  );
}
