"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";

export function SiteHeader({ menuUrl }: { menuUrl: string }) {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#inicio", label: "Inicio" },
    { href: menuUrl, label: "Menú", external: true },
    { href: "/reservas/nueva", label: "Reservas" },
    { href: "#galeria", label: "Galería" },
    { href: "#nosotros", label: "Sobre Nosotros" },
    { href: "#contacto", label: "Contacto" },
  ];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="flex items-center justify-between px-6 py-5 sm:px-10">
          <Link href="#inicio">
            <Image
              src="/images/reservas/brand-logo.png"
              alt="Sr. Brocheta"
              width={220}
              height={116}
              className="h-14 w-auto sm:h-16"
              priority
            />
          </Link>
          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="flex size-10 flex-col items-end justify-center gap-2"
          >
            <span className="h-0.5 w-7 bg-white" />
            <span className="h-0.5 w-5 bg-white" />
          </button>
        </div>
      </header>

      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        aria-hidden={!open}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[78%] max-w-sm flex-col bg-card px-10 py-8 shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
          tabIndex={open ? 0 : -1}
          className="relative ml-auto size-8"
        >
          <span className="absolute top-1/2 left-0 h-0.5 w-8 rotate-45 bg-foreground" />
          <span className="absolute top-1/2 left-0 h-0.5 w-8 -rotate-45 bg-foreground" />
        </button>
        <nav className="mt-12 flex flex-col gap-7">
          {links.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className={cn(
                "text-lg tracking-wide transition-colors hover:text-gold",
                i === 0 ? "text-gold" : "text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
