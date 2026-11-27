"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefiereMenosMovimiento } from "./gsap";
import { VideoFondo } from "./video-fondo";

export type FotoGaleria = { src: string; alt: string; pie: string };

/** Posición (en % del ancho/alto) y ancho de cada foto en la escena. */
const LUGARES = [
  { x: 58, y: 50, w: "min(34vw, 420px)" },
  { x: 30, y: 46, w: "min(24vw, 300px)" },
  { x: 66, y: 44, w: "min(30vw, 380px)" },
  { x: 38, y: 54, w: "min(32vw, 400px)" },
  { x: 62, y: 52, w: "min(26vw, 330px)" },
  { x: 34, y: 48, w: "min(30vw, 380px)" },
  { x: 56, y: 46, w: "min(28vw, 360px)" },
  { x: 44, y: 52, w: "min(34vw, 420px)" },
];

/**
 * Galería en profundidad: la sección queda fija sobre un video oscuro y las
 * fotos se acercan desde el fondo, pasan por el frente y se desvanecen, una
 * tras otra, con su pie de foto abajo.
 */
export function GaleriaProfundidad({ fotos }: { fotos: FotoGaleria[] }) {
  const raiz = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefiereMenosMovimiento()) return;
    const el = raiz.current!;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".gp-foto");
      const pies = gsap.utils.toArray<HTMLElement>(".gp-pie");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: `+=${items.length * 65}%`,
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
        },
        defaults: { ease: "none" },
      });
      tl.fromTo(".gp-titulo", { opacity: 1, y: 0 }, { opacity: 0, y: -40, duration: 0.6 }, 0.2);
      items.forEach((item, i) => {
        const t = i * 0.55;
        tl.fromTo(
          item,
          { scale: 0.15, opacity: 0, filter: "blur(10px)" },
          { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.7, ease: "power1.out" },
          t
        )
          .to(item, { scale: 2.4, opacity: 0, filter: "blur(6px)", duration: 0.7, ease: "power1.in" }, t + 0.75)
          .fromTo(pies[i], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25 }, t + 0.35)
          .to(pies[i], { opacity: 0, y: -10, duration: 0.25 }, t + 0.95);
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="galeria"
      ref={raiz}
      className="galeria-prof relative overflow-hidden bg-black"
      aria-label="Galería"
    >
      <div className="gp-fondo absolute inset-0">
        <VideoFondo nombre="mesa" className="scale-110 blur-[3px] brightness-[0.35]" />
      </div>

      <div className="gp-titulo pointer-events-none absolute inset-x-0 top-28 z-20 text-center">
        <p className="text-[11px] font-semibold tracking-[0.35em] text-gold uppercase">Capítulo 04</p>
        <h2 className="mt-2 font-display text-6xl text-white sm:text-8xl">GALERIA</h2>
      </div>

      <ul className="gp-escena">
        {fotos.map((foto, i) => {
          const l = LUGARES[i % LUGARES.length];
          return (
            <li
              key={foto.src}
              className="gp-foto"
              style={{ "--x": `${l.x}%`, "--y": `${l.y}%`, "--w": l.w } as React.CSSProperties}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm shadow-[0_30px_80px_rgba(0,0,0,0.6)] ring-1 ring-white/15">
                <Image src={foto.src} alt={foto.alt} fill sizes="(min-width: 768px) 420px, 80vw" className="object-cover" />
              </div>
              <p className="gp-pie-estatico mt-2 text-center text-xs text-white/70">{foto.pie}</p>
            </li>
          );
        })}
      </ul>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 h-5 text-center" aria-hidden>
        {fotos.map((foto) => (
          <span
            key={foto.src}
            className="gp-pie absolute inset-x-0 text-xs font-semibold tracking-[0.2em] text-white/85 uppercase opacity-0"
          >
            {foto.pie}
          </span>
        ))}
      </div>
    </section>
  );
}
