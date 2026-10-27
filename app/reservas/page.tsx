import type { Metadata } from "next";
import Link from "next/link";
import { ReservaWizard } from "./reserva-wizard";

export const metadata: Metadata = {
  title: "Reserva | Sr. Brocheta",
  description: "Reserva tu mesa en Sr. Brocheta, Valledupar.",
};

export default function ReservasPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="rt-wrap" style={{ paddingBottom: 0 }}>
        <div className="rt-topbar">
          <Link href="/" className="rt-icon-btn" aria-label="Volver al inicio">
            ←
          </Link>
          <span className="rt-topbar-title">SR. BROCHETA</span>
        </div>
      </div>
      <ReservaWizard />
    </div>
  );
}
