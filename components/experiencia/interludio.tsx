"use client";

import { useEffect, useRef } from "react";
import { gsap, prefiereMenosMovimiento } from "./gsap";
import { VideoFondo } from "./video-fondo";

/** Cortinillas: paralelogramos rojos y dorados que barren la pantalla. */
const CORTINAS = [
  { top: "4%", h: "22%", w: "46vw", color: "bg-primary" },
  { top: "22%", h: "10%", w: "30vw", color: "bg-gold" },
  { top: "38%", h: "26%", w: "58vw", color: "bg-primary" },
  { top: "66%", h: "8%", w: "24vw", color: "bg-white" },
  { top: "76%", h: "20%", w: "42vw", color: "bg-primary" },
];

/**
 * Interludio: la sección se queda fija con un video de fondo y una frase
 * gigante cruza la pantalla de lado a lado mientras el visitante hace scroll.
 * Al entrar y al salir pasan las cortinillas.
 */
export function Interludio({
  id,
  video,
  frase,
  etiqueta,
}: {
  id?: string;
  video: string;
  frase: string;
  etiqueta?: string;
}) {
  const raiz = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefiereMenosMovimiento()) return;
    const el = raiz.current!;
    const ctx = gsap.context(() => {
      const texto = el.querySelector<HTMLElement>(".int-frase")!;
      const recorrido = () => texto.scrollWidth + window.innerWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${recorrido() * 1.1}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      tl.fromTo(
        ".int-cortina",
        { x: () => window.innerWidth * 1.05, skewX: -18 },
        { x: () => -window.innerWidth * 1.6, duration: 0.22, stagger: 0.015 },
        0
      )
        .fromTo(".int-video", { scale: 1.2 }, { scale: 1, duration: 1 }, 0)
        .fromTo(texto, { x: () => window.innerWidth }, { x: () => -texto.scrollWidth, duration: 0.86 }, 0.08)
        .fromTo(
          ".int-cortina-salida",
          { x: () => window.innerWidth * 1.05, skewX: -18 },
          { x: () => -window.innerWidth * 0.1, duration: 0.14, stagger: 0.012 },
          0.86
        );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id={id}
      ref={raiz}
      className="interludio relative h-[100svh] overflow-hidden bg-black"
      aria-label={frase}
    >
      <div className="int-video absolute inset-0">
        <VideoFondo nombre={video} />
      </div>
      <div className="absolute inset-0 bg-black/45" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"
        aria-hidden
      />

      {etiqueta && (
        <p className="absolute top-24 left-5 z-10 text-[11px] font-semibold tracking-[0.35em] text-gold uppercase sm:left-10">
          {etiqueta}
        </p>
      )}

      <div className="absolute inset-0 z-10 flex items-center">
        <p className="int-frase font-display leading-none whitespace-nowrap text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)] text-[30vw] md:text-[19vw]">
          {frase}
        </p>
      </div>

      {CORTINAS.map((c, i) => (
        <span
          key={`e${i}`}
          aria-hidden
          className={`int-cortina pointer-events-none absolute left-0 z-20 ${c.color}`}
          style={{ top: c.top, height: c.h, width: c.w, transform: "translateX(110vw) skewX(-18deg)" }}
        />
      ))}
      {CORTINAS.map((c, i) => (
        <span
          key={`s${i}`}
          aria-hidden
          className={`int-cortina-salida pointer-events-none absolute z-20 ${c.color}`}
          style={{
            top: c.top,
            height: c.h,
            width: c.w,
            left: `${(i * 13) % 50}vw`,
            transform: "translateX(110vw) skewX(-18deg)",
          }}
        />
      ))}
    </section>
  );
}
