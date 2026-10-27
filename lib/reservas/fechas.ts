/** Fecha de hoy en Bogotá (UTC-5), como string "YYYY-MM-DD". */
export function hoyISO(): string {
  const now = new Date();
  const bogota = new Date(now.toLocaleString("en-US", { timeZone: "America/Bogota" }));
  return bogota.toISOString().slice(0, 10);
}

/** "2026-10-28" -> "miércoles, 28 de octubre". */
export function formatearFechaLarga(fecha: string): string {
  const [y, m, d] = fecha.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

/** "19:30" -> "7:30 pm". */
export function fmtTime12(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "pm" : "am";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}
