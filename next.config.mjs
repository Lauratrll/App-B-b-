/** @type {import('next').NextConfig} */
const nextConfig = {
  // « Partager & rassurer » (/audio) a été remplacé par le S.O.S le 08/10/2026.
  async redirects() {
    return [
      { source: "/audio", destination: "/sos", permanent: false },
      { source: "/audio/:path*", destination: "/sos", permanent: false },
    ];
  },
};

export default nextConfig;
