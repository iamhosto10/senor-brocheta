"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "cn";

type Plato = { nombre: string; src: string; alt: string };

const AUTOPLAY_MS = 4500;

export function FavoritosCarousel({ platos }: { platos: Plato[] }) {
  const total = platos.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);

  const go = useCallback(
    (dir: number) => setActive((i) => (i + dir + total) % total),
    [total]
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, reduced, go, active]);

  // Distancia circular más corta al slide activo (-2..2 para 5 slides).
  const offsetOf = (i: number) => {
    let o = i - active;
    if (o > total / 2) o -= total;
    if (o < -total / 2) o += total;
    return o;
  };

  return (
    <div
      className="relative mt-10 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Los favoritos de la casa"
      tabIndex={0}
    >
      {/* Brillo dorado detrás del plato activo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] size-[70vw] max-h-[560px] max-w-[560px] lg:max-h-[760px] lg:max-w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-3xl transition-opacity duration-700"
      />

      <div
        className="relative mx-auto h-[min(118vw,640px)] w-full touch-pan-y overflow-hidden [perspective:1400px] sm:h-[620px] lg:h-[820px]"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, moved: false };
          setPaused(true);
        }}
        onPointerMove={(e) => {
          if (drag.current && Math.abs(e.clientX - drag.current.x) > 8)
            drag.current.moved = true;
        }}
        onPointerUp={(e) => {
          const d = drag.current;
          drag.current = null;
          if (d) {
            const dx = e.clientX - d.x;
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          }
          if (e.pointerType !== "mouse") setPaused(false);
        }}
        onPointerCancel={() => {
          drag.current = null;
          setPaused(false);
        }}
      >
        {platos.map((plato, i) => {
          const o = offsetOf(i);
          const abs = Math.abs(o);
          const visible = abs <= 2;
          const isActive = o === 0;
          return (
            <div
              key={plato.nombre}
              aria-hidden={!isActive}
              onClick={() => !isActive && visible && setActive(i)}
              className={cn(
                "absolute left-1/2 top-4 w-[78vw] max-w-[480px] cursor-pointer lg:max-w-[620px] transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] will-change-transform sm:w-[440px] lg:w-[620px]",
                !visible && "pointer-events-none"
              )}
              style={{
                transform: `translateX(calc(-50% + ${o * 58}%)) translateZ(${-abs * 180}px) rotateY(${o * -32}deg) scale(${isActive ? 1 : 0.86 - abs * 0.06})`,
                opacity: visible ? (isActive ? 1 : 0.55 - (abs - 1) * 0.3) : 0,
                filter: isActive ? "none" : `blur(${abs * 1.5}px) brightness(0.6)`,
                zIndex: 10 - abs,
              }}
            >
              <div
                className={cn(
                  "relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 transition-shadow duration-700",
                  isActive
                    ? "shadow-[0_30px_80px_-20px_rgba(222,191,100,0.45)] ring-gold/60"
                    : "shadow-xl ring-gold/15"
                )}
              >
                <Image
                  src={plato.src}
                  alt={plato.alt}
                  fill
                  sizes="(min-width: 1024px) 620px, (min-width: 640px) 480px, 80vw"
                  className={cn(
                    "object-cover transition-transform duration-[6000ms] ease-out",
                    isActive && !reduced ? "scale-110" : "scale-100"
                  )}
                  loading={i === 0 ? "eager" : "lazy"}
                />
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent"
                />
                {isActive && !reduced && (
                  <div
                    aria-hidden
                    className="favoritos-shine pointer-events-none absolute inset-0"
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* Flechas */}
        <button
          type="button"
          aria-label="Plato anterior"
          onClick={() => go(-1)}
          className="absolute left-2 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/50 bg-black/60 text-gold backdrop-blur transition hover:scale-110 hover:bg-primary hover:text-white sm:left-6"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <button
          type="button"
          aria-label="Plato siguiente"
          onClick={() => go(1)}
          className="absolute right-2 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/50 bg-black/60 text-gold backdrop-blur transition hover:scale-110 hover:bg-primary hover:text-white sm:right-6"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>

      {/* Nombre animado */}
      <div className="mt-2 flex h-14 items-center justify-center text-center" aria-live="polite">
        <h3
          key={active}
          className="favoritos-title font-display text-3xl text-foreground sm:text-4xl"
        >
          {platos[active].nombre}
        </h3>
      </div>

      {/* Puntos con progreso */}
      <div className="mt-3 flex items-center justify-center gap-2.5">
        {platos.map((p, i) => (
          <button
            key={p.nombre}
            type="button"
            aria-label={`Ver ${p.nombre}`}
            aria-current={i === active}
            onClick={() => setActive(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              i === active ? "w-8 bg-gold" : "w-2 bg-foreground/30 hover:bg-foreground/60"
            )}
          />
        ))}
      </div>
    </div>
  );
}
