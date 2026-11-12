// Genera el SQL del trigger de cupo a partir de lib/reservas/reglas.json,
// para que la base de datos y la aplicación usen siempre los mismos números.
// Uso: npm run reglas:sql   (escribe el archivo)
//      npm run reglas:check (falla si el archivo no está al día)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const reglas = JSON.parse(readFileSync("lib/reservas/reglas.json", "utf8"));
const destino = "supabase/migrations/20261112000000_reservations_check_capacidad.sql";

const duracion = reglas.tableMinutes + reglas.turnoverMinutes;

const casos = Object.entries(reglas.zonas)
  .map(([id, z]) => {
    const unidades = z.units !== undefined ? z.units : ((z.t8 ?? 0) * 8 + (z.t4 ?? 0) * 4) / 4;
    return `    when '${id}' then v_capacidad_unidades := ${unidades};`;
  })
  .join("\n");

const sql = `-- ARCHIVO GENERADO por scripts/generar-sql-capacidad.mjs. No editar a mano.
-- Para cambiar capacidades o duración: edita lib/reservas/reglas.json y corre "npm run reglas:sql".
create or replace function public.reservations_check_capacidad()
 returns trigger
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  v_capacidad_unidades numeric;
  v_necesarias int;
  v_ocupadas numeric;
  v_duracion constant int := ${duracion};
  v_hora_new int;
begin
  -- Solo las reservas activas ocupan cupo.
  if NEW.estado not in ('pendiente', 'confirmada') then
    return NEW;
  end if;

  -- Capacidad de cada zona en unidades de 4 puestos.
  case NEW.zona_id
${casos}
    else
      raise exception 'Zona desconocida: %', NEW.zona_id;
  end case;

  -- En todas las zonas un grupo ocupa ceil(personas / 4) unidades.
  v_necesarias := ceil(NEW.personas::numeric / 4);

  -- Serializa las reservas de la misma zona y día.
  perform pg_advisory_xact_lock(hashtextextended(NEW.zona_id || NEW.fecha::text, 0));

  v_hora_new := (split_part(NEW.hora, ':', 1)::int * 60) + split_part(NEW.hora, ':', 2)::int;

  select coalesce(sum(ceil(r.personas::numeric / 4)), 0)
  into v_ocupadas
  from public.reservations r
  where r.zona_id = NEW.zona_id
    and r.fecha = NEW.fecha
    and r.estado in ('pendiente', 'confirmada')
    and r.id is distinct from NEW.id
    and (
      (split_part(r.hora, ':', 1)::int * 60 + split_part(r.hora, ':', 2)::int)
        < v_hora_new + v_duracion
      and v_hora_new
        < (split_part(r.hora, ':', 1)::int * 60 + split_part(r.hora, ':', 2)::int) + v_duracion
    );

  if v_ocupadas + v_necesarias > v_capacidad_unidades then
    raise exception 'Esa zona ya no tiene cupo para esa hora y ese número de personas.'
      using errcode = 'P0001';
  end if;

  return NEW;
end;
$function$;
`;

if (process.argv.includes("--check")) {
  let actual = "";
  try {
    actual = readFileSync(destino, "utf8");
  } catch {
    // el archivo no existe todavía
  }
  if (actual !== sql) {
    console.error(`${destino} no está al día. Corre "npm run reglas:sql".`);
    process.exit(1);
  }
  console.log("El SQL del trigger está al día con reglas.json.");
} else {
  mkdirSync("supabase/migrations", { recursive: true });
  writeFileSync(destino, sql);
  console.log(`Escrito ${destino}`);
}
