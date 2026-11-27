"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "cn";

export type FotoAmpliable = { src: string; alt: string; titulo?: string };

type LenisGlobal = { __lenis?: { stop(): void; start(): void } };

/**
 * Cuadrícula de fotos grandes que se abren en un visor a pantalla completa
 * al hacer clic. El visor se cierra con Esc, con la X o tocando el fondo, y
 * se navega con las flechas (teclado o botones) o deslizando en el celular.
 */
export function FotosAmpliables({ fotos }: { fotos: FotoAmpliable[] }) {
  const [abierta, setAbierta] = useState<number | null>(null);
  const toque = useRef<number | null>(null);
  const cerrarBtn = useRef<HTMLButtonElement>(null);
  const total = fotos.length;

  const mover = useCallback(
    (dir: number) => setAbierta((i) => (i === null ? i : (i + dir + total) % total)),
    [total]
  );

  useEffect(() => {
    if (abierta === null) return;
    const lenis = (window as LenisGlobal).__lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    cerrarBtn.current?.focus();
    const teclado = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierta(null);
      if (e.key === "ArrowRight") mover(1);
      if (e.key === "ArrowLeft") mover(-1);
    };
    window.addEventListener("keydown", teclado);
    return () => {
      window.removeEventListener("keydown", teclado);
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [abierta, mover]);

  const actual = abierta === null ? null : fotos[abierta];

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {fotos.map((foto, i) => (
          <button
            key={foto.src}
            type="button"
            data-reveal="image"
            style={{ "--d": `${(i % 2) * 120}ms` } as React.CSSProperties}
            onClick={() => setAbierta(i)}
            aria-label={`Ampliar foto: ${foto.alt}`}
            className="group relative aspect-[3/2] cursor-zoom-in overflow-hidden rounded-md ring-1 ring-gold/20 transition-shadow hover:ring-gold/60"
          >
            <Image
              src={foto.src}
              alt={foto.alt}
              fill
              sizes="(min-width: 1152px) 560px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span
              className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/75 to-transparent p-4 pt-12 text-left"
              aria-hidden
            >
              <span className="text-sm font-bold text-white">{foto.titulo}</span>
              <span className="flex size-9 items-center justify-center rounded-full border border-gold/60 bg-black/50 text-gold transition-colors group-hover:bg-gold group-hover:text-black">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </span>
            </span>
          </button>
        ))}
      </div>

      {actual && abierta !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={actual.alt}
          data-lenis-prevent
          className="visor-fotos fixed inset-0 z-[60] flex flex-col bg-black/95 backdrop-blur-sm"
          onClick={() => setAbierta(null)}
          onTouchStart={(e) => (toque.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (toque.current === null) return;
            const dx = e.changedTouches[0].clientX - toque.current;
            toque.current = null;
            if (Math.abs(dx) > 50) mover(dx < 0 ? 1 : -1);
          }}
        >
          <div className="flex items-center justify-between px-5 py-4 text-white">
            <span className="text-xs font-semibold tracking-[0.25em] text-gold tabular-nums">
              {String(abierta + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <button
              ref={cerrarBtn}
              type="button"
              aria-label="Cerrar"
              onClick={() => setAbierta(null)}
              className="flex size-11 items-center justify-center rounded-full border border-white/30 transition-colors hover:border-gold hover:text-gold"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative flex-1">
            <Image
              key={actual.src}
              src={actual.src}
              alt={actual.alt}
              fill
              sizes="100vw"
              quality={85}
              className="visor-foto object-contain px-2 sm:px-20"
              onClick={(e) => e.stopPropagation()}
            />
            {total > 1 &&
              [
                { dir: -1, label: "Foto anterior", lado: "left-2 sm:left-5", d: "m15 18-6-6 6-6" },
                { dir: 1, label: "Foto siguiente", lado: "right-2 sm:right-5", d: "m9 18 6-6-6-6" },
              ].map((b) => (
                <button
                  key={b.dir}
                  type="button"
                  aria-label={b.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    mover(b.dir);
                  }}
                  className={cn(
                    "absolute top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-gold/50 bg-black/60 text-gold transition hover:bg-primary hover:text-white",
                    b.lado
                  )}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={b.d} />
                  </svg>
                </button>
              ))}
          </div>

          {actual.titulo && (
            <p className="px-5 py-5 text-center text-sm font-semibold text-white/85">{actual.titulo}</p>
          )}
        </div>
      )}
    </>
  );
}
