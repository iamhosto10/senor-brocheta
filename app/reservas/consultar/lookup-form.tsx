"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ZONAS } from "@/lib/reservas/zonas";
import { buscarReservasPorTelefono } from "./actions";

type ResultadoReserva = {
  codigo: string;
  fecha: string;
  hora: string;
  personas: number;
  zona_id: string;
  estado: string;
  nombre: string;
};

const ESTADO_LABEL: Record<string, string> = {
  pendiente: "pendiente",
  confirmada: "confirmada",
  cancelada: "cancelada",
  completada: "completada",
};

function zonaName(id: string) {
  return ZONAS.find((z) => z.id === id)?.name ?? id;
}

export function LookupForm() {
  const [telefono, setTelefono] = useState("");
  const [pending, startTransition] = useTransition();
  const [buscado, setBuscado] = useState(false);
  const [resultados, setResultados] = useState<ResultadoReserva[]>([]);

  function buscar() {
    const digitos = telefono.replace(/\D/g, "");
    if (digitos.length < 7) {
      setBuscado(true);
      setResultados([]);
      return;
    }
    startTransition(async () => {
      const data = await buscarReservasPorTelefono(telefono);
      setResultados(data);
      setBuscado(true);
    });
  }

  return (
    <div className="rt-wrap">
      <div className="rt-card">
        <h2 style={{ marginBottom: 16, fontSize: "1.1rem" }}>Busca por tu teléfono</h2>
        <div className="rt-field" style={{ marginBottom: 14 }}>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscar()}
            placeholder="+57 300 000 0000"
          />
          <div className="hint" style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 8 }}>
            Escribe el número completo con el que hiciste la reserva.
          </div>
        </div>
        <button type="button" className="rt-btn rt-btn-primary" onClick={buscar} disabled={pending}>
          {pending ? "Buscando…" : "Buscar"}
        </button>
      </div>

      <div style={{ marginTop: 18 }}>
        {buscado && telefono.replace(/\D/g, "").length < 7 && (
          <div className="rt-empty">
            <h3>Escribe tu número completo</h3>
            <p>Ingresa el número de teléfono con el que hiciste la reserva.</p>
          </div>
        )}

        {buscado && telefono.replace(/\D/g, "").length >= 7 && !pending && resultados.length === 0 && (
          <div className="rt-empty">
            <h3>No encontramos reservas</h3>
            <p>Revisa el número o haz una nueva reserva.</p>
          </div>
        )}

        {resultados.map((r) => (
          <Link
            key={r.codigo}
            href={`/reservas/consultar/${r.codigo}`}
            className="rt-res-row"
            style={{ cursor: "pointer" }}
          >
            <div className="rt-res-time">
              {r.hora}
              <span className="date">{r.fecha}</span>
            </div>
            <div className="rt-res-main">
              <div className="name">
                {r.nombre} · {r.personas}p
              </div>
              <div className="meta">
                {zonaName(r.zona_id)} · Código {r.codigo}
              </div>
            </div>
            <span className={`rt-badge rt-badge-${r.estado}`}>
              {ESTADO_LABEL[r.estado] ?? r.estado}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
