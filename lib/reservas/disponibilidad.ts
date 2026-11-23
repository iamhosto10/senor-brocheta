import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ESTADOS_ACTIVOS,
  parseHora,
  formatHora,
  unidadesNecesarias,
  unidadesOcupadas,
  unidadesZona,
  type ReservaOcupacion,
} from "./capacidad";
import { RESERVAS_CONFIG } from "./config";
import { esFestivoColombia } from "./festivos";
import { ZONAS, type Zona } from "./zonas";

/** Fecha y hora actuales en Bogotá (UTC-5), sin depender del huso horario del servidor. */
function ahoraBogota() {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(new Date()).map((p) => [p.type, p.value])
  );
  return {
    fecha: `${parts.year}-${parts.month}-${parts.day}`,
    minutos: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

/** Día de la semana (0=domingo … 6=sábado) de una fecha "YYYY-MM-DD", sin depender del huso horario del servidor. */
function diaSemana(fecha: string): number {
  const [y, m, d] = fecha.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** Todos los horarios de inicio posibles para una fecha, respetando la antelación mínima. */
export function horariosDelDia(fecha: string): string[] {
  const { fecha: hoy, minutos: ahoraMin } = ahoraBogota();
  const slots: string[] = [];
  const ventanas = esFestivoColombia(fecha)
    ? RESERVAS_CONFIG.serviceWindowsFestivos
    : RESERVAS_CONFIG.serviceWindowsPorDia[diaSemana(fecha)] ?? RESERVAS_CONFIG.serviceWindows;

  for (const [inicio, fin] of ventanas) {
    const inicioMin = parseHora(inicio);
    const finMin = parseHora(fin);
    for (let m = inicioMin; m < finMin; m += 30) {
      if (fecha === hoy && m < ahoraMin + RESERVAS_CONFIG.minLeadMinutes) continue;
      slots.push(formatHora(m));
    }
  }
  return slots;
}

async function ocupacionDelDia(fecha: string): Promise<ReservaOcupacion[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("reservations")
    .select("hora, personas, zona_id")
    .eq("fecha", fecha)
    .in("estado", ESTADOS_ACTIVOS);

  if (error) throw error;
  return data ?? [];
}

function zonaTieneCupo(
  zona: Zona,
  personas: number,
  hora: string,
  ocupacion: ReservaOcupacion[]
): boolean {
  return (
    unidadesOcupadas(zona, hora, ocupacion) + unidadesNecesarias(personas) <=
    unidadesZona(zona)
  );
}

/** Zonas con cupo para una fecha/hora/grupo, ya validadas contra la ocupación real. */
export async function zonasDisponibles(
  fecha: string,
  hora: string,
  personas: number
): Promise<Zona[]> {
  const ocupacion = await ocupacionDelDia(fecha);
  return ZONAS.filter((zona) => zonaTieneCupo(zona, personas, hora, ocupacion));
}

/** Todas las zonas con su estado de disponibilidad, para mostrarlas aunque esten llenas. */
export async function zonasConEstado(
  fecha: string,
  hora: string,
  personas: number
): Promise<Array<{ zona: Zona; ok: boolean }>> {
  const ocupacion = await ocupacionDelDia(fecha);
  return ZONAS.map((zona) => ({
    zona,
    ok: zonaTieneCupo(zona, personas, hora, ocupacion),
  }));
}

/** Horarios de un día que tienen al menos una zona con cupo para ese grupo. */
export async function horariosDisponibles(
  fecha: string,
  personas: number
): Promise<string[]> {
  const slots = horariosDelDia(fecha);
  if (slots.length === 0) return [];

  const ocupacion = await ocupacionDelDia(fecha);

  return slots.filter((hora) => ZONAS.some((zona) => zonaTieneCupo(zona, personas, hora, ocupacion)));
}
