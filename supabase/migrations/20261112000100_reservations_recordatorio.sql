alter table public.reservations
  add column if not exists recordatorio_enviado_at timestamptz;
