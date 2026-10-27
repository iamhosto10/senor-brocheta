/** Fecha de hoy en Bogotá (UTC-5), como string "YYYY-MM-DD". */
export function hoyISO(): string {
  const now = new Date();
  const bogota = new Date(now.toLocaleString("en-US", { timeZone: "America/Bogota" }));
  return bogota.toISOString().slice(0, 10);
}
