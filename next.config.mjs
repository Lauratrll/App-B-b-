/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Cache du routeur côté téléphone (20/10/2026, rapidité d'ouverture) :
    // une page déjà ouverte ou préchargée (<Link prefetch>) se réaffiche sans
    // repasser par le serveur pendant ce délai, en secondes. Épingler, changer
    // l'aperçu admin ou le profil vident ce cache (revalidatePath).
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
  },
  // « Partager & rassurer » (/audio) a été remplacé par le S.O.S le 08/10/2026.
  async redirects() {
    return [
      { source: "/audio", destination: "/sos", permanent: false },
      { source: "/audio/:path*", destination: "/sos", permanent: false },
    ];
  },
};

export default nextConfig;
