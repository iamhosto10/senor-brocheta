"use client";

import { useRouter } from "next/navigation";
import { ReservaForm } from "../reserva-form";
import { crearReservaManual } from "../actions";

export function NuevaReservaForm() {
  const router = useRouter();

  return (
    <ReservaForm
      textoBoton="Crear reserva"
      mostrarConfirmar
      onSubmit={async (datos, confirmar) => {
        const res = await crearReservaManual(datos, confirmar);
        if (res.ok) {
          if (res.aviso) alert(res.aviso);
          router.push(`/admin/${res.id}`);
        }
        return res;
      }}
    />
  );
}
