import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Los videos y fotogramas de la portada pesan: que el navegador los guarde
  // un día y los revalide en segundo plano en vez de pedirlos en cada visita.
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
