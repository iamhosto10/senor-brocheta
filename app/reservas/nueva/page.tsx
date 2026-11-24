import type { Metadata } from "next";
import { ReservaWizard } from "./reserva-wizard";

export const metadata: Metadata = {
  title: "Reservar mesa | Señor Brocheta",
  description:
    "Reserva tu mesa en Señor Brocheta, Sede Dangond, Valledupar. Elige fecha, hora y zona, con o sin decoración.",
  alternates: { canonical: "/reservas/nueva" },
};

export default function NuevaReservaPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <ReservaWizard />
    </div>
  );
}
