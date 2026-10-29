"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { enviarCorreoCambioEstado } from "@/lib/reservas/email";

export async function listarReservas() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("fecha", { ascending: true })
    .order("hora", { ascending: true });

  if (error) return [];
  return data;
}

export async function obtenerReserva(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return null;
  return data;
}

const ESTADOS_VALIDOS = ["pendiente", "confirmada", "cancelada", "completada"];

export async function actualizarEstadoReserva(id: string, estado: string) {
  if (!ESTADOS_VALIDOS.includes(estado)) return { ok: false as const };

  const supabase = await createClient();
  // Una reserva completada o cancelada es un estado final: no se puede reabrir.
  const { data: reserva, error } = await supabase
    .from("reservations")
    .update({ estado })
    .eq("id", id)
    .in("estado", ["pendiente", "confirmada"])
    .select()
    .maybeSingle();

  if (error) {
    // P0001: el trigger de capacidad rechazó el cambio (p. ej. la zona ya se
    // llenó para esa hora).
    const mensaje =
      error.code === "P0001" ? error.message : "No pudimos actualizar la reserva.";
    return { ok: false as const, error: mensaje };
  }

  if (!reserva) {
    return {
      ok: false as const,
      error: "Esta reserva ya está completada o cancelada y no se puede modificar.",
    };
  }

  // Avisa al cliente por correo cuando pasa a confirmada, cancelada o completada.
  if (
    reserva &&
    (estado === "confirmada" || estado === "cancelada" || estado === "completada")
  ) {
    try {
      await enviarCorreoCambioEstado(reserva, estado);
    } catch (e) {
      console.error("Error enviando correo de cambio de estado:", e);
    }
  }

  revalidatePath("/admin");
  return { ok: true as const };
}
