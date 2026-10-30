"use client";

import { Fragment, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ZONAS, type Zona } from "@/lib/reservas/zonas";
import { DECORACIONES } from "@/lib/reservas/decoraciones";
import { RESERVAS_CONFIG } from "@/lib/reservas/config";
import { hoyISO } from "@/lib/reservas/fechas";
import { horariosParaFecha, zonasParaFechaHora, crearReserva } from "./actions";

const MOTIVOS = [
  "Cena casual",
  "Cumpleaños",
  "Aniversario",
  "Reunión de trabajo",
  "Otro",
];
const DOW_CORTO = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES_CORTO = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];
const ZONE_GROUPS: { type: Zona["type"]; title: string }[] = [
  { type: "abierta", title: "Sin climatización" },
  { type: "climatizada", title: "Climatizadas" },
];

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </svg>
  );
}
function IndoorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  );
}

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function parseYmd(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
function maxFechaISO(): string {
  const d = parseYmd(hoyISO());
  d.setUTCDate(d.getUTCDate() + RESERVAS_CONFIG.maxAdvanceDays);
  return ymd(d);
}
function fmtTime12(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "pm" : "am";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}
function formatearFechaLarga(fecha: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(parseYmd(fecha));
}

function Stepper({ step }: { step: 1 | 2 | 3 | 4 | 5 }) {
  const nodes = [
    { n: 1, label: "Cuándo" },
    { n: 2, label: "Zona" },
    { n: 3, label: "Solicitar" },
    { n: 4, label: "Términos" },
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

function BirthdayDialog({
  decoracionId,
  onSelect,
  onClose,
}: {
  decoracionId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="rt-dialog-overlay" onClick={onClose}>
      <div className="rt-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="rt-dialog-head">
          <h2 style={{ fontSize: "1.1rem" }}>🎉 Reserva de cumpleaños</h2>
          <button
            type="button"
            className="rt-icon-btn"
            aria-label="Cerrar"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="rt-dialog-body">
          <p className="rt-cond-intro">
            Elige una decoración para tu mesa (opcional):
          </p>
          <div className="rt-deco-row">
            {DECORACIONES.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`rt-deco-card ${d.img ? "" : "no-img"} ${
                  decoracionId === d.id ? "selected" : ""
                }`}
                onClick={() => onSelect(d.id)}
              >
                {d.img && (
                  <Image
                    src={d.img}
                    alt={d.name}
                    width={200}
                    height={267}
                    className="deco-img"
                  />
                )}
                <span className="deco-body">
                  <span className="deco-name">{d.name}</span>
                  <span className="deco-price">
                    {d.price > 0
                      ? `$${d.price.toLocaleString("es-CO")}`
                      : "Gratis"}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <p className="rt-cond-intro" style={{ marginTop: 22 }}>
            Al reservar tu cumpleaños en Sr. Brocheta, tienes derecho a:
          </p>
          <ol className="rt-cond-list">
            <li>
              <strong>Base para el pudín</strong>Para presentar tu torta o pudín
              en la mesa.
            </li>
            <li>
              <strong>Letras luminosas HBD</strong>Para decorar el momento de la
              foto.
            </li>
            <li>
              <strong>Vela volcán</strong>Para encender sobre el pudín.
            </li>
            <li>
              <strong>
                Cinta, vincha o gafas de &quot;Feliz cumpleaños&quot;
              </strong>
              Para que el cumpleañero se tome la foto del recuerdo.
            </li>
          </ol>
          <p className="rt-cond-outro">
            Todo cumpleañero en Sr. Brocheta puede pedir un frappé de la casa de
            cortesía 😊✨
          </p>
        </div>
        <div className="rt-dialog-foot">
          <button
            type="button"
            className="rt-btn rt-btn-primary"
            onClick={onClose}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}

export function ReservaWizard() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [pending, startTransition] = useTransition();

  const [fecha, setFecha] = useState(hoyISO());
  const [personas, setPersonas] = useState(2);
  const [personasTexto, setPersonasTexto] = useState("2");
  const [horarios, setHorarios] = useState<string[]>([]);
  const [hora, setHora] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [zonas, setZonas] = useState<Array<{ zona: Zona; ok: boolean }> | null>(
    null,
  );
  const [zonaId, setZonaId] = useState<string | null>(null);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [motivo, setMotivo] = useState(MOTIVOS[0]);
  const [notas, setNotas] = useState("");
  const [cumpleanos, setCumpleanos] = useState(false);
  const [decoracionId, setDecoracionId] = useState("ninguna");
  const [bandaMusical, setBandaMusical] = useState(false);
  const [showBirthdayDialog, setShowBirthdayDialog] = useState(false);
  const [terms, setTerms] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<{
    codigo: string;
    whatsappUrl: string;
  } | null>(null);

  useEffect(() => {
    startTransition(async () => {
      setHorarios(await horariosParaFecha(fecha, personas));
    });
  }, [fecha, personas]);

  // Al cambiar la fecha, la hora elegida pudo quedar fuera de los horarios del nuevo día.
  useEffect(() => {
    setHora(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fecha]);

  const diasEstrip = Array.from({ length: 7 }, (_, i) => {
    const d = parseYmd(hoyISO());
    d.setUTCDate(d.getUTCDate() + i);
    return {
      s: ymd(d),
      d,
      label: i === 0 ? "Hoy" : i === 1 ? "Mañana" : DOW_CORTO[d.getUTCDay()],
    };
  });

  function irAZona() {
    if (!hora) return;
    setError(null);
    setZonas(null);
    setZonaId(null);
    startTransition(async () => {
      setZonas(await zonasParaFechaHora(fecha, hora, personas));
      setStep(2);
    });
  }

  function elegirZona(id: string) {
    setZonaId(id);
    setStep(3);
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
      setStep(5);
    });
  }

  const zonaElegida = ZONAS.find((z) => z.id === zonaId);
  const grupos = ZONE_GROUPS.map((g) => ({
    ...g,
    items: (zonas ?? []).filter((r) => r.zona.type === g.type),
  })).filter((g) => g.items.length > 0);

  function volverAtras() {
    if (step === 1) {
      router.push("/reservas");
      return;
    }
    setStep((s) => (s - 1) as typeof step);
  }

  return (
    <div>
      {step < 5 && (
        <div className="rt-wrap" style={{ paddingBottom: 0 }}>
          <div className="rt-topbar">
            <button
              type="button"
              className="rt-icon-btn"
              aria-label={
                step === 1 ? "Volver al inicio" : "Volver al paso anterior"
              }
              onClick={volverAtras}
            >
              ←
            </button>
            <span className="rt-topbar-title">Reservar mesa</span>
          </div>
        </div>
      )}
      <div className="rt-wrap">
        {step < 5 && <Stepper step={step} />}

        {showBirthdayDialog && (
          <BirthdayDialog
            decoracionId={decoracionId}
            onSelect={setDecoracionId}
            onClose={() => setShowBirthdayDialog(false)}
          />
        )}

        {step === 1 && (
          <div className="rt-card">
            <h2>¿Cuándo nos visitas?</h2>
            <p className="rt-lead">
              Elige el día, la hora y cuántos son. Tus datos van al final.
            </p>

            <div className="rt-field">
              <label>Día</label>
              <div className="rt-day-strip">
                {diasEstrip.map(({ s, d, label }) => (
                  <button
                    key={s}
                    type="button"
                    className={`rt-day-chip ${fecha === s ? "selected" : ""}`}
                    onClick={() => {
                      setFecha(s);
                      setShowDatePicker(false);
                    }}
                  >
                    <span className="dow">{label}</span>
                    <span className="num">{d.getUTCDate()}</span>
                    <span className="mon">{MESES_CORTO[d.getUTCMonth()]}</span>
                  </button>
                ))}
              </div>
              {!showDatePicker ? (
                <button
                  type="button"
                  className="rt-link-btn"
                  onClick={() => setShowDatePicker(true)}
                >
                  ¿Otro día? Abrir calendario
                </button>
              ) : (
                <input
                  type="date"
                  value={fecha}
                  min={hoyISO()}
                  max={maxFechaISO()}
                  onChange={(e) => setFecha(e.target.value)}
                  style={{ marginTop: 8 }}
                />
              )}
            </div>

            <div className="rt-field">
              <label>Hora de llegada</label>
              <div className="rt-time-grid">
                {horarios.map((h) => (
                  <button
                    key={h}
                    type="button"
                    className={`rt-time-chip ${hora === h ? "selected" : ""}`}
                    onClick={() => setHora(h)}
                  >
                    {fmtTime12(h)}
                  </button>
                ))}
              </div>
              {!pending && horarios.length === 0 && (
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.85rem",
                    marginTop: 8,
                  }}
                >
                  No quedan horarios para ese día con ese número de personas.
                </p>
              )}
              <div
                className="hint"
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  marginTop: 10,
                }}
              >
                Atendemos todos los días, de 5:00 pm a 11:00 pm (última reserva
                a las 10:30 pm).
              </div>
            </div>

            <div className="rt-field">
              <label>Personas</label>
              <div className="rt-qty">
                <button
                  type="button"
                  onClick={() =>
                    setPersonas((p) => {
                      const siguiente = Math.max(1, p - 1);
                      setPersonasTexto(String(siguiente));
                      return siguiente;
                    })
                  }
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={48}
                  value={personasTexto}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setPersonasTexto(raw);
                    const n = Number(raw);
                    if (raw !== "" && !Number.isNaN(n)) {
                      setPersonas(Math.min(48, Math.max(1, n)));
                    }
                  }}
                  onBlur={() => {
                    const limitado = Math.min(
                      48,
                      Math.max(1, Number(personasTexto) || 1),
                    );
                    setPersonas(limitado);
                    setPersonasTexto(String(limitado));
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setPersonas((p) => {
                      const siguiente = Math.min(48, p + 1);
                      setPersonasTexto(String(siguiente));
                      return siguiente;
                    })
                  }
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              className="rt-btn rt-btn-primary"
              disabled={!hora || pending}
              onClick={irAZona}
            >
              {pending ? "Buscando…" : "Ver zonas disponibles"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="rt-card">
            <h2>Elige tu zona</h2>
            <p className="rt-lead">
              {personas} personas · {formatearFechaLarga(fecha)} ·{" "}
              {hora && fmtTime12(hora)}
            </p>

            {grupos.map(({ title, items }) => (
              <section key={title} className="rt-zone-group">
                <h3 className="rt-zone-group-title my-3">
                  {title === "Sin climatización" ? <SunIcon /> : <IndoorIcon />}
                  <span>{title.toUpperCase()}</span>
                </h3>
                {items.map(({ zona, ok }) => (
                  <button
                    key={zona.id}
                    type="button"
                    className={`rt-zone-card ${ok ? "" : "disabled"}`}
                    disabled={!ok}
                    onClick={() => ok && elegirZona(zona.id)}
                  >
                    {zona.img && (
                      <Image
                        src={zona.img}
                        alt={zona.name}
                        width={84}
                        height={84}
                        className="rt-zone-photo"
                      />
                    )}
                    <span className="rt-zone-info">
                      <span className="rt-zone-name">
                        <span
                          className="rt-zone-dot"
                          style={{ background: zona.color }}
                        />
                        {zona.name}
                      </span>
                      <span className="blurb">{zona.desc}</span>
                      <span className="rt-zone-meta">
                        <span>
                          Hasta{" "}
                          {zona.flexible && zona.units !== undefined
                            ? zona.units * 4
                            : (zona.t8 ?? 0) * 8 + (zona.t4 ?? 0) * 4}{" "}
                          personas
                        </span>
                        <span className={ok ? "ok" : "full"}>
                          {ok ? "Hay lugar" : "Sin cupo a esa hora"}
                        </span>
                      </span>
                    </span>
                  </button>
                ))}
              </section>
            ))}

            <button
              type="button"
              className="rt-btn rt-btn-ghost"
              onClick={() => setStep(1)}
            >
              ← Cambiar día u hora
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="rt-card">
            <h2>Solicita tu reserva</h2>

            <div className="rt-ticket">
              <div className="rt-ticket-head">
                <div className="rt-ticket-day">
                  {formatearFechaLarga(fecha)}
                </div>
                <div className="rt-ticket-code">{hora && fmtTime12(hora)}</div>
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
              </div>
            </div>
            <div style={{ display: "flex", gap: 20, margin: "10px 0 20px" }}>
              <button
                type="button"
                className="rt-link-btn"
                style={{ width: "auto" }}
                onClick={() => setStep(1)}
              >
                Cambiar día u hora
              </button>
              <button
                type="button"
                className="rt-link-btn"
                style={{ width: "auto" }}
                onClick={() => setStep(2)}
              >
                Cambiar zona
              </button>
            </div>

            <div className="rt-field">
              <label htmlFor="r-nombre">Nombre completo</label>
              <input
                id="r-nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Manuel Cáceres"
              />
            </div>
            <div className="rt-field">
              <label htmlFor="r-telefono">Teléfono / WhatsApp</label>
              <input
                id="r-telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+57 300 000 0000"
              />
              <div
                className="hint"
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  marginTop: 6,
                }}
              >
                Te escribiremos a este número para confirmar tu reserva.
              </div>
            </div>
            <div className="rt-field">
              <label htmlFor="r-email">Correo electrónico</label>
              <input
                id="r-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
              />
            </div>

            <p className="rt-invite-line">Ven y celebra con nosotros</p>

            <div className="rt-field">
              <label>Motivo de la reserva</label>
              <div className="rt-chip-row">
                {MOTIVOS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`rt-chip ${motivo === m ? "selected" : ""}`}
                    onClick={() => {
                      setMotivo(m);
                      const esCumple = m === "Cumpleaños";
                      setCumpleanos(esCumple);
                      if (esCumple) setShowBirthdayDialog(true);
                    }}
                  >
                    {m === "Reunión de trabajo" ? "Trabajo" : m}
                  </button>
                ))}
              </div>
            </div>
            {cumpleanos && (
              <div className="rt-field">
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Decoración:{" "}
                  {DECORACIONES.find((d) => d.id === decoracionId)?.name}
                </p>
                <button
                  type="button"
                  className="rt-link-btn"
                  onClick={() => setShowBirthdayDialog(true)}
                >
                  Cambiar decoración
                </button>
              </div>
            )}

            <div className="rt-field">
              <label htmlFor="r-notas">Notas</label>
              <textarea
                id="r-notas"
                rows={3}
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="¿Alguna solicitud especial? Alergias, silla para bebé, etc."
              />
            </div>

            <div className="rt-banda-box">
              <label className="rt-banda-check">
                <input
                  type="checkbox"
                  checked={bandaMusical}
                  onChange={(e) => setBandaMusical(e.target.checked)}
                />
                <span>
                  🎵 ¿Traerás algún grupo musical (mariachi, vallenato, etc.)?
                </span>
              </label>
              <p className="hint">
                Costo adicional de{" "}
                <strong>
                  ${RESERVAS_CONFIG.bandaMusicalCobro.toLocaleString("es-CO")}
                </strong>{" "}
                por el ingreso.
              </p>
            </div>

            <button
              type="button"
              className="rt-btn rt-btn-primary"
              disabled={!nombre || !telefono}
              onClick={() => setStep(4)}
            >
              Continuar
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="rt-card">
            <h2>Términos y condiciones</h2>

            <section className="rt-conditions">
              <h3>Condiciones de la reserva</h3>
              <p className="rt-cond-intro">
                A continuación, le compartimos nuestras condiciones para
                reservas. Por favor léalas antes de continuar.
              </p>
              <ol className="rt-cond-list">
                <li>
                  <strong>Confirmación</strong>Este formulario es una solicitud:
                  por favor no confirme su reserva por este medio. La
                  confirmación oficial será realizada directamente por el
                  restaurante.
                </li>
                <li>
                  <strong>Anticipación</strong>Las reservas se solicitan con un
                  mínimo de 3 horas de anticipación.
                </li>
                <li>
                  <strong>Tiempo de espera</strong>La reserva se mantiene por 15
                  minutos después de la hora acordada (por motivo de las
                  festividades). Pasado este tiempo, la reserva se cancela y la
                  mesa será asignada según disponibilidad.
                </li>
                <li>
                  <strong>Tiempo en mesa</strong>El tiempo aproximado de uso de
                  la mesa es de 2 horas.
                </li>
                <li>
                  <strong>Cancelaciones y cambios</strong>Cualquier cancelación
                  o modificación de la reserva debe informarse al restaurante
                  por WhatsApp.
                </li>
                <li>
                  <strong>Música para celebraciones</strong>Si desea traer
                  música en vivo (mariachi, grupo vallenato, etc.) se debe pagar
                  un valor de $
                  {RESERVAS_CONFIG.bandaMusicalCobro.toLocaleString("es-CO")}{" "}
                  para permitir su ingreso, y debe solicitar autorización previa
                  al restaurante.
                </li>
                <li>
                  <strong>Decoraciones</strong>Las decoraciones voluminosas no
                  están permitidas. Se aceptan decoraciones pequeñas: bouquets
                  de globos y flores.
                </li>
                <li>
                  <strong>Número de personas</strong>Si llegan más comensales de
                  los confirmados en la reserva, serán ubicados según la
                  disponibilidad del momento.
                </li>
              </ol>
              <p className="rt-cond-outro">
                Agradecemos su comprensión y quedamos atentos para confirmar su
                solicitud. ¡Será un placer atenderle!
              </p>
            </section>

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
              He leído y acepto las condiciones de la reserva, incluido el
              tratamiento de mis datos personales.
            </label>

            {error && (
              <p
                style={{
                  color: "var(--accent)",
                  fontSize: "0.9rem",
                  marginBottom: 14,
                }}
              >
                {error}
              </p>
            )}

            <button
              type="button"
              className="rt-btn rt-btn-primary"
              disabled={!terms || pending}
              onClick={confirmarReserva}
              style={{ marginBottom: 10 }}
            >
              {pending ? "Enviando…" : "Solicitar reserva"}
            </button>
            <button
              type="button"
              className="rt-btn rt-btn-ghost"
              onClick={() => setStep(3)}
            >
              ← Volver a mis datos
            </button>
          </div>
        )}

        {step === 5 && resultado && (
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
            <p
              style={{
                color: "var(--text-muted)",
                marginTop: 10,
                fontSize: "0.9rem",
              }}
            >
              Tu reserva queda <b>pendiente</b>: el restaurante la confirmará
              directamente contigo. Si necesitas cancelarla o modificarla,
              avísanos por WhatsApp.
            </p>
            <p style={{ color: "var(--text-muted)", marginTop: 14 }}>
              Tu código de reserva es{" "}
              <span style={{ color: "var(--accent)", fontWeight: 700 }}>
                {resultado.codigo}
              </span>
            </p>
            <a
              href={resultado.whatsappUrl}
              target="_blank"
              className="rt-btn rt-btn-primary"
              style={{ marginTop: 18, textDecoration: "none" }}
            >
              Confirma tu reserva al WhatsApp
            </a>
            <Link
              href="/reservas"
              className="rt-btn rt-btn-ghost"
              style={{ marginTop: 10, textDecoration: "none" }}
            >
              Volver al inicio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
