"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  enviarCorreoCambioEstado,
  enviarCorreoReservaModificada,
} from "@/lib/reservas/email";
import { slotsServicio } from "@/lib/reservas/capacidad";
import { ZONAS } from "@/lib/reservas/zonas";

const ZONA_IDS = ZONAS.map((z) => z.id) as [string, ...string[]];

const reservaAdminSchema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hora: z.string().refine((h) => slotsServicio().includes(h)),
  personas: z.number().int().min(1).max(48),
  zonaId: z.enum(ZONA_IDS),
  nombre: z.string().trim().min(2).max(120),
  telefono: z.string().trim().min(7).max(20),
  email: z.string().trim().email().optional().or(z.literal("")),
  motivo: z.string().trim().max(60).optional(),
  notas: z.string().trim().max(500).optional(),
});

export type ReservaAdminInput = z.infer<typeof reservaAdminSchema>;

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

export async function listarReservasDelDia(fecha: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reservations")
    .select("id, codigo, hora, personas, zona_id, nombre, estado")
    .eq("fecha", fecha)
    .in("estado", ["pendiente", "confirmada"])
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

export async function crearReservaManual(input: ReservaAdminInput, confirmar: boolean) {
  const parsed = reservaAdminSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Revisa los datos de la reserva." };
  }
  const data = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false as const, error: "Tu sesión expiró. Vuelve a entrar." };
  }

  const admin = createAdminClient();
  const { data: reserva, error } = await admin
    .from("reservations")
    .insert({
      fecha: data.fecha,
      hora: data.hora,
      personas: data.personas,
      zona_id: data.zonaId,
      nombre: data.nombre,
      telefono: data.telefono,
      email: data.email || null,
      motivo: data.motivo || null,
      notas: data.notas || null,
    })
    .select()
    .single();

  if (error || !reserva) {
    const mensaje =
      error?.code === "P0001" ? error.message : "No pudimos guardar la reserva.";
    return { ok: false as const, error: mensaje };
  }

  let aviso: string | undefined;

  if (confirmar) {
    const { data: reservaConfirmada, error: errorConfirmar } = await admin
      .from("reservations")
      .update({ estado: "confirmada" })
      .eq("id", reserva.id)
      .select()
      .single();

    if (errorConfirmar || !reservaConfirmada) {
      aviso =
        "La reserva se creó pero quedó PENDIENTE: no pudimos confirmarla. Confírmala desde su detalle.";
    } else {
      try {
        await enviarCorreoCambioEstado(reservaConfirmada, "confirmada");
      } catch (e) {
        console.error("Error enviando correo de confirmación:", e);
      }
    }
  }

  revalidatePath("/admin");
  return { ok: true as const, id: reserva.id as string, aviso };
}

export async function editarReserva(id: string, input: ReservaAdminInput) {
  const parsed = reservaAdminSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Revisa los datos de la reserva." };
  }
  const data = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false as const, error: "Tu sesión expiró. Vuelve a entrar." };
  }

  const { data: anterior } = await supabase
    .from("reservations")
    .select("fecha, hora, personas, zona_id")
    .eq("id", id)
    .maybeSingle();

  const { data: actualizada, error } = await supabase
    .from("reservations")
    .update({
      fecha: data.fecha,
      hora: data.hora,
      personas: data.personas,
      zona_id: data.zonaId,
      nombre: data.nombre,
      telefono: data.telefono,
      email: data.email || null,
      motivo: data.motivo || null,
      notas: data.notas || null,
    })
    .eq("id", id)
    .in("estado", ["pendiente", "confirmada"])
    .select()
    .maybeSingle();

  if (error) {
    const mensaje =
      error.code === "P0001" ? error.message : "No pudimos guardar los cambios.";
    return { ok: false as const, error: mensaje };
  }

  if (!actualizada) {
    return {
      ok: false as const,
      error: "Esta reserva ya está completada o cancelada y no se puede modificar.",
    };
  }

  const cambioLoImportante =
    !!anterior &&
    (anterior.fecha !== actualizada.fecha ||
      anterior.hora !== actualizada.hora ||
      anterior.personas !== actualizada.personas ||
      anterior.zona_id !== actualizada.zona_id);

  if (cambioLoImportante) {
    try {
      await enviarCorreoReservaModificada(actualizada);
    } catch (e) {
      console.error("Error enviando correo de reserva modificada:", e);
    }
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/${id}`);
  return { ok: true as const };
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
