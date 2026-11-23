/**
 * Reglas de negocio del sistema de reservas, portadas del sistema original
 * y corregidas para que coincidan con el sitio actual:
 * - abierto todos los días (no solo lunes a viernes)
 * - número de WhatsApp actualizado
 */
/**
 * Horario reducido de 5pm a 7pm: se usa tanto para los días de mayor volumen (viernes,
 * sábado, domingo) como para los festivos colombianos (ver lib/reservas/festivos.ts).
 * Un solo valor para los dos casos a propósito — hoy son el mismo horario; si alguna vez
 * el negocio quiere separarlos, se desdobla en dos constantes en este archivo.
 */
import REGLAS from "./reglas.json";

const HORARIO_REDUCIDO: [string, string][] = [["17:00", "19:00"]];

export const RESERVAS_CONFIG = {
  /** Horario de atención: de qué hora a qué hora se reciben reservas. */
  serviceWindows: [["17:00", "23:00"]] as [string, string][],
  /**
   * Horario reducido para los días de mayor volumen (viernes, sábado, domingo):
   * solo se reciben reservas de 5pm a 7pm, el resto del día queda bloqueado.
   * Días de la semana: 0=domingo … 6=sábado.
   */
  serviceWindowsPorDia: {
    0: HORARIO_REDUCIDO,
    5: HORARIO_REDUCIDO,
    6: HORARIO_REDUCIDO,
  } as Record<number, [string, string][]>,
  /** Mismo horario reducido, pero disparado por un festivo colombiano en vez del día de la
   * semana. Un festivo entre semana (p. ej. un martes) queda restringido igual que un
   * viernes/sábado/domingo normal. */
  serviceWindowsFestivos: HORARIO_REDUCIDO,
  /** Días de la semana sin reservas (0=domingo … 6=sábado). Vacío = todos los días. */
  closedWeekdays: [] as number[],
  /** Cuánto tiempo ocupa una reserva su mesa (minutos). */
  tableMinutes: REGLAS.tableMinutes,
  /** Margen de limpieza antes de reasignar una mesa (minutos). */
  turnoverMinutes: REGLAS.turnoverMinutes,
  /** Antelación mínima para reservar (minutos). */
  minLeadMinutes: 180,
  /** Hasta cuántos días hacia adelante se puede reservar. */
  maxAdvanceDays: 60,
  /** WhatsApp del restaurante, sin "+" ni espacios. */
  whatsappNumber: "573171361324",
  /** Cargo opcional por banda musical. */
  bandaMusicalCobro: 50000,
};
