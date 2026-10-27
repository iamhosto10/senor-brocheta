import type { Metadata } from "next";
import { listarReservas } from "./actions";
import { AdminTable } from "./admin-table";

export const metadata: Metadata = {
  title: "Panel de reservas | Sr. Brocheta",
};

export default async function AdminPage() {
  const reservas = await listarReservas();

  return (
    <div className="rt-wrap-wide">
      <h1 style={{ marginBottom: 24 }}>Panel de reservas</h1>
      <AdminTable reservasIniciales={reservas} />
    </div>
  );
}
