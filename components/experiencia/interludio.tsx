"use client";

import { useEffect, useId, useRef } from "react";
import { gsap, prefiereMenosMovimiento } from "./gsap";
import { VideoFondo } from "./video-fondo";
import { CapaPapas, CortinaSalsa, GotasSalsa, LluviaQueso } from "./efectos-comida";

/**
 * Interludio: la sección se queda fija con un video de fondo y una frase
 * gigante cruza la pantalla de lado a lado mientras el visitante hace scroll.
 * Los efectos de entrada y salida son de comida (ver efectos-comida.tsx):
 *  - "queso": papas fritas que barren la pantalla y lluvia de queso y maíz.
 *  - "salsa": cortina de salsa que chorrea, gotas que caen y otra cortina al salir.
 */
export function Interludio({
  id,
  video,
  frase,
  etiqueta,
  efecto,
}: {
  id?: string;
  video: string;
  frase: string;
  etiqueta?: string;
  efecto: "queso" | "salsa";
}) {
  const raiz = useRef<HTMLElement>(null);
  const uid = useId().replace(/:/g, "");

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

      tl.fromTo(".int-video", { scale: 1.2 }, { scale: 1, duration: 1 }, 0).fromTo(
        texto,
        { x: () => window.innerWidth },
        { x: () => -texto.scrollWidth, duration: 0.86 },
        0.08
      );

      // Migas de queso / gotas de salsa: caen durante todo el recorrido, cada
      // una a su velocidad (las más rápidas parecen más cerca: paralaje).
      gsap.utils.toArray<HTMLElement>(".ef-miga").forEach((m) => {
        const vel = Number(m.dataset.vel) || 1;
        const giro = Number(m.dataset.giro) || 0;
        tl.fromTo(
          m,
          { y: 0, rotate: 0 },
          { y: () => window.innerHeight * 1.6 * vel, rotate: giro, duration: 1 },
          0
        );
      });

      if (efecto === "queso") {
        const barrer = (sel: string, inicio: number) =>
          gsap.utils.toArray<HTMLElement>(sel).forEach((p, i) => {
            const giro = Number(p.dataset.giro) || 0;
            tl.fromTo(
              p,
              { x: () => window.innerWidth * 1.15, rotate: giro },
              { x: () => -window.innerWidth * 1.7, rotate: giro * -1.6, duration: 0.2 },
              inicio + i * 0.012
            );
          });
        barrer(".ef-papa-entrada", 0);
        barrer(".ef-papa-salida", 0.8);
      } else {
        // La salsa que tapa la pantalla al llegar se escurre hacia abajo…
        tl.fromTo(".ef-salsa-entrada", { y: 0, yPercent: 0 }, { yPercent: 115, duration: 0.2, ease: "power1.in" }, 0)
          .fromTo(".ef-salsa-entrada .ef-salsa-crema", { y: 0, yPercent: 0 }, { yPercent: 22, duration: 0.2 }, 0)
          // …y al final baja otra capa que chorrea desde arriba.
          .fromTo(
            ".ef-salsa-salida",
            { y: 0, yPercent: -100, autoAlpha: 1 },
            { yPercent: 0, duration: 0.16, ease: "power1.out" },
            0.84
          )
          .fromTo(".ef-salsa-salida .ef-salsa-crema", { y: 0, yPercent: -25 }, { yPercent: 0, duration: 0.16 }, 0.84);
      }
    }, el);
    return () => ctx.revert();
  }, [efecto]);

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

      {efecto === "queso" ? <LluviaQueso /> : <GotasSalsa />}

      <div className="absolute inset-0 z-[16] flex items-center">
        <p className="int-frase font-display leading-none whitespace-nowrap text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)] text-[30vw] md:text-[19vw]">
          {frase}
        </p>
      </div>

      <div className="ef-comida">
        {efecto === "queso" ? (
          <>
            <CapaPapas clase="ef-papa-entrada" id={`${uid}e`} />
            <CapaPapas clase="ef-papa-salida" id={`${uid}s`} />
          </>
        ) : (
          <>
            <CortinaSalsa clase="ef-salsa-entrada" />
            <CortinaSalsa clase="ef-salsa-salida" />
          </>
        )}
      </div>
    </section>
  );
}
