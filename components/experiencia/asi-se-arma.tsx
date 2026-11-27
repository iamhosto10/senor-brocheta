"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "cn";
import { gsap, prefiereMenosMovimiento } from "./gsap";

const TOTAL = 104; // /public/media/arma/f001.webp … f104.webp (2,5 fotogramas por segundo)
const src = (i: number) => `/media/arma/f${String(i + 1).padStart(3, "0")}.webp`;

/** Pasos del armado y el fotograma donde empieza cada uno. */
const PASOS = [
  { desde: 0, titulo: "Papas y salchicha", texto: "Recién salidas del aceite, crocantes por fuera." },
  { desde: 20, titulo: "Las salsas", texto: "La base que lo une todo." },
  { desde: 33, titulo: "Repollo fresco", texto: "Para el contraste que no puede faltar." },
  { desde: 58, titulo: "Queso", texto: "Sin miedo, que cubra todo." },
  { desde: 69, titulo: "Maíz", texto: "El toque dulce." },
  { desde: 74, titulo: "Tocineta", texto: "Picada y dorada." },
  { desde: 83, titulo: "Salsa final", texto: "El hilo que corona el plato." },
  { desde: 98, titulo: "Lista", texto: "Ahora sí: a compartir." },
];

function pasoDe(frame: number) {
  let p = 0;
  PASOS.forEach((paso, i) => {
    if (frame >= paso.desde) p = i;
  });
  return p;
}

/**
 * La salchipapa se arma mientras el visitante hace scroll: la sección queda
 * fija y cada movimiento avanza los fotogramas dibujados en un canvas.
 */
export function AsiSeArma() {
  const raiz = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [paso, setPaso] = useState(0);

  useEffect(() => {
    const el = raiz.current!;
    const cv = canvas.current!;
    const c2d = cv.getContext("2d")!;
    const imgs: HTMLImageElement[] = [];
    let actual = 0;
    const reducido = prefiereMenosMovimiento();

    const dibujar = (i: number) => {
      // Usa el fotograma más cercano ya cargado
      let k = i;
      while (k > 0 && !(imgs[k]?.complete && imgs[k].naturalWidth)) k--;
      const img = imgs[k];
      if (!img?.complete || !img.naturalWidth) return;
      const w = cv.width, h = cv.height;
      const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
      c2d.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    };

    const ajustar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(cv.clientWidth * dpr);
      cv.height = Math.round(cv.clientHeight * dpr);
      dibujar(actual);
    };

    const cargar = (desde = 0) => {
      for (let i = desde; i < TOTAL; i++) {
        if (imgs[i]) continue;
        const img = new Image();
        img.decoding = "async";
        img.src = src(i);
        if (i === actual || i === TOTAL - 1) img.onload = () => dibujar(actual);
        imgs[i] = img;
      }
    };

    if (reducido) {
      actual = TOTAL - 1;
      const ultima = new Image();
      ultima.src = src(TOTAL - 1);
      imgs[TOTAL - 1] = ultima;
      ultima.onload = () => {
        ajustar();
        setPaso(PASOS.length - 1);
      };
      window.addEventListener("resize", ajustar);
      return () => window.removeEventListener("resize", ajustar);
    }

    // Primer fotograma ya, el resto cuando la sección se acerca
    const primera = new Image();
    primera.src = src(0);
    primera.onload = ajustar;
    imgs[0] = primera;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          cargar(1);
          io.disconnect();
        }
      },
      { rootMargin: "150% 0px" }
    );
    io.observe(el);
    window.addEventListener("resize", ajustar);

    const ctx = gsap.context(() => {
      const estado = { f: 0 };
      gsap.to(estado, {
        f: TOTAL - 1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=320%",
          pin: true,
          pinSpacing: true,
          scrub: 0.4,
        },
        onUpdate: () => {
          const i = Math.round(estado.f);
          if (i !== actual) {
            actual = i;
            dibujar(i);
            setPaso(pasoDe(i));
          }
        },
      });
      gsap.to(".arma-progreso", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "+=320%", scrub: true },
      });
    }, el);

    return () => {
      io.disconnect();
      window.removeEventListener("resize", ajustar);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="asi-se-arma"
      ref={raiz}
      className="relative h-[100svh] overflow-hidden bg-black"
      aria-label="Así se arma una salchipapa"
    >
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 to-transparent" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent md:hidden" aria-hidden />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-between px-5 pt-24 pb-10 md:justify-center">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.35em] text-gold uppercase">
            Capítulo 03 · De la cocina a tu mesa
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-white uppercase sm:text-6xl">
            Así se arma
            <span className="block text-gold">una salchipapa</span>
          </h2>
        </div>

        {/* Escritorio: lista de pasos */}
        <ol className="mt-10 hidden max-w-sm flex-col gap-1 md:flex">
          {PASOS.map((p, i) => (
            <li
              key={p.titulo}
              className={cn(
                "flex items-baseline gap-4 border-l-2 py-1.5 pl-4 transition-all duration-500",
                i === paso
                  ? "border-gold text-white"
                  : i < paso
                    ? "border-white/30 text-white/45"
                    : "border-white/10 text-white/25"
              )}
            >
              <span className="w-6 text-xs font-bold tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="block text-base font-bold">{p.titulo}</span>
                <span
                  className={cn(
                    "block overflow-hidden text-sm text-white/75 transition-all duration-500",
                    i === paso ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  {p.texto}
                </span>
              </span>
            </li>
          ))}
        </ol>

        {/* Celular: el paso actual en grande */}
        <div className="md:hidden" aria-live="polite">
          <p className="text-xs font-bold tracking-[0.3em] text-gold tabular-nums">
            {String(paso + 1).padStart(2, "0")} / {String(PASOS.length).padStart(2, "0")}
          </p>
          <p key={paso} className="arma-paso mt-1 text-3xl font-extrabold text-white">
            {PASOS[paso].titulo}
          </p>
          <p className="mt-1 text-sm text-white/75">{PASOS[paso].texto}</p>
        </div>
      </div>

      <span className="absolute inset-x-0 bottom-0 z-10 block h-[3px] bg-white/10" aria-hidden>
        <span className="arma-progreso block h-full origin-left scale-x-0 bg-gold" />
      </span>
    </section>
  );
}
