"use client";

import { useState, useTransition } from "react";
import { ZONAS } from "@/lib/reservas/zonas";
import { DECORACIONES } from "@/lib/reservas/decoraciones";
import { RESERVAS_CONFIG } from "@/lib/reservas/config";
import { formatearFechaLarga, fmtTime12 } from "@/lib/reservas/fechas";
import { consultarReserva, cancelarReservaCliente } from "./actions";

type Detalle = {
  codigo: string;
  fecha: string;
  hora: string;
  personas: number;
  zona_id: string;
  estado: string;
  nombre: string;
  motivo: string | null;
  notas: string | null;
  cumpleanos: boolean;
  decoracion_id: string | null;
  banda_musical: boolean;
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

export function LookupForm() {
  const [codigo, setCodigo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [reserva, setReserva] = useState<Detalle | null>(null);
  const [cancelable, setCancelable] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [errorCancelar, setErrorCancelar] = useState<string | null>(null);
  const [cancelada, setCancelada] = useState(false);

  const whatsapp = `https://wa.me/${RESERVAS_CONFIG.whatsappNumber}`;

  function buscar() {
    setError(null);
    setReserva(null);
    setConfirmando(false);
    setErrorCancelar(null);
    setCancelada(false);
    startTransition(async () => {
      const res = await consultarReserva(codigo, telefono);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setReserva(res.reserva);
      setCancelable(res.cancelable);
    });
  }

  function cancelar() {
    setErrorCancelar(null);
    startTransition(async () => {
      const res = await cancelarReservaCliente(codigo, telefono);
      if (!res.ok) {
        setErrorCancelar(res.error);
        return;
      }
      setCancelada(true);
      setCancelable(false);
      setConfirmando(false);
      setReserva((r) => (r ? { ...r, estado: "cancelada" } : r));
    });
  }

  const deco = reserva
    ? DECORACIONES.find((d) => d.id === reserva.decoracion_id)
    : undefined;

  return (
    <div className="rt-wrap">
      <div className="rt-card">
        <h2 style={{ marginBottom: 16, fontSize: "1.1rem" }}>Busca tu reserva</h2>
        <div className="rt-field">
          <label htmlFor="c-codigo">Código de reserva</label>
          <input
            id="c-codigo"
            value={codigo}
            maxLength={6}
            autoCapitalize="characters"
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            placeholder="Ej: 2F5AED"
          />
        </div>
        <div className="rt-field" style={{ marginBottom: 14 }}>
          <label htmlFor="c-telefono">Teléfono</label>
          <input
            id="c-telefono"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscar()}
            placeholder="+57 300 000 0000"
          />
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 8 }}>
            El código te lo dimos al terminar tu solicitud. Escribe el teléfono
            con el que reservaste.
          </div>
        </div>
        {error && (
          <p style={{ color: "var(--accent)", fontSize: "0.85rem", marginBottom: 14 }}>
            {error}
          </p>
        )}
        <button
          type="button"
          className="rt-btn rt-btn-primary"
          onClick={buscar}
          disabled={pending || codigo.trim().length !== 6 || telefono.replace(/\D/g, "").length < 7}
        >
          {pending && !reserva ? "Buscando…" : "Buscar"}
        </button>
        <a
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
          className="rt-link-btn"
          style={{ display: "block", marginTop: 14, textAlign: "center" }}
        >
          ¿No tienes tu código? Escríbenos por WhatsApp
        </a>
      </div>

      {reserva && (
        <div className="rt-card" style={{ marginTop: 18 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
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

          {cancelada && (
            <p style={{ color: "var(--text-muted)", marginTop: 16 }}>
              Tu reserva quedó cancelada. Si fue un error, escríbenos por WhatsApp.
            </p>
          )}

          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="rt-btn rt-btn-primary"
            style={{ display: "block", textAlign: "center", marginTop: 20 }}
          >
            Escribirnos por WhatsApp
          </a>

          {cancelable && !confirmando && (
            <button
              type="button"
              className="rt-btn rt-btn-ghost"
              style={{ marginTop: 10 }}
              onClick={() => setConfirmando(true)}
            >
              Cancelar mi reserva
            </button>
          )}

          {cancelable && confirmando && (
            <div style={{ marginTop: 16 }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 10 }}>
                ¿Seguro que quieres cancelar esta reserva? No se puede deshacer.
              </p>
              {errorCancelar && (
                <p style={{ color: "var(--accent)", fontSize: "0.85rem", marginBottom: 10 }}>
                  {errorCancelar}
                </p>
              )}
              <button
                type="button"
                className="rt-btn rt-btn-primary"
                disabled={pending}
                onClick={cancelar}
              >
                {pending ? "Cancelando…" : "Sí, cancelar mi reserva"}
              </button>
              <button
                type="button"
                className="rt-btn rt-btn-ghost"
                style={{ marginTop: 8 }}
                onClick={() => {
                  setConfirmando(false);
                  setErrorCancelar(null);
                }}
              >
                No, conservarla
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
