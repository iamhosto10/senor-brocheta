import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { obtenerReserva } from "../actions";
import { ReservaDetailView } from "./detail-view";

export const metadata: Metadata = {
  title: "Detalle de reserva | Sr. Brocheta",
};

export default async function AdminReservaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reserva = await obtenerReserva(id);
  if (!reserva) notFound();

  return (
    <div className="rt-wrap" style={{ paddingBottom: 0 }}>
      <div className="rt-topbar">
        <Link href="/admin" className="rt-icon-btn" aria-label="Volver al panel">
          ←
        </Link>
        <span className="rt-topbar-title">Detalle de la reserva</span>
      </div>
      <ReservaDetailView reserva={reserva} />
    </div>
  );
}
