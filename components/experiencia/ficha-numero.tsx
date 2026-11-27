"use client";

import { useEffect, useRef } from "react";
import { gsap, prefiereMenosMovimiento } from "./gsap";

/** Ficha de dato con el número que cuenta desde cero al entrar en pantalla. */
export function FichaNumero({
  valor,
  etiqueta,
  detalle,
  delay = 0,
}: {
  valor: number;
  etiqueta: string;
  detalle: string;
  delay?: number;
}) {
  const raiz = useRef<HTMLDivElement>(null);
  const numero = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefiereMenosMovimiento()) return;
    const ctx = gsap.context(() => {
      const estado = { n: 0 };
      gsap
        .timeline({ scrollTrigger: { trigger: raiz.current, start: "top 85%", once: true }, delay })
        .from(raiz.current, { y: 50, opacity: 0, duration: 1, ease: "expo.out" })
        .to(
          estado,
          {
            n: valor,
            duration: 1.4,
            ease: "power3.out",
            onUpdate: () => {
              if (numero.current) numero.current.textContent = String(Math.round(estado.n));
            },
          },
          0.1
        )
        .from(raiz.current!.querySelector(".ficha-linea"), { scaleX: 0, duration: 1, ease: "expo.out" }, 0.2);
    }, raiz);
    return () => ctx.revert();
  }, [valor, delay]);

  return (
    <div ref={raiz} className="ficha relative flex flex-col bg-white/[0.03] p-6 ring-1 ring-gold/20 backdrop-blur-sm">
      <span className="text-[10px] font-semibold tracking-[0.3em] text-gold uppercase">{etiqueta}</span>
      <span className="ficha-linea mt-4 block h-px w-full origin-left bg-gold/40" aria-hidden />
      <span ref={numero} className="mt-4 font-display text-7xl leading-none text-white">
        {valor}
      </span>
      <span className="mt-3 text-sm text-white/65">{detalle}</span>
    </div>
  );
}
