"use client";

import { useEffect, useRef } from "react";
import { cn } from "cn";
import { prefiereMenosMovimiento } from "./gsap";

/**
 * Video en bucle, sin sonido, para fondos. Elige la versión vertical en
 * celulares, solo descarga cuando está cerca de la pantalla y se pausa al
 * salir. Con "reducir movimiento" se queda en la imagen de portada.
 *
 * Archivos esperados en /public/media/video/:
 *   {nombre}.mp4, {nombre}.jpg, {nombre}-movil.mp4, {nombre}-movil.jpg
 */
export function VideoFondo({
  nombre,
  className,
  eager = false,
  hero = false,
}: {
  nombre: string;
  className?: string;
  eager?: boolean;
  hero?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const movil = window.matchMedia("(max-width: 767px), (orientation: portrait)").matches;
    const base = `/media/video/${nombre}${movil ? "-movil" : ""}`;
    video.poster = `${base}.jpg`;
    if (prefiereMenosMovimiento()) return;

    let cargado = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!cargado) {
            video.src = `${base}.mp4`;
            cargado = true;
          }
          video.play().catch(() => {});
        } else if (cargado) {
          video.pause();
        }
      },
      { rootMargin: eager ? "100% 0px" : "50% 0px" }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [nombre, eager]);

  return (
    <video
      ref={ref}
      className={cn("h-full w-full object-cover", className)}
      poster={`/media/video/${nombre}.jpg`}
      muted
      loop
      playsInline
      preload={eager ? "auto" : "none"}
      aria-hidden
      tabIndex={-1}
      data-hero-video={hero ? "" : undefined}
    />
  );
}
