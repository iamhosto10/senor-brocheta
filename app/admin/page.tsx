import Image from "next/image";
import type { Metadata } from "next";
import { listarReservas } from "./actions";
import { AdminTable } from "./admin-table";

export const metadata: Metadata = {
  title: "Panel de reservas | Sr. Brocheta",
};

export default async function AdminPage() {
  const reservas = await listarReservas();

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10">
      <div className="mb-6 flex items-center gap-3">
        <Image
          src="/images/logo.jpg"
          alt="Logo Sr. Brocheta"
          width={40}
          height={40}
          className="rounded-full ring-1 ring-primary/50"
        />
        <h1 className="text-xl font-bold text-white">Panel de reservas</h1>
      </div>
      <AdminTable reservasIniciales={reservas} />
    </div>
  );
}
