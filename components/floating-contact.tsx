import Link from "next/link";

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.74.46 3.43 1.33 4.92L2.05 22l5.3-1.39a9.9 9.9 0 0 0 4.69 1.19h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.44 17.51 2 12.04 2Zm5.81 14.02c-.24.68-1.41 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.89-1.25-4.78-4.15-4.92-4.34-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.59-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.15.12.33.02.52-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.12.57.17.29.75 1.24 1.62 2 1.11.99 2.04 1.3 2.34 1.44.29.14.46.12.63-.07.17-.19.73-.85.92-1.14.19-.29.38-.24.64-.14.26.1 1.68.79 1.97.94.29.14.48.21.55.33.07.12.07.68-.17 1.35Z" />
    </svg>
  );
}

const botonFlotante =
  "flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-black/50 ring-2 ring-gold/70 transition-transform hover:scale-110 hover:bg-primary/90";

export function FloatingContact({
  whatsappUrl,
  instagramUrl,
}: {
  whatsappUrl: string;
  instagramUrl: string;
}) {
  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col gap-3 sm:right-6 sm:bottom-6">
      <Link
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Síguenos en Instagram"
        className={botonFlotante}
      >
        <InstagramIcon className="size-6" />
      </Link>
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        className={botonFlotante}
      >
        <WhatsAppIcon className="size-7" />
      </Link>
    </div>
  );
}
