import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reservas | Sr. Brocheta",
  description: "Reserva tu mesa en Sr. Brocheta, Valledupar.",
};

export default function ReservasHomePage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="rt-home-hero">
        <div className="rt-brand-logo" role="img" aria-label="SR. BROCHETA" />
        <p className="tagline">Reservas</p>
      </div>
      <div className="rt-home-actions">
        <Link href="/reservas/nueva" className="rt-btn rt-btn-primary">
          Reservar mesa
        </Link>
        <Link href="/reservas/consultar" className="rt-btn rt-btn-ghost">
          Consultar mi reserva
        </Link>
      </div>
    </div>
  );
}
