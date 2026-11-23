"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { hoyISO } from "@/lib/reservas/fechas";
import {
  enviarCorreoCambioEstado,
  enviarAvisoCancelacionStaff,
} from "@/lib/reservas/email";

const ERROR_NO_COINCIDE =
  "No encontramos una reserva con ese código y ese teléfono. Revisa los datos.";

function soloDigitos(s: string): string {
  return s.replace(/\D/g, "");
}

/**
 * Devuelve la reserva solo si el código existe Y el teléfono coincide
 * (últimos 10 dígitos). Si falla cualquiera de los dos devuelve null, sin
 * distinguir cuál, para no dar pistas.
 */
async function reservaVerificada(codigo: string, telefono: string) {
  const ultimos10 = soloDigitos(telefono).slice(-10);
  if (!/^[A-Za-z0-9]{6}$/.test(codigo.trim()) || ultimos10.length < 7) return null;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("reservations")
    .select("*")
    .eq("codigo", codigo.trim().toUpperCase())
    .maybeSingle();

  if (error || !data) return null;
  if (soloDigitos(data.telefono).slice(-10) !== ultimos10) return null;
  return data;
}

function esCancelable(reserva: { estado: string; fecha: string }): boolean {
  return (
    (reserva.estado === "pendiente" || reserva.estado === "confirmada") &&
    reserva.fecha >= hoyISO()
  );
}

/** Consulta pública: exige código y teléfono. */
export async function consultarReserva(codigo: string, telefono: string) {
  const reserva = await reservaVerificada(codigo, telefono);
  if (!reserva) return { ok: false as const, error: ERROR_NO_COINCIDE };

  return {
    ok: true as const,
    cancelable: esCancelable(reserva),
    reserva: {
      codigo: reserva.codigo as string,
      fecha: reserva.fecha as string,
      hora: reserva.hora as string,
      personas: reserva.personas as number,
      zona_id: reserva.zona_id as string,
      estado: reserva.estado as string,
      nombre: reserva.nombre as string,
      motivo: reserva.motivo as string | null,
      notas: reserva.notas as string | null,
      cumpleanos: reserva.cumpleanos as boolean,
      decoracion_id: reserva.decoracion_id as string | null,
      banda_musical: reserva.banda_musical as boolean,
    },
  };
}

/** Cancelación por el cliente: exige código y teléfono. */
export async function cancelarReservaCliente(codigo: string, telefono: string) {
  const reserva = await reservaVerificada(codigo, telefono);
  if (!reserva) return { ok: false as const, error: ERROR_NO_COINCIDE };
  if (!esCancelable(reserva)) {
    return { ok: false as const, error: "Esta reserva ya no se puede cancelar." };
  }

  const admin = createAdminClient();
  const { data: cancelada, error } = await admin
    .from("reservations")
    .update({ estado: "cancelada" })
    .eq("id", reserva.id)
    .in("estado", ["pendiente", "confirmada"])
    .select()
    .maybeSingle();

  if (error || !cancelada) {
    return {
      ok: false as const,
      error: "No pudimos cancelar la reserva. Escríbenos por WhatsApp.",
    };
  }

  try {
    await enviarCorreoCambioEstado(cancelada, "cancelada");
    await enviarAvisoCancelacionStaff(cancelada);
  } catch (e) {
    console.error("Error enviando correos de cancelación:", e);
  }

  return { ok: true as const };
}
