-- ARCHIVO GENERADO por scripts/generar-sql-capacidad.mjs. No editar a mano.
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
  v_duracion constant int := 120;
  v_hora_new int;
begin
  -- Solo las reservas activas ocupan cupo.
  if NEW.estado not in ('pendiente', 'confirmada') then
    return NEW;
  end if;

  -- Capacidad de cada zona en unidades de 4 puestos.
  case NEW.zona_id
    when 'zona1' then v_capacidad_unidades := 12;
    when 'zona2' then v_capacidad_unidades := 15;
    when 'zona3' then v_capacidad_unidades := 10;
    when 'zona4' then v_capacidad_unidades := 9;
    when 'zona5' then v_capacidad_unidades := 12;
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
