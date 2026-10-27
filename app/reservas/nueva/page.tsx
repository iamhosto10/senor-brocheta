import type { Metadata } from "next";
import { ReservaWizard } from "./reserva-wizard";

export const metadata: Metadata = {
  title: "Reservar mesa | Sr. Brocheta",
  description: "Reserva tu mesa en Sr. Brocheta, Valledupar.",
};

export default function NuevaReservaPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <ReservaWizard />
    </div>
  );
}
