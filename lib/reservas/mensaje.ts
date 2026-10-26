import { RESERVAS_CONFIG } from "./config";
import { ZONAS } from "./zonas";
import { DECORACIONES } from "./decoraciones";

export type ReservaParaMensaje = {
  codigo: string;
  fecha: string;
  hora: string;
  personas: number;
  zona_id: string;
  nombre: string;
  telefono: string;
  motivo: string | null;
  notas: string | null;
  cumpleanos: boolean;
  decoracion_id: string | null;
  banda_musical: boolean;
};

function formatearFecha(fecha: string): string {
  const [y, m, d] = fecha.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function construirMensajeWhatsApp(reserva: ReservaParaMensaje): string {
  const zona = ZONAS.find((z) => z.id === reserva.zona_id);

  const lineas = [
    `Hola, quiero confirmar mi reserva en Sr. Brocheta 🔥`,
    ``,
    `Código: ${reserva.codigo}`,
    `Fecha: ${formatearFecha(reserva.fecha)}`,
    `Hora: ${reserva.hora}`,
    `Personas: ${reserva.personas}`,
    `Zona: ${zona?.name ?? reserva.zona_id}`,
    `Nombre: ${reserva.nombre}`,
    `Teléfono: ${reserva.telefono}`,
  ];

  if (reserva.motivo) lineas.push(`Motivo: ${reserva.motivo}`);
  if (reserva.cumpleanos) {
    lineas.push(`🎉 Es un cumpleaños`);
    const deco = DECORACIONES.find((d) => d.id === reserva.decoracion_id);
    if (deco && deco.price > 0) {
      lineas.push(`Decoración: ${deco.name} ($${deco.price.toLocaleString("es-CO")})`);
    }
  }
  if (reserva.banda_musical) {
    lineas.push(
      `Banda musical: sí (cargo de $${RESERVAS_CONFIG.bandaMusicalCobro.toLocaleString("es-CO")})`
    );
  }
  if (reserva.notas) lineas.push(`Notas: ${reserva.notas}`);

  return lineas.join("\n");
}

export function construirUrlWhatsApp(reserva: ReservaParaMensaje): string {
  const texto = construirMensajeWhatsApp(reserva);
  return `https://wa.me/${RESERVAS_CONFIG.whatsappNumber}?text=${encodeURIComponent(texto)}`;
}
