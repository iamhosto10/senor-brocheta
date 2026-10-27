"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  zonasDisponibles,
  zonasConEstado,
  horariosDisponibles,
  horariosDelDia,
} from "@/lib/reservas/disponibilidad";
import { ZONAS } from "@/lib/reservas/zonas";
import { construirUrlWhatsApp } from "@/lib/reservas/mensaje";

const ZONA_IDS = ZONAS.map((z) => z.id) as [string, ...string[]];

const reservaSchema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hora: z.string().regex(/^\d{2}:\d{2}$/),
  personas: z.number().int().min(1).max(48),
  zonaId: z.enum(ZONA_IDS),
  nombre: z.string().trim().min(2).max(120),
  telefono: z.string().trim().min(7).max(20),
  email: z.string().trim().email().optional().or(z.literal("")),
  motivo: z.string().trim().max(60).optional(),
  notas: z.string().trim().max(500).optional(),
  cumpleanos: z.boolean().default(false),
  decoracionId: z.string().optional(),
  bandaMusical: z.boolean().default(false),
});

export type ReservaInput = z.infer<typeof reservaSchema>;

export async function horariosParaFecha(fecha: string, personas: number) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return [];
  return horariosDisponibles(fecha, personas);
}

export async function zonasParaFechaHora(fecha: string, hora: string, personas: number) {
  return zonasConEstado(fecha, hora, personas);
}

export async function crearReserva(input: ReservaInput) {
  const parsed = reservaSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Datos de la reserva inválidos." };
  }
  const data = parsed.data;

  // La hora pedida debe seguir siendo una de las horas válidas de ese día
  // (antelación mínima, etc.) — por si el formulario quedó abierto un rato.
  if (!horariosDelDia(data.fecha).includes(data.hora)) {
    return { ok: false as const, error: "Esa hora ya no está disponible. Elige otra." };
  }

  // Vuelve a validar el cupo real de la zona: otra persona pudo reservar mientras tanto.
  const disponibles = await zonasDisponibles(data.fecha, data.hora, data.personas);
  if (!disponibles.some((z) => z.id === data.zonaId)) {
    return {
      ok: false as const,
      error: "Esa zona ya no tiene cupo para esa hora y ese número de personas.",
    };
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
      cumpleanos: data.cumpleanos,
      decoracion_id: data.decoracionId || null,
      banda_musical: data.bandaMusical,
    })
    .select()
    .single();

  if (error || !reserva) {
    return { ok: false as const, error: "No pudimos guardar la reserva. Intenta de nuevo." };
  }

  return {
    ok: true as const,
    codigo: reserva.codigo as string,
    whatsappUrl: construirUrlWhatsApp(reserva),
  };
}

const telefonoSchema = z.string().trim().min(7).max(20);

export async function buscarReservasPorTelefono(telefono: string) {
  const parsed = telefonoSchema.safeParse(telefono);
  if (!parsed.success) return [];

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("reservations")
    .select("codigo, fecha, hora, personas, zona_id, estado, nombre")
    .eq("telefono", parsed.data)
    .order("fecha", { ascending: false })
    .limit(20);

  if (error) return [];
  return data;
}
