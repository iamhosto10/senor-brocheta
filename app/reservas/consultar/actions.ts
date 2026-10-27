"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const telefonoSchema = z.string().trim().min(7).max(20);

function soloDigitos(s: string): string {
  return s.replace(/\D/g, "");
}

/**
 * Busca reservas por teléfono comparando los últimos 10 dígitos, así da
 * igual si el usuario escribe con o sin +57, espacios, etc.
 */
export async function buscarReservasPorTelefono(telefono: string) {
  const parsed = telefonoSchema.safeParse(telefono);
  if (!parsed.success) return [];

  const ultimos10 = soloDigitos(parsed.data).slice(-10);
  if (ultimos10.length < 7) return [];

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("reservations")
    .select("codigo, fecha, hora, personas, zona_id, estado, nombre, telefono")
    .order("fecha", { ascending: false })
    .limit(200);

  if (error || !data) return [];

  return data
    .filter((r) => soloDigitos(r.telefono).slice(-10) === ultimos10)
    .slice(0, 20)
    .map((r) => ({
      codigo: r.codigo,
      fecha: r.fecha,
      hora: r.hora,
      personas: r.personas,
      zona_id: r.zona_id,
      estado: r.estado,
      nombre: r.nombre,
    }));
}
