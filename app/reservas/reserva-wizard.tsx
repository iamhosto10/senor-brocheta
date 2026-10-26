"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "cn";
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
  const bogota = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Bogota" })
  );
  return bogota.toISOString().slice(0, 10);
}

function maxFechaISO(): string {
  const d = new Date(hoyISO());
  d.setDate(d.getDate() + RESERVAS_CONFIG.maxAdvanceDays);
  return d.toISOString().slice(0, 10);
}

export function ReservaWizard() {
  const [step, setStep] = useState(1);
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
      const disponibles = await horariosParaFecha(fecha, personas);
      setHorarios(disponibles);
    });
  }

  function elegirHora(h: string) {
    setHora(h);
    setZonas(null);
    setZonaId(null);
    startTransition(async () => {
      const disponibles = await zonasParaFechaHora(fecha, h, personas);
      setZonas(disponibles);
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

  return (
    <div className="mx-auto w-full max-w-lg px-5 py-16">
      {step < 4 && (
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold uppercase sm:text-3xl">
            <span className="inline-block bg-primary px-3 py-1 text-primary-foreground">
              Reserva
            </span>
          </h1>
          <p className="mt-2 text-white">Paso {step} de 3</p>
        </div>
      )}

      {step === 1 && (
        <Card className="border-border/80 bg-card">
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="r-fecha">¿Qué día nos visitas?</Label>
              <Input
                id="r-fecha"
                type="date"
                value={fecha}
                min={hoyISO()}
                max={maxFechaISO()}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>¿Cuántas personas?</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setPersonas((p) => Math.max(1, p - 1))}
                >
                  -
                </Button>
                <Input
                  type="number"
                  className="w-20 text-center"
                  min={1}
                  max={48}
                  value={personas}
                  onChange={(e) =>
                    setPersonas(Math.min(48, Math.max(1, Number(e.target.value) || 1)))
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setPersonas((p) => Math.min(48, p + 1))}
                >
                  +
                </Button>
              </div>
            </div>

            <Button type="button" onClick={buscarHorarios} disabled={pending}>
              {pending ? "Buscando..." : "Ver horarios disponibles"}
            </Button>

            {horarios !== null && horarios.length === 0 && (
              <p className="text-sm text-white">
                No quedan horarios para ese día con ese número de personas. Prueba
                con otra fecha.
              </p>
            )}

            {horarios !== null && horarios.length > 0 && (
              <div className="flex flex-col gap-2">
                <Label>Elige la hora</Label>
                <div className="flex flex-wrap gap-2">
                  {horarios.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => elegirHora(h)}
                      className={cn(
                        buttonVariants({
                          variant: hora === h ? "default" : "outline",
                          size: "sm",
                        })
                      )}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hora && zonas !== null && (
              <div className="flex flex-col gap-2">
                <Label>Elige la zona</Label>
                {zonas.length === 0 && (
                  <p className="text-sm text-white">
                    No tenemos zonas con cupo para {personas} personas a esa hora.
                    Prueba con otra hora.
                  </p>
                )}
                <div className="flex flex-col gap-2">
                  {zonas.map((z) => (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => setZonaId(z.id)}
                      className={cn(
                        "rounded-md border px-4 py-3 text-left transition-colors",
                        zonaId === z.id
                          ? "border-primary ring-1 ring-primary"
                          : "border-border/80"
                      )}
                      style={{ backgroundColor: z.color, color: z.textColor }}
                    >
                      <div className="font-semibold">{z.name}</div>
                      <div className="text-sm opacity-90">{z.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="button"
              onClick={() => setStep(2)}
              disabled={!hora || !zonaId}
            >
              Continuar
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="border-border/80 bg-card">
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="r-nombre">Nombre</Label>
              <Input
                id="r-nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Manuel Cáceres"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="r-telefono">Teléfono</Label>
              <Input
                id="r-telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+57 300 000 0000"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="r-email">Correo (opcional)</Label>
              <Input
                id="r-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Motivo</Label>
              <div className="flex flex-wrap gap-2">
                {MOTIVOS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMotivo(m);
                      setCumpleanos(m === "Cumpleaños");
                    }}
                    className={cn(
                      buttonVariants({
                        variant: motivo === m ? "default" : "outline",
                        size: "sm",
                      })
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {cumpleanos && (
              <div className="flex flex-col gap-2">
                <Label>Decoración de cumpleaños</Label>
                <div className="flex flex-col gap-2">
                  {DECORACIONES.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDecoracionId(d.id)}
                      className={cn(
                        "rounded-md border px-4 py-2 text-left text-sm",
                        decoracionId === d.id
                          ? "border-primary bg-secondary"
                          : "border-border/80"
                      )}
                    >
                      <div className="text-white">{d.name}</div>
                      <div className="text-primary">
                        {d.price > 0 ? `$${d.price.toLocaleString("es-CO")}` : "Gratis"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Checkbox
                id="r-banda"
                checked={bandaMusical}
                onCheckedChange={(v) => setBandaMusical(v === true)}
              />
              <Label htmlFor="r-banda" className="font-normal">
                Quiero banda musical (cargo de $
                {RESERVAS_CONFIG.bandaMusicalCobro.toLocaleString("es-CO")})
              </Label>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="r-notas">Notas (opcional)</Label>
              <Textarea
                id="r-notas"
                rows={3}
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="¿Alguna solicitud especial? Alergias, silla para bebé, etc."
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Volver
              </Button>
              <Button
                type="button"
                className="flex-1"
                disabled={!nombre || !telefono}
                onClick={() => setStep(3)}
              >
                Continuar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="border-border/80 bg-card">
          <CardContent className="flex flex-col gap-5">
            <div className="text-sm text-white">
              <p>
                📅 {fecha} · 🕐 {hora} · 👥 {personas} personas
              </p>
              <p>📍 {ZONAS.find((z) => z.id === zonaId)?.name}</p>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="r-terms"
                checked={terms}
                onCheckedChange={(v) => setTerms(v === true)}
              />
              <Label htmlFor="r-terms" className="font-normal">
                Acepto los términos y condiciones de la reserva (antelación mínima,
                tiempo de la mesa y política de cancelación).
              </Label>
            </div>

            {error && <p className="text-sm text-primary">{error}</p>}

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(2)}>
                Volver
              </Button>
              <Button
                type="button"
                className="flex-1"
                disabled={!terms || pending}
                onClick={confirmarReserva}
              >
                {pending ? "Enviando..." : "Confirmar reserva"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && resultado && (
        <Card className="border-border/80 bg-card text-center">
          <CardContent className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-bold text-white">¡Solicitud enviada!</h2>
            <p className="text-white">
              Tu código de reserva es{" "}
              <span className="font-semibold text-primary">{resultado.codigo}</span>
            </p>
            <p className="text-sm text-white">
              Escríbenos por WhatsApp para confirmar tu reserva con el restaurante.
            </p>
            <Link
              href={resultado.whatsappUrl}
              target="_blank"
              className={cn(buttonVariants({ variant: "default", size: "lg" }))}
            >
              Escribir al restaurante por WhatsApp
            </Link>
            <Link href="/" className={cn(buttonVariants({ variant: "ghost" }))}>
              Volver al inicio
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
