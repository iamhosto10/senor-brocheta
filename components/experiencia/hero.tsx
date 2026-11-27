"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, alTerminarIntro, prefiereMenosMovimiento } from "./gsap";
import { VideoFondo } from "./video-fondo";
import { Letras } from "./letras";

/**
 * Portada: video de la plancha a pantalla completa, titular gigante que entra
 * letra por letra cuando sale la pantalla de carga, y al hacer scroll el
 * titular se aleja mientras el video se acerca.
 */
export function Hero({ whatsappUrl }: { whatsappUrl: string }) {
  const raiz = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = raiz.current!;
    if (prefiereMenosMovimiento()) {
      el.classList.add("hero-listo");
      return;
    }
    let ctx: gsap.Context | undefined;
    const quitar = alTerminarIntro(() => {
      el.classList.add("hero-listo");
      ctx = gsap.context(() => {
        gsap
          .timeline()
          .from(".hero-video-wrap", { scale: 1.25, filter: "brightness(0.2)", duration: 2.2, ease: "expo.out" }, 0)
          .from(".hero-titulo .letra", { yPercent: 115, rotate: 6, duration: 1.2, stagger: 0.035, ease: "expo.out" }, 0.15)
          .from(".hero-sub", { y: 24, opacity: 0, duration: 1, stagger: 0.12, ease: "expo.out" }, 0.9);

        gsap
          .timeline({
            scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
          })
          .to(".hero-contenido", { yPercent: -35, opacity: 0, ease: "none" }, 0)
          .to(".hero-video-wrap", { scale: 1.15, ease: "none" }, 0)
          .to(".hero-velo", { backgroundColor: "rgba(0,0,0,0.85)", ease: "none" }, 0);
      }, el);
    });
    return () => {
      quitar();
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="inicio"
      ref={raiz}
      className="hero-exp relative flex h-[100svh] min-h-[560px] items-center justify-center overflow-hidden"
    >
      <div className="hero-video-wrap absolute inset-0">
        <VideoFondo nombre="plancha" eager hero className="brightness-[1.35] saturate-[1.15]" />
      </div>
      <div className="hero-velo absolute inset-0 bg-black/20" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.25)_20%,rgba(0,0,0,0.7)_100%)]"
        aria-hidden
      />

      <div className="hero-contenido relative z-10 flex w-full flex-col items-center px-4 text-center">
        <p className="hero-sub mb-4 text-[11px] font-semibold tracking-[0.35em] text-gold uppercase sm:text-xs">
          Salchipapas y hamburguesas · Valledupar
        </p>
        <h1
          aria-label="El mejor sabor se comparte"
          className="hero-titulo font-display leading-[1.02] md:leading-[0.88] text-white drop-shadow-[0_8px_40px_rgba(0,0,0,0.55)]"
        >
          <Letras texto="EL MEJOR SABOR" className="block text-[13vw] md:text-[10.5vw]" />
          <Letras texto="SE COMPARTE" className="block text-[13vw] text-gold md:text-[10.5vw]" />
        </h1>
        <p className="hero-sub mt-6 max-w-xl text-pretty text-base text-white/85 sm:text-lg">
          Ven con tu familia y amigos, nosotros ponemos el sabor.
        </p>
        <div className="hero-sub mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/reservas/nueva"
            className="inline-flex h-12 items-center rounded-full bg-primary px-8 text-sm font-bold text-white transition-colors hover:bg-primary/85"
          >
            Reservar mesa
          </Link>
          <Link
            href={whatsappUrl}
            target="_blank"
            className="inline-flex h-12 items-center rounded-full border-2 border-gold px-8 text-sm font-bold text-white transition-colors hover:bg-gold/10"
          >
            Pedir por WhatsApp
          </Link>
        </div>
      </div>

      <a
        href="#historia"
        className="hero-sub absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 whitespace-nowrap text-[10px] font-semibold tracking-[0.3em] text-white/80 uppercase"
      >
        Desliza para explorar
        <span className="hero-linea relative block h-12 w-px overflow-hidden bg-white/25" aria-hidden />
      </a>
    </section>
  );
}
