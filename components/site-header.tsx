"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";

const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#favoritos", label: "Menú" },
  { href: "#galeria", label: "Galería" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#ubicacion", label: "Ubicación y horarios" },
  { href: "/reservas/nueva", label: "Reservas" },
];

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.74.46 3.43 1.33 4.92L2.05 22l5.3-1.39a9.9 9.9 0 0 0 4.69 1.19h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.44 17.51 2 12.04 2Zm5.81 14.02c-.24.68-1.41 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.89-1.25-4.78-4.15-4.92-4.34-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.59-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.15.12.33.02.52-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.12.57.17.29.75 1.24 1.62 2 1.11.99 2.04 1.3 2.34 1.44.29.14.46.12.63-.07.17-.19.73-.85.92-1.14.19-.29.38-.24.64-.14.26.1 1.68.79 1.97.94.29.14.48.21.55.33.07.12.07.68-.17 1.35Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-4">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SiteHeader({ whatsappUrl, instagramUrl }: { whatsappUrl: string; instagramUrl: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[var(--color-ink)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="#inicio" className="flex items-center" onClick={() => setOpen(false)}>
            <Image
              src="/images/reservas/brand-logo.png"
              alt="Sr. Brocheta"
              width={220}
              height={116}
              className="h-12 w-auto sm:h-14"
              priority
            />
          </Link>

          <button
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-10 flex-col items-center justify-center gap-1.5 rounded-sm border border-gold/40 text-gold"
          >
            <span
              className={cn(
                "h-px w-5 bg-gold transition-transform",
                open && "translate-y-[3.5px] rotate-45"
              )}
            />
            <span
              className={cn(
                "h-px w-5 bg-gold transition-transform",
                open && "-translate-y-[3.5px] -rotate-45"
              )}
            />
          </button>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col overflow-y-auto bg-background transition-opacity duration-300",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <nav className="flex flex-1 flex-col items-center justify-center gap-6 px-5 py-28 text-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-sans text-xl font-bold tracking-wide text-foreground uppercase transition-colors hover:text-gold sm:text-2xl"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col items-center gap-6 border-t border-gold/20 px-5 pb-12 pt-8">
          <div className="flex items-center gap-4">
            <Link
              href={whatsappUrl}
              target="_blank"
              aria-label="WhatsApp"
              onClick={() => setOpen(false)}
              className="flex size-10 items-center justify-center rounded-full bg-[var(--color-ink)] text-background transition-colors hover:bg-gold"
            >
              <WhatsAppIcon />
            </Link>
            <Link
              href={instagramUrl}
              target="_blank"
              aria-label="Instagram"
              onClick={() => setOpen(false)}
              className="flex size-10 items-center justify-center rounded-full bg-[var(--color-ink)] text-background transition-colors hover:bg-gold"
            >
              <InstagramIcon />
            </Link>
          </div>
          <span className="text-xs tracking-[0.2em] text-foreground/50 uppercase">
            Sr. Brocheta · Valledupar
          </span>
        </div>
      </div>
    </>
  );
}
