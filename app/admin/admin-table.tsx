"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ZONAS } from "@/lib/reservas/zonas";
import { createClient } from "@/lib/supabase/client";
import { actualizarEstadoReserva } from "./actions";

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
  banda_musical: boolean;
  estado: string;
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

function exportarCSV(reservas: Reserva[]) {
  const headers = [
    "codigo",
    "fecha",
    "hora",
    "personas",
    "zona",
    "nombre",
    "telefono",
    "email",
    "motivo",
    "estado",
  ];
  const filas = reservas.map((r) =>
    [
      r.codigo,
      r.fecha,
      r.hora,
      r.personas,
      zonaName(r.zona_id),
      r.nombre,
      r.telefono,
      r.email ?? "",
      r.motivo ?? "",
      r.estado,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [headers.join(","), ...filas].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reservas-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminTable({ reservasIniciales }: { reservasIniciales: Reserva[] }) {
  const router = useRouter();
  const [reservas, setReservas] = useState(reservasIniciales);
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroZona, setFiltroZona] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [pending, startTransition] = useTransition();

  const filtradas = useMemo(() => {
    return reservas.filter((r) => {
      if (filtroFecha && r.fecha !== filtroFecha) return false;
      if (filtroZona && r.zona_id !== filtroZona) return false;
      if (filtroEstado && r.estado !== filtroEstado) return false;
      return true;
    });
  }, [reservas, filtroFecha, filtroZona, filtroEstado]);

  function cambiarEstado(id: string, estado: string) {
    setReservas((prev) => prev.map((r) => (r.id === id ? { ...r, estado } : r)));
    startTransition(async () => {
      await actualizarEstadoReserva(id, estado);
    });
  }

  async function cerrarSesion() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div>
      <div className="rt-filters">
        <div>
          <label>Fecha</label>
          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
          />
        </div>
        <div>
          <label>Zona</label>
          <select value={filtroZona} onChange={(e) => setFiltroZona(e.target.value)}>
            <option value="">Todas</option>
            {ZONAS.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Estado</label>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="">Todos</option>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>
                {ESTADO_LABEL[e]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="rt-btn rt-btn-ghost rt-btn-small"
          onClick={() => exportarCSV(filtradas)}
        >
          Exportar CSV
        </button>
        <button
          type="button"
          className="rt-btn rt-btn-ghost rt-btn-small"
          style={{ marginLeft: "auto" }}
          onClick={cerrarSesion}
        >
          Cerrar sesión
        </button>
      </div>

      {filtradas.length === 0 && (
        <div className="rt-empty">
          <h3>No hay reservas</h3>
          <p>No hay reservas que coincidan con esos filtros.</p>
        </div>
      )}

      {filtradas.map((r) => (
        <div key={r.id} className="rt-res-row">
          <div className="rt-res-time">
            {r.hora}
            <span className="date">{r.fecha}</span>
          </div>
          <div className="rt-res-main">
            <div className="name">
              {r.nombre}
              {r.cumpleanos && " 🎉"}
              {r.banda_musical && " 🎵"}
            </div>
            <div className="meta">
              {zonaName(r.zona_id)} · {r.personas} personas · {r.telefono} · {r.codigo}
            </div>
          </div>
          <select
            value={r.estado}
            disabled={pending}
            onChange={(e) => cambiarEstado(r.id, e.target.value)}
            className={`rt-badge rt-badge-${r.estado}`}
            style={{ border: "none", cursor: "pointer" }}
          >
            {ESTADOS.map((e) => (
              <option key={e} value={e}>
                {ESTADO_LABEL[e]}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
