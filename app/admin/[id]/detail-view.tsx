"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ZONAS } from "@/lib/reservas/zonas";
import { DECORACIONES } from "@/lib/reservas/decoraciones";
import { RESERVAS_CONFIG } from "@/lib/reservas/config";
import { formatearFechaLarga, fmtTime12 } from "@/lib/reservas/fechas";
import { actualizarEstadoReserva, editarReserva } from "../actions";
import { ReservaForm } from "../reserva-form";

type Reserva = {
  id: string;
  codigo: string;
  fecha: string;
  hora: string;
  personas: number;
  zona_id: string;
  nombre: string;
  telefono: string;
  email: string | null;
  motivo: string | null;
  notas: string | null;
  cumpleanos: boolean;
  decoracion_id: string | null;
  banda_musical: boolean;
  estado: string;
  created_at?: string;
};

const ESTADOS = ["pendiente", "confirmada", "cancelada", "completada"] as const;

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

export function ReservaDetailView({ reserva }: { reserva: Reserva }) {
  const router = useRouter();
  const [estado, setEstado] = useState(reserva.estado);
  const [editando, setEditando] = useState(false);
  const [pending, startTransition] = useTransition();

  const deco = DECORACIONES.find((d) => d.id === reserva.decoracion_id);
  const bloqueada = estado === "completada" || estado === "cancelada";
  const digitosTel = reserva.telefono.replace(/\D/g, "");
  const telWhatsApp = digitosTel.length === 10 ? `57${digitosTel}` : digitosTel;

  function cambiarEstado(nuevo: string) {
    const anterior = estado;
    setEstado(nuevo);
    startTransition(async () => {
      const res = await actualizarEstadoReserva(reserva.id, nuevo);
      if (!res.ok) {
        setEstado(anterior);
        alert(res.error ?? "No pudimos actualizar la reserva.");
      }
    });
  }

  return (
    <div className="rt-wrap" style={{ paddingTop: 20 }}>
      <div className="rt-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div className="rt-ticket-code">{reserva.codigo}</div>
          {bloqueada ? (
            <span className={`rt-badge rt-badge-${estado}`}>{ESTADO_LABEL[estado]}</span>
          ) : (
            <select
              value={estado}
              disabled={pending}
              onChange={(e) => cambiarEstado(e.target.value)}
              className={`rt-badge rt-badge-${estado}`}
              style={{ border: "none", cursor: "pointer" }}
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {ESTADO_LABEL[e]}
                </option>
              ))}
            </select>
          )}
        </div>

        {editando ? (
          <>
            <ReservaForm
              inicial={{
                fecha: reserva.fecha,
                hora: reserva.hora,
                personas: reserva.personas,
                zonaId: reserva.zona_id,
                nombre: reserva.nombre,
                telefono: reserva.telefono,
                email: reserva.email ?? "",
                motivo: reserva.motivo ?? "",
                notas: reserva.notas ?? "",
              }}
              textoBoton="Guardar cambios"
              onSubmit={async (datos) => {
                const res = await editarReserva(reserva.id, datos);
                if (res.ok) {
                  setEditando(false);
                  router.refresh();
                }
                return res;
              }}
            />
            <button
              type="button"
              className="rt-btn rt-btn-ghost"
              style={{ marginTop: 10, width: "100%" }}
              onClick={() => setEditando(false)}
            >
              Cancelar edición
            </button>
          </>
        ) : (
        <>
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
              v={`Sí${deco && deco.price > 0 ? ` · ${deco.name} ($${deco.price.toLocaleString("es-CO")})` : ""}`}
            />
          )}
          {reserva.banda_musical && (
            <Fila
              k="Banda musical"
              v={`Sí · cargo de $${RESERVAS_CONFIG.bandaMusicalCobro.toLocaleString("es-CO")}`}
            />
          )}
          {reserva.notas && <Fila k="Notas" v={reserva.notas} />}
          {reserva.created_at && (
            <Fila
              k="Creada"
              v={new Intl.DateTimeFormat("es-CO", {
                timeZone: "America/Bogota",
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(reserva.created_at))}
            />
          )}
        </div>

        {!bloqueada && (
          <button
            type="button"
            className="rt-btn rt-btn-ghost"
            style={{ marginTop: 16, width: "100%" }}
            onClick={() => setEditando(true)}
          >
            Editar reserva
          </button>
        )}
        </>
        )}

        <a
          href={`https://wa.me/${telWhatsApp}`}
          target="_blank"
          rel="noreferrer"
          className="rt-btn rt-btn-primary"
          style={{ display: "block", textAlign: "center", marginTop: 20 }}
        >
          Escribir por WhatsApp
        </a>
      </div>
    </div>
  );
}
