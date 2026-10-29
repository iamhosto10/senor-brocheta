/**
 * Reglas de negocio del sistema de reservas, portadas del sistema original
 * y corregidas para que coincidan con el sitio actual:
 * - abierto todos los días (no solo lunes a viernes)
 * - número de WhatsApp actualizado
 */
export const RESERVAS_CONFIG = {
  /** Horario de atención: de qué hora a qué hora se reciben reservas. */
  serviceWindows: [["17:00", "23:00"]] as [string, string][],
  /** Días de la semana sin reservas (0=domingo … 6=sábado). Vacío = todos los días. */
  closedWeekdays: [] as number[],
  /** Cuánto tiempo ocupa una reserva su mesa (minutos). */
  tableMinutes: 90,
  /** Margen de limpieza antes de reasignar una mesa (minutos). */
  turnoverMinutes: 0,
  /** Antelación mínima para reservar (minutos). */
  minLeadMinutes: 180,
  /** Hasta cuántos días hacia adelante se puede reservar. */
  maxAdvanceDays: 60,
  /** WhatsApp del restaurante, sin "+" ni espacios. */
  whatsappNumber: "573171361324",
  /** Cargo opcional por banda musical. */
  bandaMusicalCobro: 50000,
};
