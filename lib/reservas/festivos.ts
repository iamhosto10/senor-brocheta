/**
 * Festivos oficiales de Colombia, calculados por fórmula (Ley Emiliani + fecha de Pascua),
 * no por una lista que haya que actualizar cada año. Funciona para cualquier año sin
 * mantenimiento manual.
 *
 * 18 festivos al año:
 * - 6 fijos, nunca se mueven: 1 ene, 1 may, 20 jul, 7 ago, 8 dic, 25 dic.
 * - 7 que se trasladan al lunes siguiente si no caen en lunes (Ley Emiliani): Reyes Magos
 *   (6 ene), San José (19 mar), San Pedro y San Pablo (29 jun), Asunción de la Virgen
 *   (15 ago), Día de la Raza (12 oct), Todos los Santos (1 nov), Independencia de
 *   Cartagena (11 nov).
 * - 5 que dependen de la fecha de Pascua: Jueves Santo y Viernes Santo (no se mueven, caen
 *   siempre esos días), y Ascensión, Corpus Christi y Sagrado Corazón (sí se trasladan al
 *   lunes siguiente).
 */

/** Domingo de Pascua para un año dado (algoritmo de Gauss / Meeus-Jones-Butcher). */
function domingoDePascua(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31); // 3 = marzo, 4 = abril
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, mes - 1, dia));
}

function sumarDias(fecha: Date, dias: number): Date {
  const copia = new Date(fecha.getTime());
  copia.setUTCDate(copia.getUTCDate() + dias);
  return copia;
}

/** Ley Emiliani: si la fecha no cae en lunes, se traslada al lunes siguiente. */
function trasladarALunes(fecha: Date): Date {
  const dias = (8 - fecha.getUTCDay()) % 7; // 0 si ya es lunes
  return dias === 0 ? fecha : sumarDias(fecha, dias);
}

function aISO(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

const cachePorAnio = new Map<number, Set<string>>();

function festivosDelAnio(year: number): Set<string> {
  const cacheado = cachePorAnio.get(year);
  if (cacheado) return cacheado;

  const fijos = ([
    [1, 1], // Año Nuevo
    [5, 1], // Día del Trabajo
    [7, 20], // Independencia
    [8, 7], // Batalla de Boyacá
    [12, 8], // Inmaculada Concepción
    [12, 25], // Navidad
  ] as const).map(([mes, dia]) => new Date(Date.UTC(year, mes - 1, dia)));

  const trasladables = ([
    [1, 6], // Reyes Magos
    [3, 19], // San José
    [6, 29], // San Pedro y San Pablo
    [8, 15], // Asunción de la Virgen
    [10, 12], // Día de la Raza
    [11, 1], // Todos los Santos
    [11, 11], // Independencia de Cartagena
  ] as const).map(([mes, dia]) => trasladarALunes(new Date(Date.UTC(year, mes - 1, dia))));

  const pascua = domingoDePascua(year);
  const basadosEnPascua = [
    sumarDias(pascua, -3), // Jueves Santo
    sumarDias(pascua, -2), // Viernes Santo
    trasladarALunes(sumarDias(pascua, 39)), // Ascensión del Señor
    trasladarALunes(sumarDias(pascua, 60)), // Corpus Christi
    trasladarALunes(sumarDias(pascua, 68)), // Sagrado Corazón de Jesús
  ];

  const set = new Set([...fijos, ...trasladables, ...basadosEnPascua].map(aISO));
  cachePorAnio.set(year, set);
  return set;
}

/** true si `fecha` ("YYYY-MM-DD") es festivo en Colombia. */
export function esFestivoColombia(fecha: string): boolean {
  const year = Number(fecha.slice(0, 4));
  return festivosDelAnio(year).has(fecha);
}
