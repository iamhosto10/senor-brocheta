/**
 * Reglas de negocio del sistema de reservas, portadas del sistema original
 * y corregidas para que coincidan con el sitio actual:
 * - abierto todos los días (no solo lunes a viernes)
 * - número de WhatsApp actualizado
 */
export const RESERVAS_CONFIG = {
  /** Horario de atención: de qué hora a qué hora se reciben reservas. */
  serviceWindows: [["17:00", "23:00"]] as [string, string][],
  /**
   * Horario reducido para los días de mayor volumen (viernes, sábado, domingo):
   * solo se reciben reservas de 5pm a 7pm, el resto del día queda bloqueado.
   * Días de la semana: 0=domingo … 6=sábado.
   */
  serviceWindowsPorDia: {
    0: [["17:00", "19:00"]],
    5: [["17:00", "19:00"]],
    6: [["17:00", "19:00"]],
  } as Record<number, [string, string][]>,
  /** Días de la semana sin reservas (0=domingo … 6=sábado). Vacío = todos los días. */
  closedWeekdays: [] as number[],
  /** Cuánto tiempo ocupa una reserva su mesa (minutos). */
  tableMinutes: 120,
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
