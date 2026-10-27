import "server-only";
import { Resend } from "resend";
import { ZONAS } from "./zonas";
import { DECORACIONES } from "./decoraciones";
import { RESERVAS_CONFIG } from "./config";

const SITE_URL = "https://srbrocheta.com";
const LOGO_URL = `${SITE_URL}/images/logo.jpg`;
const STAFF_EMAIL = "contacto@srbrocheta.com";
const FROM_EMAIL = "Sr. Brocheta <contacto@srbrocheta.com>";

export type ReservaParaCorreo = {
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
};

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

function fmtTime12(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "pm" : "am";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function filaDetalle(label: string, valor: string): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #e6d9be;color:#7a6a4e;font-size:13px;font-family:Arial,Helvetica,sans-serif;">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid #e6d9be;color:#1a1410;font-size:14px;font-weight:600;text-align:right;font-family:Arial,Helvetica,sans-serif;">${valor}</td>
    </tr>`;
}

function plantillaBase(opts: {
  titulo: string;
  subtitulo: string;
  filasHtml: string;
  notaFinal: string;
  cta?: { texto: string; url: string };
}): string {
  const { titulo, subtitulo, filasHtml, notaFinal, cta } = opts;
  return `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:0;background:#f5efe2;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5efe2;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:480px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e6d9be;">
            <tr>
              <td style="background:#14110d;padding:28px 24px;text-align:center;">
                <img src="${LOGO_URL}" width="56" height="56" alt="Sr. Brocheta" style="border-radius:999px;display:block;margin:0 auto 12px;" />
                <div style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:0.04em;">SR. BROCHETA</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 24px 8px;">
                <h1 style="margin:0 0 6px;font-size:20px;color:#1a1410;">${titulo}</h1>
                <p style="margin:0 0 20px;font-size:14px;color:#7a6a4e;">${subtitulo}</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${filasHtml}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px 28px;">
                <p style="margin:0;font-size:13px;color:#7a6a4e;line-height:1.5;">${notaFinal}</p>
                ${
                  cta
                    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;">
                  <tr>
                    <td align="center" style="background:#b71c1c;border-radius:10px;">
                      <a href="${cta.url}" style="display:block;padding:13px 20px;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;">${cta.texto}</a>
                    </td>
                  </tr>
                </table>`
                    : ""
                }
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;font-size:11px;color:#b8a67e;">Sr. Brocheta · Grill &amp; Burger · Valledupar</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function filasReserva(reserva: ReservaParaCorreo): string {
  const zona = ZONAS.find((z) => z.id === reserva.zona_id);
  const filas = [
    filaDetalle("Código", reserva.codigo),
    filaDetalle("Fecha", formatearFechaLarga(reserva.fecha)),
    filaDetalle("Hora", fmtTime12(reserva.hora)),
    filaDetalle("Personas", String(reserva.personas)),
    filaDetalle("Zona", zona?.name ?? reserva.zona_id),
    filaDetalle("Nombre", reserva.nombre),
    filaDetalle("Teléfono", reserva.telefono),
  ];
  if (reserva.email) filas.push(filaDetalle("Correo", reserva.email));
  if (reserva.motivo) filas.push(filaDetalle("Motivo", reserva.motivo));
  if (reserva.cumpleanos) {
    const deco = DECORACIONES.find((d) => d.id === reserva.decoracion_id);
    filas.push(filaDetalle("Cumpleaños", "Sí" + (deco && deco.price > 0 ? ` · ${deco.name}` : "")));
  }
  if (reserva.banda_musical) {
    filas.push(
      filaDetalle(
        "Banda musical",
        `Sí · cargo de $${RESERVAS_CONFIG.bandaMusicalCobro.toLocaleString("es-CO")}`
      )
    );
  }
  if (reserva.notas) filas.push(filaDetalle("Notas", reserva.notas));
  return filas.join("");
}

function emailStaffHTML(reserva: ReservaParaCorreo): string {
  return plantillaBase({
    titulo: "Nueva solicitud de reserva",
    subtitulo: "Un cliente acaba de solicitar una reserva desde la página.",
    filasHtml: filasReserva(reserva),
    notaFinal:
      "Confírmala con el cliente por WhatsApp y actualiza el estado en el panel de reservas.",
  });
}

function emailClienteHTML(reserva: ReservaParaCorreo): string {
  const whatsapp = `https://wa.me/${RESERVAS_CONFIG.whatsappNumber}`;
  return plantillaBase({
    titulo: "¡Recibimos tu solicitud!",
    subtitulo: `Hola ${reserva.nombre}, esta es la información de tu reserva.`,
    filasHtml: filasReserva(reserva),
    notaFinal:
      "Tu reserva queda <b>pendiente</b>: nuestro equipo la confirmará directamente contigo por WhatsApp. Si necesitas cancelarla o modificarla, escríbenos.",
    cta: { texto: "Escribirnos por WhatsApp", url: whatsapp },
  });
}

export async function enviarCorreosReserva(reserva: ReservaParaCorreo) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);

  const envios: Promise<unknown>[] = [
    resend.emails.send({
      from: FROM_EMAIL,
      to: STAFF_EMAIL,
      subject: `Nueva reserva · ${reserva.nombre} · ${reserva.fecha} ${fmtTime12(reserva.hora)}`,
      html: emailStaffHTML(reserva),
    }),
  ];

  if (reserva.email) {
    envios.push(
      resend.emails.send({
        from: FROM_EMAIL,
        to: reserva.email,
        subject: `Tu reserva en Sr. Brocheta · Código ${reserva.codigo}`,
        html: emailClienteHTML(reserva),
      })
    );
  }

  // No bloquea la respuesta al cliente si el correo falla: la reserva ya quedó guardada.
  const resultados = await Promise.allSettled(envios);
  resultados.forEach((r) => {
    if (r.status === "rejected") console.error("Error enviando correo de reserva:", r.reason);
  });
}
