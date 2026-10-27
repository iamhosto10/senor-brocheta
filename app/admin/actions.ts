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
  const { data: reserva, error } = await supabase
    .from("reservations")
    .update({ estado })
    .eq("id", id)
    .select()
    .single();

  if (error) return { ok: false as const };

  // Avisa al cliente por correo solo cuando pasa a confirmada o cancelada.
  if (reserva && (estado === "confirmada" || estado === "cancelada")) {
    try {
      await enviarCorreoCambioEstado(reserva, estado);
    } catch (e) {
      console.error("Error enviando correo de cambio de estado:", e);
    }
  }

  revalidatePath("/admin");
  return { ok: true as const };
}
