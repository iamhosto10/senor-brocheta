"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

const ESTADOS_VALIDOS = ["pendiente", "confirmada", "cancelada", "completada"];

export async function actualizarEstadoReserva(id: string, estado: string) {
  if (!ESTADOS_VALIDOS.includes(estado)) return { ok: false as const };

  const supabase = await createClient();
  const { error } = await supabase
    .from("reservations")
    .update({ estado })
    .eq("id", id);

  if (error) return { ok: false as const };
  revalidatePath("/admin");
  return { ok: true as const };
}
