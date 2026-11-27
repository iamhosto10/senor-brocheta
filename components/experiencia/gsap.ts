"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/** true si el visitante pidió reducir el movimiento en su sistema. */
export function prefiereMenosMovimiento() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Evento que dispara la pantalla de carga cuando termina de salir. */
export const EVENTO_INTRO = "sb:intro";

export function introTerminada() {
  return typeof window !== "undefined" && Boolean((window as { __sbIntro?: boolean }).__sbIntro);
}

export function marcarIntroTerminada() {
  (window as { __sbIntro?: boolean }).__sbIntro = true;
  window.dispatchEvent(new Event(EVENTO_INTRO));
}

/** Ejecuta `fn` cuando la intro termina (o de una vez si ya terminó). */
export function alTerminarIntro(fn: () => void) {
  if (introTerminada()) {
    fn();
    return () => {};
  }
  const handler = () => fn();
  window.addEventListener(EVENTO_INTRO, handler, { once: true });
  return () => window.removeEventListener(EVENTO_INTRO, handler);
}
