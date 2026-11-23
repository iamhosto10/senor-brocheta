"use client";

import { useState } from "react";
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

  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2.5">
        <Link
          href="#inicio"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/reservas/brand-logo.png"
            alt="Señor Brocheta"
            width={132}
            height={70}
            className="h-10 w-auto"
            priority
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
