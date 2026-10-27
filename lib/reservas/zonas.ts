export type Zona = {
  id: string;
  name: string;
  type: "abierta" | "climatizada";
  desc: string;
  color: string;
  textColor: string;
  img?: string;
} & (
  | { flexible: true; t8: number; t4: number; units?: undefined }
  | { flexible: true; units: number; t8?: undefined; t4?: undefined }
  | { flexible: false; t8: number; t4: number; units?: undefined }
);

/**
 * Datos reales de cada zona, portados tal cual del sistema de reservas original.
 * Las mesas se cuentan en "unidades" de 4 puestos: una mesa de 8 = 2 unidades.
 * flexible:true  -> las mesas se reorganizan según el grupo (solo se ocupa lo necesario).
 * flexible:false -> mesas fijas: t8 mesas de 8 y t4 mesas de 4.
 */
export const ZONAS: Zona[] = [
  {
    id: "zona1",
    name: "Zona 1",
    type: "abierta",
    flexible: true,
    t8: 4,
    t4: 4,
    desc: "Se adecua a tu grupo · ideal para celebraciones",
    color: "#5B7A3A",
    textColor: "#FFFFFF",
  },
  {
    id: "zona2",
    name: "Zona 2",
    type: "abierta",
    flexible: true,
    t8: 6,
    t4: 3,
    desc: "Amplia · se adecua a tu grupo",
    color: "#DEBF64",
    textColor: "#241A0E",
  },
  {
    id: "zona3",
    name: "Zona 3",
    type: "abierta",
    flexible: false,
    t8: 1,
    t4: 8,
    desc: "Mesas fijas · ideal para una cena casual",
    color: "#B71C1C",
    textColor: "#FFFFFF",
    img: "/images/reservas/zona3.jpg",
  },
  {
    id: "zona4",
    name: "Zona 4",
    type: "climatizada",
    flexible: true,
    t8: 1,
    t4: 7,
    desc: "Ambiente climatizado",
    color: "#A9793D",
    textColor: "#FFFFFF",
    img: "/images/reservas/zona4.jpg",
  },
  {
    id: "zona5",
    name: "Zona 5",
    type: "climatizada",
    flexible: true,
    units: 12,
    desc: "Climatizada · decorada para celebraciones",
    color: "#4A3728",
    textColor: "#FFFFFF",
    img: "/images/reservas/zona5.jpg",
  },
];

/** Capacidad máxima (número de puestos) de una zona. */
export function capacidadZona(zona: Zona): number {
  if ("units" in zona && zona.units !== undefined) return zona.units * 4;
  return (zona.t8 ?? 0) * 8 + (zona.t4 ?? 0) * 4;
}
