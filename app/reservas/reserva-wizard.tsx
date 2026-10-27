"use client";

import { Fragment, useState, useTransition } from "react";
import Link from "next/link";
import { ZONAS, type Zona } from "@/lib/reservas/zonas";
import { DECORACIONES } from "@/lib/reservas/decoraciones";
import { RESERVAS_CONFIG } from "@/lib/reservas/config";
import {
  horariosParaFecha,
  zonasParaFechaHora,
  crearReserva,
} from "./actions";

const MOTIVOS = ["Cena casual", "Cumpleaños", "Aniversario", "Reunión de trabajo", "Otro"];

function hoyISO(): string {
  const now = new Date();
  const bogota = new Date(now.toLocaleString("en-US", { timeZone: "America/Bogota" }));
  return bogota.toISOString().slice(0, 10);
}

function maxFechaISO(): string {
  const d = new Date(hoyISO());
  d.setDate(d.getDate() + RESERVAS_CONFIG.maxAdvanceDays);
  return d.toISOString().slice(0, 10);
}

function formatearFechaLarga(fecha: string): string {
  const [y, m, d] = fecha.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

function Stepper({ step }: { step: 1 | 2 | 3 | 4 }) {
  const nodes = [
    { n: 1, label: "Cuándo" },
    { n: 2, label: "Tus datos" },
    { n: 3, label: "Confirmar" },
  ];
  return (
    <div className="rt-stepper">
      {nodes.map((node, i) => (
        <Fragment key={node.n}>
          <div
            className={`node ${step > node.n ? "done" : step === node.n ? "current" : ""}`}
          >
            <div className="dot">{step > node.n ? "✓" : node.n}</div>
            <div className="label">{node.label}</div>
          </div>
          {i < nodes.length - 1 && <div className="line" />}
        </Fragment>
      ))}
    </div>
  );
}

export function ReservaWizard() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [pending, startTransition] = useTransition();

  const [fecha, setFecha] = useState(hoyISO());
  const [personas, setPersonas] = useState(2);
  const [horarios, setHorarios] = useState<string[] | null>(null);
  const [hora, setHora] = useState<string | null>(null);

  const [zonas, setZonas] = useState<Zona[] | null>(null);
  const [zonaId, setZonaId] = useState<string | null>(null);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [motivo, setMotivo] = useState(MOTIVOS[0]);
  const [notas, setNotas] = useState("");
  const [cumpleanos, setCumpleanos] = useState(false);
  const [decoracionId, setDecoracionId] = useState("ninguna");
  const [bandaMusical, setBandaMusical] = useState(false);
  const [terms, setTerms] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<{ codigo: string; whatsappUrl: string } | null>(
    null
  );

  function buscarHorarios() {
    setError(null);
    setHorarios(null);
    setHora(null);
    setZonas(null);
    setZonaId(null);
    startTransition(async () => {
      setHorarios(await horariosParaFecha(fecha, personas));
    });
  }

  function elegirHora(h: string) {
    setHora(h);
    setZonas(null);
    setZonaId(null);
    startTransition(async () => {
      setZonas(await zonasParaFechaHora(fecha, h, personas));
    });
  }

  function confirmarReserva() {
    if (!hora || !zonaId) return;
    setError(null);
    startTransition(async () => {
      const res = await crearReserva({
        fecha,
        hora,
        personas,
        zonaId,
        nombre,
        telefono,
        email,
        motivo,
        notas,
        cumpleanos,
        decoracionId: cumpleanos ? decoracionId : undefined,
        bandaMusical,
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setResultado({ codigo: res.codigo, whatsappUrl: res.whatsappUrl });
      setStep(4);
    });
  }

  const zonaElegida = ZONAS.find((z) => z.id === zonaId);

  return (
    <div className="rt-wrap">
      {step < 4 && <Stepper step={step} />}

      {step === 1 && (
        <div className="rt-card">
          <h2 style={{ marginBottom: 18 }}>¿Cuándo nos visitas?</h2>

          <div className="rt-field">
            <label htmlFor="r-fecha">Fecha</label>
            <input
              id="r-fecha"
              type="date"
              value={fecha}
              min={hoyISO()}
              max={maxFechaISO()}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <div className="rt-field">
            <label>Personas</label>
            <div className="rt-qty">
              <button type="button" onClick={() => setPersonas((p) => Math.max(1, p - 1))}>
                −
              </button>
              <input
                type="number"
                min={1}
                max={48}
                value={personas}
                onChange={(e) =>
                  setPersonas(Math.min(48, Math.max(1, Number(e.target.value) || 1)))
                }
              />
              <button type="button" onClick={() => setPersonas((p) => Math.min(48, p + 1))}>
                +
              </button>
            </div>
          </div>

          <button type="button" className="rt-btn rt-btn-primary" onClick={buscarHorarios} disabled={pending}>
            {pending ? "Buscando…" : "Ver horarios disponibles"}
          </button>

          {horarios !== null && horarios.length === 0 && (
            <p className="rt-field" style={{ color: "var(--text-muted)", marginTop: 16 }}>
              No quedan horarios para ese día con ese número de personas. Prueba con otra
              fecha.
            </p>
          )}

          {horarios !== null && horarios.length > 0 && (
            <div className="rt-field" style={{ marginTop: 20 }}>
              <label>Hora</label>
              <div className="rt-time-grid">
                {horarios.map((h) => (
                  <button
                    key={h}
                    type="button"
                    className={`rt-time-chip ${hora === h ? "selected" : ""}`}
                    onClick={() => elegirHora(h)}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hora && zonas !== null && (
            <div className="rt-field">
              <label>Zona</label>
              {zonas.length === 0 && (
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  No tenemos zonas con cupo para {personas} personas a esa hora. Prueba con
                  otra hora.
                </p>
              )}
              {zonas.map((z) => (
                <button
                  key={z.id}
                  type="button"
                  className={`rt-zone-card ${zonaId === z.id ? "selected" : ""}`}
                  onClick={() => setZonaId(z.id)}
                >
                  <span className="rt-zone-dot" style={{ background: z.color }} />
                  <span className="rt-zone-info">
                    <span className="rt-zone-name">{z.name}</span>
                    <span className="blurb">{z.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            className="rt-btn rt-btn-primary"
            style={{ marginTop: 10 }}
            disabled={!hora || !zonaId}
            onClick={() => setStep(2)}
          >
            Continuar
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="rt-card">
          <h2 style={{ marginBottom: 18 }}>Tus datos</h2>

          <div className="rt-field">
            <label htmlFor="r-nombre">Nombre</label>
            <input
              id="r-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Manuel Cáceres"
            />
          </div>
          <div className="rt-field">
            <label htmlFor="r-telefono">Teléfono</label>
            <input
              id="r-telefono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+57 300 000 0000"
            />
          </div>
          <div className="rt-field">
            <label htmlFor="r-email">Correo (opcional)</label>
            <input
              id="r-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
            />
          </div>

          <div className="rt-field">
            <label>Motivo</label>
            <div className="rt-chip-row">
              {MOTIVOS.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`rt-chip ${motivo === m ? "selected" : ""}`}
                  onClick={() => {
                    setMotivo(m);
                    setCumpleanos(m === "Cumpleaños");
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {cumpleanos && (
            <div className="rt-field">
              <label>Decoración de cumpleaños</label>
              <div className="rt-chip-row" style={{ flexDirection: "column" }}>
                {DECORACIONES.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    className={`rt-chip ${decoracionId === d.id ? "selected" : ""}`}
                    style={{ width: "100%", textAlign: "left", borderRadius: 10 }}
                    onClick={() => setDecoracionId(d.id)}
                  >
                    {d.name} — {d.price > 0 ? `$${d.price.toLocaleString("es-CO")}` : "Gratis"}
                  </button>
                ))}
              </div>
            </div>
          )}

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.95rem",
              marginBottom: 18,
            }}
          >
            <input
              type="checkbox"
              checked={bandaMusical}
              onChange={(e) => setBandaMusical(e.target.checked)}
              style={{ width: 19, height: 19 }}
            />
            Quiero banda musical (cargo de $
            {RESERVAS_CONFIG.bandaMusicalCobro.toLocaleString("es-CO")})
          </label>

          <div className="rt-field">
            <label htmlFor="r-notas">Notas (opcional)</label>
            <textarea
              id="r-notas"
              rows={3}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="¿Alguna solicitud especial? Alergias, silla para bebé, etc."
            />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button type="button" className="rt-btn rt-btn-ghost" onClick={() => setStep(1)}>
              Volver
            </button>
            <button
              type="button"
              className="rt-btn rt-btn-primary"
              disabled={!nombre || !telefono}
              onClick={() => setStep(3)}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="rt-card">
          <h2 style={{ marginBottom: 18 }}>Confirma tu reserva</h2>

          <div className="rt-ticket">
            <div className="rt-ticket-head">
              <div className="rt-ticket-day">{formatearFechaLarga(fecha)}</div>
              <div className="rt-ticket-code">{hora}</div>
            </div>
            <div className="rt-ticket-facts">
              <div>
                <span className="k">Personas</span>
                <span className="v">{personas}</span>
              </div>
              <div>
                <span className="k">Zona</span>
                <span className="v">{zonaElegida?.name}</span>
              </div>
              <div>
                <span className="k">Motivo</span>
                <span className="v">{motivo}</span>
              </div>
            </div>
          </div>

          <label
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              margin: "20px 0",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              style={{ marginTop: 3 }}
            />
            Acepto los términos y condiciones de la reserva (antelación mínima, tiempo de la
            mesa y política de cancelación).
          </label>

          {error && (
            <p style={{ color: "var(--accent)", fontSize: "0.9rem", marginBottom: 14 }}>
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: 12 }}>
            <button type="button" className="rt-btn rt-btn-ghost" onClick={() => setStep(2)}>
              Volver
            </button>
            <button
              type="button"
              className="rt-btn rt-btn-primary"
              disabled={!terms || pending}
              onClick={confirmarReserva}
            >
              {pending ? "Enviando…" : "Confirmar reserva"}
            </button>
          </div>
        </div>
      )}

      {step === 4 && resultado && (
        <div className="rt-card" style={{ textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              background: "var(--confirmed)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px",
              fontSize: "1.6rem",
            }}
          >
            ✓
          </div>
          <h2>¡Solicitud enviada!</h2>
          <p style={{ color: "var(--text-muted)", marginTop: 10 }}>
            Tu código de reserva es{" "}
            <span style={{ color: "var(--accent)", fontWeight: 700 }}>{resultado.codigo}</span>
          </p>
          <p style={{ color: "var(--text-muted)", marginTop: 10, fontSize: "0.9rem" }}>
            Escríbenos por WhatsApp para confirmar tu reserva con el restaurante.
          </p>
          <a
            href={resultado.whatsappUrl}
            target="_blank"
            className="rt-btn rt-btn-primary"
            style={{ marginTop: 18, textDecoration: "none" }}
          >
            Escribir al restaurante por WhatsApp
          </a>
          <Link
            href="/"
            className="rt-btn rt-btn-ghost"
            style={{ marginTop: 10, textDecoration: "none" }}
          >
            Volver al inicio
          </Link>
        </div>
      )}
    </div>
  );
}
