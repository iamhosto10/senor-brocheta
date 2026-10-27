import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ZONAS } from "@/lib/reservas/zonas";
import { DECORACIONES } from "@/lib/reservas/decoraciones";
import { RESERVAS_CONFIG } from "@/lib/reservas/config";
import { formatearFechaLarga, fmtTime12 } from "@/lib/reservas/fechas";
import { buscarReservaPorCodigo } from "../actions";

export const metadata: Metadata = {
  title: "Detalle de mi reserva | Sr. Brocheta",
};

const ESTADO_LABEL: Record<string, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  cancelada: "Cancelada",
  completada: "Completada",
};

function zonaName(id: string) {
  return ZONAS.find((z) => z.id === id)?.name ?? id;
}

function Fila({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="rt-detail-row">
      <span className="k">{k}</span>
      <span className="v">{v}</span>
    </div>
  );
}

export default async function DetalleReservaClientePage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const reserva = await buscarReservaPorCodigo(codigo);
  if (!reserva) notFound();

  const deco = DECORACIONES.find((d) => d.id === reserva.decoracion_id);
  const whatsapp = `https://wa.me/${RESERVAS_CONFIG.whatsappNumber}`;

  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="rt-wrap" style={{ paddingBottom: 0 }}>
        <div className="rt-topbar">
          <Link href="/reservas/consultar" className="rt-icon-btn" aria-label="Volver a la búsqueda">
            ←
          </Link>
          <span className="rt-topbar-title">Mi reserva</span>
        </div>
      </div>

      <div className="rt-wrap" style={{ paddingTop: 20 }}>
        <div className="rt-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div className="rt-ticket-code">{reserva.codigo}</div>
            <span className={`rt-badge rt-badge-${reserva.estado}`}>
              {ESTADO_LABEL[reserva.estado] ?? reserva.estado}
            </span>
          </div>

          <div className="rt-detail-list">
            <Fila k="Fecha" v={formatearFechaLarga(reserva.fecha)} />
            <Fila k="Hora" v={fmtTime12(reserva.hora)} />
            <Fila k="Personas" v={reserva.personas} />
            <Fila k="Zona" v={zonaName(reserva.zona_id)} />
            <Fila k="Nombre" v={reserva.nombre} />
            <Fila k="Teléfono" v={reserva.telefono} />
            {reserva.email && <Fila k="Correo" v={reserva.email} />}
            {reserva.motivo && <Fila k="Motivo" v={reserva.motivo} />}
            {reserva.cumpleanos && (
              <Fila
                k="Cumpleaños"
                v={`Sí${deco && deco.price > 0 ? ` · ${deco.name}` : ""}`}
              />
            )}
            {reserva.banda_musical && <Fila k="Banda musical" v="Sí" />}
            {reserva.notas && <Fila k="Notas" v={reserva.notas} />}
          </div>

          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="rt-btn rt-btn-primary"
            style={{ display: "block", textAlign: "center", marginTop: 20 }}
          >
            Escribirnos por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
