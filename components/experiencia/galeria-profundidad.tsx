"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefiereMenosMovimiento } from "./gsap";

export type FotoGaleria = { src: string; alt: string; pie: string };

/**
 * Galería: la sección queda fija y muestra una foto a la vez, del alto de la
 * pantalla, sin recortarla (a los lados va la misma foto desenfocada). Cada
 * foto nueva sube como una cortina sobre la anterior y entra con un zoom muy
 * suave, para que la comida se vea grande y quieta, sin mareo.
 */
export function GaleriaProfundidad({ fotos }: { fotos: FotoGaleria[] }) {
  const raiz = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefiereMenosMovimiento()) return;
    const el = raiz.current!;
    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>(".gp-slide");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${window.innerHeight * (slides.length + 0.5)}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      // Título de entrada
      tl.fromTo(".gp-titulo", { opacity: 1, y: 0 }, { opacity: 0, y: -30, duration: 0.35 }, 0.25);

      slides.forEach((slide, i) => {
        const inicio = 0.3 + i; // cada foto ocupa una pantalla de scroll
        tl.fromTo(
          slide,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.45, ease: "power2.inOut" },
          inicio
        )
          .fromTo(
            slide.querySelector(".gp-foto-img"),
            { scale: 1.12 },
            { scale: 1, duration: 1, ease: "power1.out" },
            inicio
          )
          .fromTo(
            slide.querySelectorAll(".gp-texto > *"),
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: "power2.out" },
            inicio + 0.25
          );
      });
      tl.to({}, { duration: 0.2 }); // un respiro con la última foto
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="galeria" ref={raiz} className="galeria-prof relative overflow-hidden bg-black" aria-label="Galería">
      <div className="gp-titulo pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center text-center">
        <p className="text-[11px] font-semibold tracking-[0.35em] text-gold uppercase">Capítulo 04</p>
        <h2 className="mt-2 font-display text-7xl text-white sm:text-9xl">galeria</h2>
        <p className="mt-4 text-sm text-white/60">Desliza para ver cada plato</p>
      </div>

      <ul className="gp-escena">
        {fotos.map((foto, i) => (
          <li key={foto.src} className="gp-slide">
            {/* Fondo: la misma foto desenfocada para llenar los lados */}
            <div className="gp-fondo-foto absolute inset-0" aria-hidden>
              <Image src={foto.src} alt="" fill sizes="100vw" className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/35" aria-hidden />

            {/* La foto completa, del alto de la pantalla */}
            <div className="gp-marco absolute inset-x-0 bottom-0">
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                sizes="100vw"
                className="gp-foto-img object-contain"
              />
            </div>

            <div className="gp-texto absolute bottom-6 left-5 z-10 sm:bottom-10 sm:left-10">
              <p className="text-[11px] font-bold tracking-[0.3em] text-gold tabular-nums">
                {String(i + 1).padStart(2, "0")} / {String(fotos.length).padStart(2, "0")}
              </p>
              <p className="mt-1 max-w-[80vw] text-2xl font-extrabold text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] sm:text-4xl">
                {foto.pie}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
