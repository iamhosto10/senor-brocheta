"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";

export function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.74.46 3.43 1.33 4.92L2.05 22l5.3-1.39a9.9 9.9 0 0 0 4.69 1.19h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.44 17.51 2 12.04 2Zm5.81 14.02c-.24.68-1.41 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.89-1.25-4.78-4.15-4.92-4.34-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.59-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.15.12.33.02.52-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.12.57.17.29.75 1.24 1.62 2 1.11.99 2.04 1.3 2.34 1.44.29.14.46.12.63-.07.17-.19.73-.85.92-1.14.19-.29.38-.24.64-.14.26.1 1.68.79 1.97.94.29.14.48.21.55.33.07.12.07.68-.17 1.35Z" />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M3 5h18a1 1 0 0 1 1 1v.4l-10 6.2L2 6.4V6a1 1 0 0 1 1-1Zm-1 3.7V18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V8.7l-10 6.2-10-6.2Z" />
    </svg>
  );
}

export const socialButton =
  "flex size-9 items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-gold";

export function SiteHeader({
  menuUrl,
  whatsappUrl,
  instagramUrl,
  email,
}: {
  menuUrl: string;
  whatsappUrl: string;
  instagramUrl: string;
  email: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { href: "#ubicacion", label: "Horarios y ubicación" },
    { href: menuUrl, label: "Menú", external: true },
    { href: "#nosotros", label: "Nosotros" },
    { href: "#instagram", label: "Galería" },
    { href: whatsappUrl, label: "Contacto", external: true },
    { href: "/reservas/nueva", label: "Reservas" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          scrolled || open ? "bg-background" : "bg-gradient-to-b from-black/70 to-transparent"
        )}
      >
        <div className="flex items-center justify-between px-5 py-3 sm:px-8">
          <Link href="#inicio" onClick={() => setOpen(false)}>
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
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "relative flex size-12 flex-col items-center justify-center gap-[7px] rounded-[3px] border-2 transition-colors",
              open ? "border-gold" : "border-transparent"
            )}
          >
            <span
              className={cn(
                "h-0.5 w-8 transition-transform",
                open ? "translate-y-[4.5px] rotate-45 bg-gold" : "bg-white"
              )}
            />
            <span
              className={cn(
                "h-0.5 w-8 transition-transform",
                open ? "-translate-y-[4.5px] -rotate-45 bg-gold" : "bg-white"
              )}
            />
          </button>
        </div>
      </header>

      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-40 flex flex-col overflow-y-auto bg-background transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <nav className="flex flex-1 flex-col items-center justify-center gap-7 px-5 pt-28 pb-10 text-center">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="text-xl font-bold tracking-[0.08em] text-foreground uppercase transition-colors hover:text-gold sm:text-2xl"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mx-5 border-t border-gold/60" />
        <div className="flex items-center justify-center gap-3 py-9">
          <Link href={whatsappUrl} target="_blank" aria-label="WhatsApp" tabIndex={open ? 0 : -1} className={socialButton}>
            <WhatsAppIcon />
          </Link>
          <Link href={instagramUrl} target="_blank" aria-label="Instagram" tabIndex={open ? 0 : -1} className={socialButton}>
            <InstagramIcon />
          </Link>
          <Link href={`mailto:${email}`} aria-label="Correo" tabIndex={open ? 0 : -1} className={socialButton}>
            <MailIcon />
          </Link>
        </div>
      </div>
    </>
  );
}
