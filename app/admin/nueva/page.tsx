import type { Metadata } from "next";
import Link from "next/link";
import { NuevaReservaForm } from "./nueva-form";

export const metadata: Metadata = {
  title: "Nueva reserva | Sr. Brocheta",
};

export default function NuevaReservaPage() {
  return (
    <div className="rt-wrap" style={{ paddingBottom: 0 }}>
      <div className="rt-topbar">
        <Link href="/admin" className="rt-icon-btn" aria-label="Volver al panel">
          ←
        </Link>
        <span className="rt-topbar-title">Nueva reserva</span>
      </div>
      <div className="rt-card">
        <NuevaReservaForm />
      </div>
    </div>
  );
}
