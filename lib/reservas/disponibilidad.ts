import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { RESERVAS_CONFIG } from "./config";
import { ZONAS, capacidadZona, type Zona } from "./zonas";

const ESTADOS_ACTIVOS = ["pendiente", "confirmada"];

function parseHora(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function formatHora(minutos: number): string {
  const h = Math.floor(minutos / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutos % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

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
  const ventanas =
    RESERVAS_CONFIG.serviceWindowsPorDia[diaSemana(fecha)] ?? RESERVAS_CONFIG.serviceWindows;

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

/**
 * Unidades de 4 puestos que ocupa un grupo en una zona concreta.
 * Tanto en zonas flexibles como de mesas fijas, el personal puede juntar varias
 * mesas para un grupo grande, así que el límite real es la capacidad total de la
 * zona (validada aparte en zonaTieneCupo), no el tamaño de una sola mesa.
 */
function unidadesNecesarias(personas: number): number | null {
  return Math.ceil(personas / 4);
}

type ReservaExistente = { hora: string; personas: number; zona_id: string };

function seSolapan(horaA: string, horaB: string): boolean {
  const duracion = RESERVAS_CONFIG.tableMinutes + RESERVAS_CONFIG.turnoverMinutes;
  const inicioA = parseHora(horaA);
  const inicioB = parseHora(horaB);
  return inicioA < inicioB + duracion && inicioB < inicioA + duracion;
}

async function ocupacionDelDia(fecha: string): Promise<ReservaExistente[]> {
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
  ocupacion: ReservaExistente[]
): boolean {
  const necesarias = unidadesNecesarias(personas);
  if (necesarias === null) return false;

  const ocupadasEnZona = ocupacion
    .filter((r) => r.zona_id === zona.id && seSolapan(r.hora, hora))
    .reduce((sum, r) => sum + (unidadesNecesarias(r.personas) ?? 0), 0);

  return ocupadasEnZona + necesarias <= capacidadZona(zona) / 4;
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

  return slots.filter((hora) =>
    ZONAS.some((zona) => {
      const necesarias = unidadesNecesarias(personas);
      if (necesarias === null) return false;
      const ocupadasEnZona = ocupacion
        .filter((r) => r.zona_id === zona.id && seSolapan(r.hora, hora))
        .reduce((sum, r) => sum + (unidadesNecesarias(r.personas) ?? 0), 0);
      return ocupadasEnZona + necesarias <= capacidadZona(zona) / 4;
    })
  );
}
