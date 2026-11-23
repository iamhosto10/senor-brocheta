import type { MetadataRoute } from "next";

const SITE = "https://srbrocheta.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const rutas = [
    { path: "", priority: 1 },
    { path: "/reservas", priority: 0.6 },
    { path: "/reservas/nueva", priority: 0.8 },
    { path: "/reservas/consultar", priority: 0.4 },
  ];
  return rutas.map(({ path, priority }) => ({
    url: `${SITE}${path}`,
    lastModified: new Date(),
    priority,
  }));
}
