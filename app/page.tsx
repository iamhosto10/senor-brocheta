import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "cn";

const WHATSAPP_URL = "https://wa.me/573171361324";
const MENU_URL = "https://vinny.vinapp.co/?company=srbrocheta";
const INSTAGRAM_URL = "https://www.instagram.com/sr.brocheta/";
const PHONE_DISPLAY = "+57 317 136 1324";
const EMAIL = "contacto@srbrocheta.com";

const favoritos = [
  {
    nombre: "La Salchipapa de Ana",
    descripcion: "Nuestro plato insignia, el que nos hizo conocidos.",
    precio: "$32.000",
  },
  {
    nombre: "Burger Sr.Broche",
    descripcion: "Hamburguesa de la casa, receta propia Sr. Brocheta.",
    precio: "$29.000",
  },
  {
    nombre: "Chuzopan de la Casa",
    descripcion: "Chuzo desgranado en pan, al estilo de la casa.",
    precio: "$30.000",
  },
  {
    nombre: "Picada Sr. Brocheta Para Dos",
    descripcion: "Para compartir: carnes, pollo y acompañantes.",
    precio: "$50.000",
  },
];

const sedes = [
  {
    nombre: "Sede Principal Dangond",
    direccion: "Calle 16 # 19E-85, Valledupar",
    mapsUrl: "https://maps.app.goo.gl/5K2epKUKThCmQAoz7",
  },
  {
    nombre: "Sede Mayales",
    direccion:
      "Av. Salguero # Calle 31, Centro Comercial Mayales Etapa 1 – Local 34, Valledupar",
    mapsUrl: "https://maps.app.goo.gl/ep36jVT1EgLCynveA",
  },
  {
    nombre: "Sede Guatapurí",
    direccion:
      "Diagonal 10 N # 6N - 15, Centro Comercial Guatapurí, Local 2-035, Valledupar",
    mapsUrl: "https://maps.app.goo.gl/AdnFh7SbFChKmpGz9",
  },
];

const heroButton =
  "inline-flex h-11 items-center justify-center rounded-sm px-7 text-xs font-semibold tracking-[0.18em] uppercase transition-colors";

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className={className}
      aria-hidden
    >
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-2h7l1 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

