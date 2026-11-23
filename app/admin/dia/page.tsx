import type { Metadata } from "next";
import Link from "next/link";
import { listarReservasDelDia } from "../actions";
import { slotsServicio, unidadesOcupadas, unidadesZona } from "@/lib/reservas/capacidad";
import { formatearFechaLarga, fmtTime12, hoyISO } from "@/lib/reservas/fechas";
import { ZONAS } from "@/lib/reservas/zonas";

export const metadata: Metadata = {
  title: "Ocupación del día | Sr. Brocheta",
};

const ESTADO_LABEL: Record<string, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  cancelada: "Cancelada",
  completada: "Completada",
};

export default async function OcupacionDelDiaPage({
  searchParams,
}: {
  searchParams: Promise<{ fecha?: string }>;
}) {
  const { fecha: fechaParam } = await searchParams;
  const fecha = fechaParam && /^\d{4}-\d{2}-\d{2}$/.test(fechaParam) ? fechaParam : hoyISO();

  const reservas = await listarReservasDelDia(fecha);
  const slots = slotsServicio();
  const totalPersonas = reservas.reduce((sum, r) => sum + r.personas, 0);

  return (
    <div className="rt-wrap-wide">
      <div className="rt-topbar">
        <Link href="/admin" className="rt-icon-btn" aria-label="Volver al panel">
          ←
        </Link>
        <span className="rt-topbar-title">Ocupación del día</span>
      </div>

      <form method="get" className="rt-filters">
        <div>
          <label htmlFor="fecha">Día</label>
          <input id="fecha" type="date" name="fecha" defaultValue={fecha} />
        </div>
        <button type="submit" className="rt-btn rt-btn-ghost rt-btn-small">
          Ver
        </button>
      </form>

      <h2>{formatearFechaLarga(fecha)}</h2>
      <p style={{ color: "var(--text-muted)" }}>
        {reservas.length} reservas activas · {totalPersonas} personas
      </p>

      <div className="rt-card" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr>
              <th
                style={{
                  padding: "8px 10px",
                  textAlign: "center",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                Hora
              </th>
              {ZONAS.map((zona) => (
                <th
                  key={zona.id}
                  style={{
                    padding: "8px 10px",
                    textAlign: "center",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {zona.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot}>
                <td
                  style={{
                    padding: "8px 10px",
                    textAlign: "center",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {fmtTime12(slot)}
                </td>
                {ZONAS.map((zona) => {
                  const ocupados = unidadesOcupadas(zona, slot, reservas) * 4;
                  const capacidad = unidadesZona(zona) * 4;
                  const color =
                    ocupados === 0
                      ? "var(--text-muted)"
                      : ocupados === capacidad
                        ? "var(--accent)"
                        : undefined;
                  return (
                    <td
                      key={zona.id}
                      style={{
                        padding: "8px 10px",
                        textAlign: "center",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                        color,
                        fontWeight: ocupados === capacidad ? 700 : undefined,
                      }}
                    >
                      {ocupados} / {capacidad}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reservas.length === 0 ? (
        <div className="rt-empty">No hay reservas activas para este día.</div>
      ) : (
        reservas.map((r) => (
          <Link key={r.id} href={`/admin/${r.id}`} className="rt-res-row" style={{ cursor: "pointer" }}>
            <div className="rt-res-time">{fmtTime12(r.hora)}</div>
            <div className="rt-res-main">
              <div className="name">{r.nombre}</div>
              <div className="meta">
                {ZONAS.find((z) => z.id === r.zona_id)?.name ?? r.zona_id} · {r.personas} personas ·{" "}
                {r.codigo}
              </div>
            </div>
            <span className={`rt-badge rt-badge-${r.estado}`}>{ESTADO_LABEL[r.estado]}</span>
          </Link>
        ))
      )}
    </div>
  );
}
