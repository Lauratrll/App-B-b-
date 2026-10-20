// Écran d'attente des pages de l'app (20/10/2026, lenteur signalée par Laura).
// Il s'affiche dès le toucher, pendant que le serveur prépare la page : le
// parent voit tout de suite que son geste a été pris en compte, au lieu d'un
// écran figé. La barre du bas reste en place (elle est dans le layout).
// Grâce à ce fichier, Next.js peut aussi précharger cet écran pour chaque lien.
export default function Chargement() {
  return (
    <div
      role="status"
      aria-label="Chargement"
      className="flex min-h-[50dvh] items-center justify-center"
    >
      <span className="chargement-points" aria-hidden>
        <span />
        <span />
        <span />
      </span>
      <style>{`
        .chargement-points { display: flex; gap: 8px; }
        .chargement-points span {
          width: 8px; height: 8px; border-radius: 50%;
          background: #8A9E98; opacity: .35;
          animation: chargement-pulse 1s ease-in-out infinite;
        }
        .chargement-points span:nth-child(2) { animation-delay: .15s; }
        .chargement-points span:nth-child(3) { animation-delay: .3s; }
        @keyframes chargement-pulse { 50% { opacity: 1; transform: scale(1.15); } }
        @media (prefers-reduced-motion: reduce) {
          .chargement-points span { animation: none; opacity: .6; }
        }
      `}</style>
    </div>
  );
}
