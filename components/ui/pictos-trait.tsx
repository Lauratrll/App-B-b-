// Pictos au trait, même style que ceux de l'app (Laura, 18/11/2026 : pas
// d'emoji, jamais). Trait 1.6, bouts arrondis, couleur = currentColor.

function Trait({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** Lune et petite étoile (sommeil, coucher). */
export function PictoLune({ className }: { className?: string }) {
  return (
    <Trait className={className}>
      <path d="M17 13a6 6 0 11-7-7 4.5 4.5 0 007 7z" />
      <path d="M18 4.5v2M17 5.5h2" />
    </Trait>
  );
}

/** Épingle (même dessin que dans la barre du bas). */
export function PictoEpingle({ className }: { className?: string }) {
  return (
    <Trait className={className}>
      <path d="M9.2 3.8h5.6" />
      <path d="M10.2 3.8l-.6 5.4c-1.7.8-2.8 2.1-3 3.8h10.8c-.2-1.7-1.3-3-3-3.8l-.6-5.4" />
      <path d="M12 13v7" />
    </Trait>
  );
}

/** Boussole (Guide-moi !). */
export function PictoBoussole({ className }: { className?: string }) {
  return (
    <Trait className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </Trait>
  );
}

/** Fleur (Prends soin de toi). */
export function PictoFleur({ className }: { className?: string }) {
  return (
    <Trait className={className}>
      <circle cx="12" cy="12" r="2" />
      <path d="M12 10c-1.6-2.2-1.6-4.4 0-6.5 1.6 2.1 1.6 4.3 0 6.5z" />
      <path d="M12 14c1.6 2.2 1.6 4.4 0 6.5-1.6-2.1-1.6-4.3 0-6.5z" />
      <path d="M10 12c-2.2 1.6-4.4 1.6-6.5 0 2.1-1.6 4.3-1.6 6.5 0z" />
      <path d="M14 12c2.2-1.6 4.4-1.6 6.5 0-2.1 1.6-4.3 1.6-6.5 0z" />
    </Trait>
  );
}

/** Triangle d'attention (vigilance, urgence). */
export function PictoAlerte({ className }: { className?: string }) {
  return (
    <Trait className={className}>
      <path d="M12 4.2l8.6 15H3.4z" />
      <path d="M12 10v4" />
      <path d="M12 16.9v.1" />
    </Trait>
  );
}

/** Index levé (« ce geste se fait sur le dessus du pied »). */
export function PictoDoigt({ className }: { className?: string }) {
  return (
    <Trait className={className}>
      <path d="M10 12V4.6a1.5 1.5 0 013 0V11" />
      <path d="M13 10.2a1.4 1.4 0 012.8 0V11.5" />
      <path d="M15.8 11a1.4 1.4 0 012.7.4V14c0 3.6-2.4 6.5-6 6.5h-.6c-2 0-3.4-.9-4.5-2.5L5.1 14.6a1.4 1.4 0 012.2-1.7L10 15.4" />
    </Trait>
  );
}

/** Micro (enregistrer). */
export function PictoMicro({ className }: { className?: string }) {
  return (
    <Trait className={className}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0012 0" />
      <path d="M12 17v4" />
    </Trait>
  );
}

/** Carré d'arrêt. */
export function PictoStop({ className }: { className?: string }) {
  return (
    <Trait className={className}>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
    </Trait>
  );
}

/** Flèche de téléchargement. */
export function PictoTelecharger({ className }: { className?: string }) {
  return (
    <Trait className={className}>
      <path d="M12 4v11" />
      <path d="M7.5 10.5L12 15l4.5-4.5" />
      <path d="M5 19h14" />
    </Trait>
  );
}

/** Lecture (triangle). */
export function PictoLecture({ className }: { className?: string }) {
  return (
    <Trait className={className}>
      <path d="M8 5.5v13l10.5-6.5z" />
    </Trait>
  );
}

/** Pause (deux barres). */
export function PictoPause({ className }: { className?: string }) {
  return (
    <Trait className={className}>
      <path d="M9 6v12M15 6v12" />
    </Trait>
  );
}
