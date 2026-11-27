"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";

const CAPITULOS = [
  { href: "#inicio", numero: "00", label: "Inicio" },
  { href: "#favoritos", numero: "01", label: "Los favoritos" },
  { href: "#historia", numero: "02", label: "Nuestra historia" },
  { href: "#asi-se-arma", numero: "03", label: "Así se arma" },
  { href: "#galeria", numero: "04", label: "Galería" },
  { href: "#espacios", numero: "05", label: "Espacios" },
  { href: "#sedes", numero: "06", label: "Sedes y domicilios" },
];

/** Lleva a un capítulo después de cerrar el menú (el scroll estaba detenido). */
function irA(href: string) {
  setTimeout(() => {
    const lenis = (window as { __lenis?: { scrollTo(t: string, o?: object): void } }).__lenis;
    if (lenis) lenis.scrollTo(href);
    else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }, 80);
}

const reservarButton =
  "inline-flex h-9 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/85";

/**
 * Encabezado fijo: logo, menú desplegable de capítulos (escritorio) y menú a
 * pantalla completa (todas las pantallas). Se vuelve sólido al bajar.
 */
export function SiteHeader() {
  const [menu, setMenu] = useState(false);
  const [capitulos, setCapitulos] = useState(false);
  const [solido, setSolido] = useState(false);
  const desplegable = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setSolido(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!capitulos) return;
    const cerrar = (e: MouseEvent) => {
      if (!desplegable.current?.contains(e.target as Node)) setCapitulos(false);
    };
    document.addEventListener("click", cerrar);
    return () => document.removeEventListener("click", cerrar);
  }, [capitulos]);

  // Con el menú abierto se detiene el scroll de la página
  useEffect(() => {
    const lenis = (window as { __lenis?: { stop(): void; start(): void } }).__lenis;
    if (menu) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = menu ? "hidden" : "";
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [menu]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500",
          solido && !menu
            ? "border-b border-gold/15 bg-black/70 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3 sm:px-8">
          <Link href="#inicio" aria-label="Señor Brocheta, ir al inicio" onClick={() => setMenu(false)}>
            <Image
              src="/images/reservas/brand-logo.png"
              alt="Señor Brocheta"
              width={132}
              height={70}
              className="h-10 w-auto"
              loading="eager"
            />
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            <div ref={desplegable} className="relative hidden md:block">
              <button
                type="button"
                aria-expanded={capitulos}
                onClick={() => setCapitulos((v) => !v)}
                className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.25em] text-white/85 uppercase transition-colors hover:text-gold"
              >
                Capítulos
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className={cn("transition-transform", capitulos && "rotate-180")}
                  aria-hidden
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <div
                className={cn(
                  "absolute top-full right-0 mt-4 w-64 origin-top-right border border-gold/25 bg-black/90 p-2 backdrop-blur-md transition-all duration-300",
                  capitulos ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
                )}
              >
                {CAPITULOS.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    tabIndex={capitulos ? undefined : -1}
                    onClick={() => setCapitulos(false)}
                    className="flex items-baseline gap-3 px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-gold"
                  >
                    <span className="text-[10px] font-bold text-gold tabular-nums">{c.numero}</span>
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/reservas/nueva" className={cn(reservarButton, "hidden sm:inline-flex")}>
              Reservar
            </Link>

            <button
              type="button"
              aria-label={menu ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menu}
              onClick={() => setMenu((v) => !v)}
              className="relative flex size-10 flex-col items-center justify-center gap-[7px]"
            >
              <span
                className={cn(
                  "h-[2px] w-7 bg-white transition-transform duration-500",
                  menu && "translate-y-[4.5px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "h-[2px] w-7 bg-white transition-transform duration-500",
                  menu && "-translate-y-[4.5px] -rotate-45"
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Menú a pantalla completa */}
      <div
        className={cn(
          "menu-total fixed inset-0 z-[45] flex flex-col justify-center overflow-y-auto bg-primary px-6 pt-24 pb-10 sm:px-16",
          menu ? "menu-abierto" : "pointer-events-none"
        )}
        aria-hidden={!menu}
      >
        <nav className="flex flex-col gap-1">
          {CAPITULOS.map((c, i) => (
            <Link
              key={c.href}
              href={c.href}
              tabIndex={menu ? undefined : -1}
              onClick={(e) => {
                e.preventDefault();
                setMenu(false);
                irA(c.href);
              }}
              style={{ "--i": i } as React.CSSProperties}
              className="menu-item group flex items-baseline gap-4 text-white"
            >
              <span className="w-8 text-xs font-bold text-black/50 tabular-nums">{c.numero}</span>
              <span className="text-3xl font-extrabold tracking-tight uppercase transition-colors group-hover:text-gold sm:text-6xl">
                {c.label}
              </span>
            </Link>
          ))}
        </nav>
        <Link
          href="/reservas/nueva"
          tabIndex={menu ? undefined : -1}
          onClick={() => setMenu(false)}
          style={{ "--i": CAPITULOS.length } as React.CSSProperties}
          className="menu-item mt-10 inline-flex h-12 w-fit items-center rounded-full bg-black px-8 text-sm font-bold text-white transition-colors hover:bg-black/80"
        >
          Reservar mesa
        </Link>
      </div>
    </>
  );
}
