"use client";

import { useState, useTransition } from "react";
import { ZONAS } from "@/lib/reservas/zonas";
import { slotsServicio } from "@/lib/reservas/capacidad";
import { fmtTime12, hoyISO } from "@/lib/reservas/fechas";
import type { ReservaAdminInput } from "./actions";

type Props = {
  inicial?: Partial<ReservaAdminInput>;
  textoBoton: string;
  mostrarConfirmar?: boolean;
  onSubmit: (datos: ReservaAdminInput, confirmar: boolean) => Promise<{ ok: boolean; error?: string }>;
};

export function ReservaForm({ inicial, textoBoton, mostrarConfirmar = false, onSubmit }: Props) {
  const [fecha, setFecha] = useState(inicial?.fecha ?? hoyISO());
  const [hora, setHora] = useState(inicial?.hora ?? "19:00");
  const [personas, setPersonas] = useState(inicial?.personas ?? 2);
  const [zonaId, setZonaId] = useState(inicial?.zonaId ?? "zona1");
  const [nombre, setNombre] = useState(inicial?.nombre ?? "");
  const [telefono, setTelefono] = useState(inicial?.telefono ?? "");
  const [email, setEmail] = useState(inicial?.email ?? "");
  const [motivo, setMotivo] = useState(inicial?.motivo ?? "");
  const [notas, setNotas] = useState(inicial?.notas ?? "");
  const [confirmar, setConfirmar] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enviando, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const datos: ReservaAdminInput = {
      fecha,
      hora,
      personas,
      zonaId,
      nombre,
      telefono,
      email,
      motivo,
      notas,
    };
    startTransition(async () => {
      const res = await onSubmit(datos, confirmar);
      if (!res.ok) setError(res.error ?? "No pudimos guardar la reserva.");
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="rt-field">
        <label>Fecha</label>
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
      </div>
      <div className="rt-field">
        <label>Hora</label>
        <select value={hora} onChange={(e) => setHora(e.target.value)}>
          {slotsServicio().map((h) => (
            <option key={h} value={h}>
              {fmtTime12(h)}
            </option>
          ))}
        </select>
      </div>
      <div className="rt-field">
        <label>Personas</label>
        <input
          type="number"
          min={1}
          max={48}
          value={personas}
          onChange={(e) => setPersonas(Number(e.target.value))}
          required
        />
      </div>
      <div className="rt-field">
        <label>Zona</label>
        <select value={zonaId} onChange={(e) => setZonaId(e.target.value)}>
          {ZONAS.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name}
            </option>
          ))}
        </select>
      </div>
      <div className="rt-field">
        <label>Nombre completo</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div className="rt-field">
        <label>Teléfono / WhatsApp</label>
        <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
      </div>
      <div className="rt-field">
        <label>Correo (opcional)</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="rt-field">
        <label>Motivo (opcional)</label>
        <input type="text" value={motivo} onChange={(e) => setMotivo(e.target.value)} />
      </div>
      <div className="rt-field">
        <label>Notas (opcional)</label>
        <textarea rows={3} value={notas} onChange={(e) => setNotas(e.target.value)} />
      </div>
      {mostrarConfirmar && (
        <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
          <input
            type="checkbox"
            checked={confirmar}
            onChange={(e) => setConfirmar(e.target.checked)}
          />
          Dejarla confirmada de una vez
        </label>
      )}
      {error && <p style={{ color: "var(--accent)", fontSize: "0.9rem" }}>{error}</p>}
      <button
        type="submit"
        className="rt-btn rt-btn-primary"
        disabled={enviando}
        style={{ marginTop: 16, width: "100%" }}
      >
        {textoBoton}
      </button>
    </form>
  );
}
