"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefiereMenosMovimiento } from "./gsap";

/**
 * Scroll suave con inercia (Lenis) sincronizado con ScrollTrigger.
 * Si el visitante pidió reducir el movimiento, se deja el scroll nativo.
 */
export function SmoothScroll() {
  useEffect(() => {
    // Al recargar se empieza arriba (las secciones fijas se recalculan desde cero)
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!location.hash) window.scrollTo(0, 0);

    const refrescar = () => ScrollTrigger.refresh();
    window.addEventListener("load", refrescar);
    document.fonts?.ready.then(refrescar);

    if (prefiereMenosMovimiento()) {
      return () => window.removeEventListener("load", refrescar);
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: true,
    });
    (window as { __lenis?: Lenis }).__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("load", refrescar);
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return null;
}
