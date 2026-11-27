"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, marcarIntroTerminada, prefiereMenosMovimiento } from "./gsap";

const CLAVE = "sb-intro-vista";

/**
 * Pantalla de carga roja con el logo y una barra de progreso (solo en la
 * primera visita de la sesión). Al salir barre hacia arriba en diagonal y
 * avisa a la portada para que empiece su animación.
 *
 * El script en línea oculta la pantalla antes de pintar si ya se vio en
 * esta sesión, para que no parpadee. Si el JS falla, el CSS la quita sola.
 */
export function Preloader() {
  const raiz = useRef<HTMLDivElement>(null);
  const barra = useRef<HTMLSpanElement>(null);
  const [fuera, setFuera] = useState(false);

  useEffect(() => {
    let visto = false;
    try {
      visto = sessionStorage.getItem(CLAVE) === "1";
    } catch {}

    if (visto || prefiereMenosMovimiento()) {
      document.documentElement.classList.add("sin-preloader");
      marcarIntroTerminada();
      return;
    }

    const el = raiz.current!;
    const ctx = gsap.context(() => {
      const listo = new Promise<void>((resolve) => {
        const hero = document.querySelector<HTMLVideoElement>("[data-hero-video]");
        const fin = () => resolve();
        if (!hero || hero.readyState >= 3) return fin();
        hero.addEventListener("canplay", fin, { once: true });
        setTimeout(fin, 2600);
      });

      const tl = gsap.timeline();
      tl.from(".pl-logo", { yPercent: 30, opacity: 0, duration: 0.8, ease: "expo.out" })
        .fromTo(barra.current, { scaleX: 0 }, { scaleX: 0.75, duration: 1.1, ease: "power2.inOut" }, 0.1);

      Promise.all([listo, new Promise((r) => setTimeout(r, 1300))]).then(() => {
        gsap
          .timeline({
            onComplete: () => {
              try {
                sessionStorage.setItem(CLAVE, "1");
              } catch {}
              setFuera(true);
            },
          })
          .to(barra.current, { scaleX: 1, duration: 0.35, ease: "power2.out" })
          .to(".pl-logo, .pl-barra", { yPercent: -60, opacity: 0, duration: 0.5, ease: "power3.in" })
          .call(marcarIntroTerminada, [], "-=0.05")
          .to(el, { clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)", duration: 0.9, ease: "expo.inOut" }, "-=0.15");
      });
    }, el);
    return () => ctx.revert();
  }, []);

  if (fuera) return null;

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem("${CLAVE}")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("sin-preloader")}catch(e){}`,
        }}
      />
      <div
        ref={raiz}
        className="preloader fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-primary"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
        aria-hidden
      >
        <Image
          src="/images/reservas/brand-logo.png"
          alt=""
          width={264}
          height={140}
          className="pl-logo h-24 w-auto drop-shadow-[0_6px_24px_rgba(0,0,0,0.35)] sm:h-28"
          loading="eager"
        />
        <span className="pl-barra block h-[3px] w-40 overflow-hidden rounded-full bg-black/25">
          <span ref={barra} className="block h-full w-full origin-left bg-gold" />
        </span>
      </div>
    </>
  );
}
