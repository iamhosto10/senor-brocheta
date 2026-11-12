"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { hoyISO } from "@/lib/reservas/fechas";
import {
  enviarCorreoCambioEstado,
  enviarAvisoCancelacionStaff,
} from "@/lib/reservas/email";

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

export async function cancelarReservaCliente(codigo: string, telefono: string) {
  const ultimos10 = soloDigitos(telefono).slice(-10);
  if (!/^[A-Za-z0-9]{6}$/.test(codigo) || ultimos10.length < 7) {
    return { ok: false as const, error: "Revisa el teléfono e intenta de nuevo." };
  }

  const admin = createAdminClient();
  const { data: reserva } = await admin
    .from("reservations")
    .select("id, telefono, fecha, estado")
    .eq("codigo", codigo.toUpperCase())
    .maybeSingle();

  // Mismo mensaje si no existe o si el teléfono no coincide, para no dar pistas.
  if (!reserva || soloDigitos(reserva.telefono).slice(-10) !== ultimos10) {
    return { ok: false as const, error: "El teléfono no coincide con el de la reserva." };
  }
  if (reserva.estado !== "pendiente" && reserva.estado !== "confirmada") {
    return { ok: false as const, error: "Esta reserva ya no se puede cancelar." };
  }
  if (reserva.fecha < hoyISO()) {
    return { ok: false as const, error: "Esta reserva ya pasó." };
  }

  const { data: cancelada, error } = await admin
    .from("reservations")
    .update({ estado: "cancelada" })
    .eq("id", reserva.id)
    .in("estado", ["pendiente", "confirmada"])
    .select()
    .maybeSingle();

  if (error || !cancelada) {
    return { ok: false as const, error: "No pudimos cancelar la reserva. Escríbenos por WhatsApp." };
  }

  try {
    await enviarCorreoCambioEstado(cancelada, "cancelada");
    await enviarAvisoCancelacionStaff(cancelada);
  } catch (e) {
    console.error("Error enviando correos de cancelación:", e);
  }

  return { ok: true as const };
}

/** Detalle completo de una reserva a partir de su código, para la vista pública del cliente. */
export async function buscarReservaPorCodigo(codigo: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("reservations")
    .select(
      "codigo, fecha, hora, personas, zona_id, estado, nombre, telefono, email, motivo, notas, cumpleanos, decoracion_id, banda_musical, created_at"
    )
    .eq("codigo", codigo.toUpperCase())
    .maybeSingle();

  if (error || !data) return null;
  return data;
}
