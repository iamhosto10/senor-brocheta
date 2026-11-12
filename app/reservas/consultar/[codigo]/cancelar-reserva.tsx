"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelarReservaCliente } from "../actions";

export function CancelarReserva({ codigo }: { codigo: string }) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hecho, setHecho] = useState(false);
  const [enviando, startTransition] = useTransition();

  function confirmar() {
    setError(null);
    startTransition(async () => {
      const res = await cancelarReservaCliente(codigo, telefono);
      if (res.ok) {
        setHecho(true);
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  function conservar() {
    setAbierto(false);
    setError(null);
  }

  if (hecho) {
    return <p style={{ color: "var(--text-muted)", marginTop: 16 }}>Tu reserva quedó cancelada.</p>;
  }

  if (!abierto) {
    return (
      <button
        type="button"
        className="rt-btn rt-btn-ghost"
        style={{ marginTop: 10 }}
        onClick={() => setAbierto(true)}
      >
        Cancelar mi reserva
      </button>
    );
  }

  return (
    <div style={{ marginTop: 16 }}>
      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
        Para cancelar, escribe el teléfono con el que hiciste la reserva.
      </p>
      <div className="rt-field">
        <input
          type="tel"
          placeholder="+57 300 000 0000"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
      </div>
      {error && <p style={{ color: "var(--accent)", fontSize: "0.85rem" }}>{error}</p>}
      <button
        type="button"
        className="rt-btn rt-btn-primary"
        disabled={enviando}
        style={{ width: "100%" }}
        onClick={confirmar}
      >
        {enviando ? "Cancelando…" : "Sí, cancelar mi reserva"}
      </button>
      <button
        type="button"
        className="rt-btn rt-btn-ghost"
        style={{ width: "100%", marginTop: 8 }}
        onClick={conservar}
      >
        No, conservarla
      </button>
    </div>
  );
}
