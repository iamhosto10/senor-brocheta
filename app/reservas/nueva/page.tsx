import type { Metadata } from "next";
import Link from "next/link";
import { ReservaWizard } from "./reserva-wizard";

export const metadata: Metadata = {
  title: "Reservar mesa | Sr. Brocheta",
  description: "Reserva tu mesa en Sr. Brocheta, Valledupar.",
};

export default function NuevaReservaPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="rt-wrap" style={{ paddingBottom: 0 }}>
        <div className="rt-topbar">
          <Link href="/reservas" className="rt-icon-btn" aria-label="Volver al paso anterior">
            ←
          </Link>
          <span className="rt-topbar-title">Reservar mesa</span>
        </div>
      </div>
      <ReservaWizard />
    </div>
  );
}