function PhotoPlaceholder({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden border border-dashed border-gold/35 bg-secondary/60",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2 px-4 text-center">
        <CameraIcon className="size-6 text-gold/70 sm:size-7" />
        {label && (
          <span className="text-[0.65rem] font-semibold tracking-[0.15em] text-foreground/40 uppercase sm:text-xs">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col">
      <SiteHeader whatsappUrl={WHATSAPP_URL} instagramUrl={INSTAGRAM_URL} />

      {/* Hero */}
      <section id="inicio" className="scroll-mt-16">
        <PhotoPlaceholder
          label="Fotografía de portada"
          className="h-[70vh] w-full sm:h-[82vh]"
        />
      </section>

      {/* Bienvenida */}
      <section className="bg-background">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-5 py-20 text-center">
          <SectionHeading
            eyebrow="Desde Valledupar"
            title="Bienvenidos a Sr. Brocheta"
            description="Nacimos de una receta de familia y un chuzo que no tardó en hacerse conocido en la ciudad. Hoy somos tres sedes, un equipo que crece a diario y un mismo compromiso: comida urbana premium, servida rápido y sin perder el sabor de casa."
          />
          <Link
            href="/reservas/nueva"
            className={cn(heroButton, "mt-8 bg-primary text-primary-foreground hover:bg-primary/85")}
          >
            Reserva tu mesa
          </Link>
        </div>
      </section>

      <PhotoPlaceholder label="Fotografía del local" className="aspect-[16/7] w-full" />

      {/* Favoritos */}
      <section id="favoritos" className="scroll-mt-16 bg-background">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-5 py-20 text-center">
          <SectionHeading
            eyebrow="Algunos"
            title="Favoritos"
            description="Una probadita de lo que nos hace premium. El menú completo tiene mucho más."
          />
          <div className="mt-10 flex w-full max-w-md flex-col divide-y divide-gold/20">
            {favoritos.map((plato) => (
              <div key={plato.nombre} className="flex items-baseline justify-between gap-4 py-3.5">
                <div className="text-left">
                  <h3 className="font-sans text-base font-bold tracking-wide text-foreground">
                    {plato.nombre}
                  </h3>
                  <p className="mt-0.5 text-sm text-foreground/60">{plato.descripcion}</p>
                </div>
                <span className="shrink-0 font-semibold text-foreground">{plato.precio}</span>
              </div>
            ))}
          </div>
          <Link
            href={MENU_URL}
            target="_blank"
            className={cn(heroButton, "mt-8 bg-primary text-primary-foreground hover:bg-primary/85")}
          >
            Ver el menú completo
          </Link>
        </div>
      </section>

      <PhotoPlaceholder label="Fotografía de un plato" className="aspect-[16/7] w-full" />

      {/* Galería */}
      <section id="galeria" className="scroll-mt-16 bg-background">
        <div className="mx-auto w-full max-w-5xl px-5 py-20">
          <SectionHeading
            eyebrow="Para antojarte"
            title="Galería"
            description="Aquí irán las fotos del local, las zonas y los platos de Sr. Brocheta."
          />
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PhotoPlaceholder key={i} className="aspect-square w-full" />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href={MENU_URL}
              target="_blank"
              className={cn(heroButton, "bg-primary text-primary-foreground hover:bg-primary/85")}
            >
              Ver el menú completo
            </Link>
          </div>
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="scroll-mt-16 bg-background">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-5 py-20 text-center">
          <SectionHeading
            eyebrow="Así somos"
            title="Nosotros"
            description="Un equipo que crece a diario, directo desde nuestras sedes en Valledupar. Síguenos en Instagram para ver el día a día."
          />
          <Link
            href={INSTAGRAM_URL}
            target="_blank"
            className={cn(heroButton, "mt-8 border border-gold/50 text-foreground hover:bg-gold/10")}
          >
            Ver más en Instagram
          </Link>
        </div>
      </section>

      <PhotoPlaceholder label="Fotografía del equipo" className="aspect-[16/7] w-full" />

      {/* Ubicación y horarios */}
      <section id="ubicacion" className="scroll-mt-16 bg-secondary/40">
        <div className="mx-auto w-full max-w-5xl px-5 py-20">
          <SectionHeading eyebrow="Visítanos" title="Ubicación y horarios" />

          <div className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center justify-between gap-3 rounded-sm border border-gold/25 bg-background px-5 py-4">
              <span className="text-sm text-foreground/70">Todos los días</span>
              <span className="h-px flex-1 border-t border-dashed border-gold/40" aria-hidden />
              <span className="text-sm font-semibold text-foreground">5:00 pm – 11:00 pm</span>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-foreground/55">
            Viernes, sábado, domingo y festivos: reservas en línea de 5:00 pm a 7:00 pm.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sedes.map((sede) => (
              <div
                key={sede.nombre}
                className="group relative flex h-full flex-col rounded-sm border border-gold/25 bg-background p-6 transition-colors hover:border-gold"
              >
                <Link
                  href={sede.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver ${sede.nombre} en Google Maps`}
                  className="absolute inset-0 z-0 rounded-[inherit]"
                />
                <h3 className="pointer-events-none relative z-10 font-sans text-lg font-bold tracking-wide text-foreground">
                  {sede.nombre}
                </h3>
                <span className="pointer-events-none relative z-10 mt-2 h-[2px] w-8 bg-primary" aria-hidden />
                <p className="pointer-events-none relative z-10 mt-3 flex-1 text-sm text-foreground/70">
                  {sede.direccion}
                </p>
                <Link
                  href={WHATSAPP_URL}
                  target="_blank"
                  className="relative z-10 mt-4 w-fit text-sm font-semibold text-foreground underline decoration-gold/50 underline-offset-4 hover:text-primary"
                >
                  📲 {PHONE_DISPLAY}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-2 px-5 pt-16 pb-10 text-center">
          <span className="font-sans text-3xl font-bold tracking-wide text-foreground/15 uppercase sm:text-4xl">
            Sr. Brocheta
          </span>
          <span className="text-xs tracking-[0.3em] text-foreground/20 uppercase">
            Comida Urbana Premium
          </span>
        </div>

        <div className="bg-[var(--color-ink)]">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-5 py-12">
            <div className="flex items-center gap-4">
              <Link
                href={WHATSAPP_URL}
                target="_blank"
                aria-label="WhatsApp"
                className="flex size-10 items-center justify-center rounded-full bg-background text-[var(--color-ink)] transition-colors hover:bg-gold hover:text-background"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.74.46 3.43 1.33 4.92L2.05 22l5.3-1.39a9.9 9.9 0 0 0 4.69 1.19h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.44 17.51 2 12.04 2Zm5.81 14.02c-.24.68-1.41 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.89-1.25-4.78-4.15-4.92-4.34-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.59-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.15.12.33.02.52-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.12.57.17.29.75 1.24 1.62 2 1.11.99 2.04 1.3 2.34 1.44.29.14.46.12.63-.07.17-.19.73-.85.92-1.14.19-.29.38-.24.64-.14.26.1 1.68.79 1.97.94.29.14.48.21.55.33.07.12.07.68-.17 1.35Z" />
                </svg>
              </Link>
              <Link
                href={INSTAGRAM_URL}
                target="_blank"
                aria-label="Instagram"
                className="flex size-10 items-center justify-center rounded-full bg-background text-[var(--color-ink)] transition-colors hover:bg-gold hover:text-background"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-4">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
                </svg>
              </Link>
            </div>

            <span className="h-px w-16 bg-background/15" aria-hidden />

            <div className="flex flex-col items-center gap-1.5 text-xs text-background/70">
              {sedes.map((sede) => (
                <p key={sede.nombre}>
                  {sede.nombre} · {sede.direccion}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-background/70">
              <Link href={WHATSAPP_URL} target="_blank" className="hover:text-gold">
                {PHONE_DISPLAY}
              </Link>
              <Link href={`mailto:${EMAIL}`} className="hover:text-gold">
                {EMAIL}
              </Link>
              <Link href={MENU_URL} target="_blank" className="hover:text-gold">
                Menú completo
              </Link>
              <Link href="/reservas/nueva" className="hover:text-gold">
                Reservas
              </Link>
            </div>
          </div>

          <div className="border-t border-background/10 py-4 text-center text-[0.65rem] tracking-[0.2em] text-background/40 uppercase">
            © {new Date().getFullYear()} Sr. Brocheta
          </div>
        </div>
      </footer>
    </div>
  );
}
