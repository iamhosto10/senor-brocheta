import { RESERVAS_CONFIG } from "./config";
import { capacidadZona, type Zona } from "./zonas";

export const ESTADOS_ACTIVOS = ["pendiente", "confirmada"];

export function parseHora(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function formatHora(minutos: number): string {
  const h = Math.floor(minutos / 60).toString().padStart(2, "0");
  const m = (minutos % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/** Unidades de 4 puestos que ocupa un grupo. Igual en todas las zonas. */
export function unidadesNecesarias(personas: number): number {
  return Math.ceil(personas / 4);
}

/** Unidades de 4 puestos que tiene una zona en total. */
export function unidadesZona(zona: Zona): number {
  return capacidadZona(zona) / 4;
}

/** true si dos reservas que empiezan a esas horas se cruzan en la mesa. */
export function seSolapan(horaA: string, horaB: string): boolean {
  const duracion = RESERVAS_CONFIG.tableMinutes + RESERVAS_CONFIG.turnoverMinutes;
  const inicioA = parseHora(horaA);
  const inicioB = parseHora(horaB);
  return inicioA < inicioB + duracion && inicioB < inicioA + duracion;
}

/** Todos los horarios de inicio del horario normal, cada 30 min ("17:00" … "22:30"). */
export function slotsServicio(): string[] {
  const slots: string[] = [];
  for (const [inicio, fin] of RESERVAS_CONFIG.serviceWindows) {
    for (let m = parseHora(inicio); m < parseHora(fin); m += 30) {
      slots.push(formatHora(m));
    }
  }
  return slots;
}

export type ReservaOcupacion = { hora: string; personas: number; zona_id: string };

/** Unidades ya ocupadas en una zona a una hora, según las reservas activas del día. */
export function unidadesOcupadas(
  zona: Zona,
  hora: string,
  ocupacion: ReservaOcupacion[]
): number {
  return ocupacion
    .filter((r) => r.zona_id === zona.id && seSolapan(r.hora, hora))
    .reduce((sum, r) => sum + unidadesNecesarias(r.personas), 0);
}
