import type { Metadata } from "next";
import Link from "next/link";
import { LookupForm } from "./lookup-form";

export const metadata: Metadata = {
  title: "Consultar mi reserva | Sr. Brocheta",
};

export default function ConsultarReservaPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="rt-wrap" style={{ paddingBottom: 0 }}>
        <div className="rt-topbar">
          <Link href="/reservas" className="rt-icon-btn" aria-label="Volver al inicio">
            ←
          </Link>
          <span className="rt-topbar-title">Consultar mi reserva</span>
        </div>
      </div>
      <LookupForm />
    </div>
  );
}
