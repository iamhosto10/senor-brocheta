import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { enviarCorreoRecordatorio } from "@/lib/reservas/email";
import { hoyISO } from "@/lib/reservas/fechas";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || request.headers.get("authorization") !== `Bearer ${secreto}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: reservas, error } = await admin
    .from("reservations")
    .select("*")
    .eq("fecha", hoyISO())
    .eq("estado", "confirmada")
    .not("email", "is", null)
    .is("recordatorio_enviado_at", null);

  if (error) {
    return NextResponse.json({ error: "No se pudieron leer las reservas" }, { status: 500 });
  }

  let enviados = 0;
  for (const reserva of reservas ?? []) {
    const ok = await enviarCorreoRecordatorio(reserva);
    if (ok) {
      await admin
        .from("reservations")
        .update({ recordatorio_enviado_at: new Date().toISOString() })
        .eq("id", reserva.id);
      enviados += 1;
    }
  }

  return NextResponse.json({ revisadas: reservas?.length ?? 0, enviados });
}
