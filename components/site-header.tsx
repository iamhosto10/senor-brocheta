"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";

const NAV_LINKS = [
  { href: "#favoritos", label: "Favoritos" },
  { href: "#espacios", label: "Espacios" },
  { href: "#sedes", label: "Sedes" },
  { href: "#instagram", label: "Instagram" },
];

const reservarButton =
  "inline-flex h-9 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/85";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  // En la portada el logo ya lo da la foto (el aviso dorado); el del menú
  // aparece solo cuando la portada sale de pantalla, para no repetirlo.
  const [pasoPortada, setPasoPortada] = useState(false);

  useEffect(() => {
    const onScroll = () => setPasoPortada(window.scrollY > window.innerHeight * 0.75);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const solido = pasoPortada || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500",
        solido
          ? "border-gold/20 bg-background/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5">
        <Link
          href="#inicio"
          aria-label="Señor Brocheta, ir al inicio"
          className={cn(
            "flex items-center gap-2.5 transition-all duration-500",
            solido ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
          )}
          tabIndex={solido ? undefined : -1}
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/reservas/brand-logo.png"
            alt="Señor Brocheta"
            width={132}
            height={70}
            className="h-10 w-auto"
            loading="eager"
            fetchPriority="high"
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold tracking-[0.12em] text-foreground/80 uppercase transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href="/reservas/nueva" className={reservarButton}>
            Reservar
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex size-9 flex-col items-center justify-center gap-1.5 rounded-md border border-gold/30 md:hidden"
        >
          <span
            className={cn(
              "h-px w-5 bg-foreground transition-transform",
              open && "translate-y-[3.5px] rotate-45"
            )}
          />
          <span
            className={cn(
              "h-px w-5 bg-foreground transition-transform",
              open && "-translate-y-[3.5px] -rotate-45"
            )}
          />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-gold/20 bg-background px-5 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2.5 text-sm font-semibold tracking-wide text-foreground/85 uppercase transition-colors hover:bg-secondary hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/reservas/nueva"
            onClick={() => setOpen(false)}
            className={cn(reservarButton, "mt-2 h-10 w-full")}
          >
            Reservar
          </Link>
        </nav>
      )}
    </header>
  );
}
