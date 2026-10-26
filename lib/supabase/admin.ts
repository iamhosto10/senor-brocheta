import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente con privilegios elevados (service_role / secret key).
 * Solo se importa desde Server Actions o Route Handlers — "server-only"
 * hace que el build falle si algún Client Component intenta importarlo.
 * Usa la antelación mínima/máxima y la disponibilidad real para validar
 * reservas antes de guardarlas, sin exponer la clave secreta al navegador.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
