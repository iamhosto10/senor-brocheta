"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white">Fecha</label>
          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-sm text-white"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white">Zona</label>
          <select
            value={filtroZona}
            onChange={(e) => setFiltroZona(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-sm text-white"
          >
            <option value="">Todas</option>
            {ZONAS.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white">Estado</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-sm text-white"
          >
            <option value="">Todos</option>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>
                {ESTADO_LABEL[e]}
              </option>
            ))}
          </select>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => exportarCSV(filtradas)}
        >
          Exportar CSV
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={cerrarSesion}
        >
          Cerrar sesión
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border border-border/80">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border/80 text-white">
              <th className="px-3 py-2">Código</th>
              <th className="px-3 py-2">Fecha</th>
              <th className="px-3 py-2">Hora</th>
              <th className="px-3 py-2">Personas</th>
              <th className="px-3 py-2">Zona</th>
              <th className="px-3 py-2">Nombre</th>
              <th className="px-3 py-2">Teléfono</th>
              <th className="px-3 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((r) => (
              <tr key={r.id} className="border-b border-border/40 text-white">
                <td className="px-3 py-2 font-mono text-primary">{r.codigo}</td>
                <td className="px-3 py-2">{r.fecha}</td>
                <td className="px-3 py-2">{r.hora}</td>
                <td className="px-3 py-2">{r.personas}</td>
                <td className="px-3 py-2">{zonaName(r.zona_id)}</td>
                <td className="px-3 py-2">
                  {r.nombre}
                  {r.cumpleanos && " 🎉"}
                  {r.banda_musical && " 🎵"}
                </td>
                <td className="px-3 py-2">{r.telefono}</td>
                <td className="px-3 py-2">
                  <select
                    value={r.estado}
                    disabled={pending}
                    onChange={(e) => cambiarEstado(r.id, e.target.value)}
                    className={cn(
                      "rounded-md border border-border bg-background px-2 py-1 text-xs"
                    )}
                  >
                    {ESTADOS.map((e) => (
                      <option key={e} value={e}>
                        {ESTADO_LABEL[e]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {filtradas.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-white">
                  No hay reservas con esos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
