"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DECORACIONES } from "@/lib/reservas/decoraciones";
import { fmtTime12, formatearFechaLarga, hoyISO } from "@/lib/reservas/fechas";
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
  decoracion_id: string | null;
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

function nombreDecoracion(decoracionId: string | null) {
  if (!decoracionId || decoracionId === "ninguna") return "";
  return DECORACIONES.find((d) => d.id === decoracionId)?.name ?? "";
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
    "cumpleanos",
    "decoracion",
    "banda_musical",
    "notas",
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
      r.cumpleanos ? "Sí" : "No",
      nombreDecoracion(r.decoracion_id),
      r.banda_musical ? "Sí" : "No",
      r.notas ?? "",
      r.estado,
    ]
      .map((v) => `"${String(v).replace(/\r?\n/g, " ").replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [headers.join(","), ...filas].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reservas-${hoyISO()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminTable({ reservasIniciales }: { reservasIniciales: Reserva[] }) {
  const router = useRouter();
  const [estadosLocales, setEstadosLocales] = useState<Record<string, string>>({});
  const reservas = useMemo(
    () =>
      reservasIniciales.map((r) =>
        estadosLocales[r.id] ? { ...r, estado: estadosLocales[r.id] } : r
      ),
    [reservasIniciales, estadosLocales]
  );
  const [filtroDesde, setFiltroDesde] = useState(() => hoyISO());
  const [filtroHasta, setFiltroHasta] = useState("");
  const [filtroZona, setFiltroZona] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [pending, startTransition] = useTransition();

  const filtradas = useMemo(() => {
    const texto = filtroTexto.trim().toLowerCase();
    const digitos = filtroTexto.replace(/\D/g, "");
    return reservas.filter((r) => {
      if (filtroDesde && r.fecha < filtroDesde) return false;
      if (filtroHasta && r.fecha > filtroHasta) return false;
      if (filtroZona && r.zona_id !== filtroZona) return false;
      if (filtroEstado && r.estado !== filtroEstado) return false;
      if (texto) {
        const coincide =
          r.codigo.toLowerCase().includes(texto) ||
          r.nombre.toLowerCase().includes(texto) ||
          (digitos.length >= 3 && r.telefono.replace(/\D/g, "").includes(digitos));
        if (!coincide) return false;
      }
      return true;
    });
  }, [reservas, filtroDesde, filtroHasta, filtroZona, filtroEstado, filtroTexto]);

  function limpiarFiltros() {
    setFiltroDesde("");
    setFiltroHasta("");
    setFiltroZona("");
    setFiltroEstado("");
    setFiltroTexto("");
  }

  function cambiarEstado(id: string, estado: string, e: React.SyntheticEvent) {
    e.stopPropagation();
    setEstadosLocales((prev) => ({ ...prev, [id]: estado }));
    startTransition(async () => {
      const res = await actualizarEstadoReserva(id, estado);
      setEstadosLocales((prev) => {
        const copia = { ...prev };
        delete copia[id];
        return copia;
      });
      if (!res.ok) {
        alert(res.error ?? "No pudimos actualizar la reserva.");
      }
      router.refresh();
    });
  }

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, 30000);
    return () => clearInterval(id);
  }, [router]);

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
          <label>Buscar</label>
          <input
            type="text"
            placeholder="Código, nombre o teléfono"
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
          />
        </div>
        <div>
          <label>Desde</label>
          <input
            type="date"
            value={filtroDesde}
            max={filtroHasta || undefined}
            onChange={(e) => setFiltroDesde(e.target.value)}
          />
        </div>
        <div>
          <label>Hasta</label>
          <input
            type="date"
            value={filtroHasta}
            min={filtroDesde || undefined}
            onChange={(e) => setFiltroHasta(e.target.value)}
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
          onClick={limpiarFiltros}
        >
          Limpiar filtros
        </button>
        <Link href="/admin/dia" className="rt-btn rt-btn-ghost rt-btn-small" style={{ textDecoration: "none" }}>
          Ocupación del día
        </Link>
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
        <Link key={r.id} href={`/admin/${r.id}`} className="rt-res-row" style={{ cursor: "pointer" }}>
          <div className="rt-res-time">
            {fmtTime12(r.hora)}
            <span className="date">{formatearFechaLarga(r.fecha)}</span>
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
          {r.estado === "cancelada" || r.estado === "completada" ? (
            <span className={`rt-badge rt-badge-${r.estado}`}>{ESTADO_LABEL[r.estado]}</span>
          ) : (
            <select
              value={r.estado}
              disabled={pending}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => cambiarEstado(r.id, e.target.value, e)}
              className={`rt-badge rt-badge-${r.estado}`}
              style={{ border: "none", cursor: "pointer" }}
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {ESTADO_LABEL[e]}
                </option>
              ))}
            </select>
          )}
        </Link>
      ))}
    </div>
  );
}
