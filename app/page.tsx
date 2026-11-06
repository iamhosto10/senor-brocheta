import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
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

const galeria = [
  {
    src: "/images/reservas/zona1.jpg",
    alt: "Salón principal de Sr. Brocheta",
  },
  {
    src: "/images/equipo-celebracion.jpg",
    alt: "Equipo de Sr. Brocheta celebrando en el local",
  },
  {
    src: "/images/reservas/zona4.jpg",
    alt: "Mural y aviso de Sr. Brocheta en el local",
  },
  {
    src: "/images/equipo-cocina.jpg",
    alt: "Equipo de cocina de Sr. Brocheta preparando los pedidos",
  },
  {
    src: "/images/reservas/zona2.jpg",
    alt: "Zona amplia del restaurante",
  },
  {
    src: "/images/bolsa-marca.jpg",
    alt: "Pedido empacado con el logo de Sr. Brocheta",
  },
];

const heroButton =
  "inline-flex h-11 items-center justify-center rounded-sm px-7 text-xs font-semibold tracking-[0.18em] uppercase transition-colors";

export default function Home() {
  return (
    <div className="flex flex-col">
      <SiteHeader whatsappUrl={WHATSAPP_URL} />

      {/* Hero */}
      <section id="inicio" className="relative flex min-h-[92vh] scroll-mt-16 items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/reservas/zona1.jpg"
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/75 to-background" />
        </div>
        <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-5 px-5 py-28 text-center">
          <Image
            src="/images/reservas/brand-logo.png"
            alt="Sr. Brocheta"
            width={320}
            height={170}
            priority
            className="h-28 w-auto sm:h-36"
          />
          <span className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">
            Valledupar · Comida urbana premium
          </span>
          <h1 className="font-display text-4xl leading-tight tracking-wide text-foreground uppercase sm:text-5xl">
            El sabor que nos une
          </h1>
          <span className="h-[3px] w-16 rounded-full bg-primary" aria-hidden />
          <p className="max-w-xl text-pretty text-foreground/80">
            Resolvemos tu antojo al instante. Hamburguesas, salchipapas y
            combos de autor, hechos para compartir en Valledupar.
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/reservas/nueva"
              className={cn(heroButton, "bg-primary text-primary-foreground hover:bg-primary/85")}
            >
              Reservar mesa
            </Link>
            <Link
              href={WHATSAPP_URL}
              target="_blank"
              className={cn(
                heroButton,
                "border border-gold/50 text-foreground hover:bg-gold/10"
              )}
            >
              Pedir por WhatsApp
            </Link>
          </div>
        </div>
      </section>

      {/* Bienvenida */}
      <section className="border-y border-gold/15 bg-secondary/20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-2">
          <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-md ring-1 ring-gold/20 md:order-1">
            <Image
              src="/images/reservas/zona4.jpg"
              alt="Aviso de Sr. Brocheta en el local"
              fill
              className="object-cover"
            />
          </div>
          <div className="order-1 flex flex-col items-start text-left md:order-2">
            <span className="text-xs font-semibold tracking-[0.25em] text-gold uppercase">
              Desde Valledupar
            </span>
            <h2 className="mt-2 font-display text-3xl tracking-wide text-foreground uppercase sm:text-4xl">
              Bienvenidos a Sr. Brocheta
            </h2>
            <span className="mt-3 h-[3px] w-14 rounded-full bg-primary" aria-hidden />
            <p className="mt-5 text-pretty text-foreground/80">
              Nacimos de una receta de familia y un chuzo que no tardó en
              hacerse conocido en la ciudad. Hoy somos tres sedes, un equipo
              que crece a diario y un mismo compromiso: comida urbana
              premium, servida rápido y sin perder el sabor de casa.
            </p>
            <Link
              href={MENU_URL}
              target="_blank"
              className={cn(
                heroButton,
                "mt-6 bg-primary text-primary-foreground hover:bg-primary/85"
              )}
            >
              Ver el menú completo
            </Link>
          </div>
        </div>
      </section>

      {/* Favoritos */}
      <section id="favoritos" className="scroll-mt-16">
        <div className="mx-auto w-full max-w-4xl px-5 py-20">
          <SectionHeading
            eyebrow="Algunos"
            title="Favoritos"
            description="Una probadita de lo que nos hace premium. El menú completo tiene mucho más."
          />
          <div className="mt-12 grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {favoritos.map((plato) => (
              <div key={plato.nombre} className="border-b border-gold/20 pb-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-lg tracking-wide text-foreground">
                    {plato.nombre}
                  </h3>
                  <span className="shrink-0 font-semibold text-primary">
                    {plato.precio}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-foreground/70">
                  {plato.descripcion}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/reservas/nueva"
              className={cn(heroButton, "bg-primary text-primary-foreground hover:bg-primary/85")}
            >
              Reserva tu mesa
            </Link>
          </div>
        </div>
      </section>

      {/* Nosotros / Galería */}
      <section id="nosotros" className="scroll-mt-16 border-y border-gold/15 bg-secondary/20">
        <div className="mx-auto w-full max-w-6xl px-5 py-20">
          <SectionHeading
            eyebrow="Así somos"
            title="Nosotros"
            description="Un equipo que crece a diario, directo desde nuestras sedes en Valledupar. Toca cualquier foto para seguirnos en Instagram."
          />
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {galeria.map((img) => (
              <Link
                key={img.src}
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver en Instagram"
                className="group relative aspect-square overflow-hidden rounded-md ring-1 ring-gold/20"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-background/0 opacity-0 transition-all duration-300 group-hover:bg-background/50 group-hover:opacity-100">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="size-7 text-white"
                    aria-hidden
                  >
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              className={cn(
                heroButton,
                "border border-gold/50 text-foreground hover:bg-gold/10"
              )}
            >
              Ver más en Instagram
            </Link>
          </div>
        </div>
      </section>

      {/* Ubicación y horarios */}
      <section id="ubicacion" className="scroll-mt-16">
        <div className="mx-auto w-full max-w-6xl px-5 py-20">
          <SectionHeading eyebrow="Visítanos" title="Ubicación y horarios" />

          <div className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center justify-between gap-3 rounded-md border border-gold/25 px-5 py-4">
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
                className="group relative flex h-full flex-col rounded-md border border-gold/20 p-6 transition-colors hover:border-gold/50"
              >
                <Link
                  href={sede.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver ${sede.nombre} en Google Maps`}
                  className="absolute inset-0 z-0 rounded-[inherit]"
                />
                <h3 className="pointer-events-none relative z-10 font-display text-lg tracking-wide text-foreground">
                  {sede.nombre}
                </h3>
                <span className="pointer-events-none relative z-10 mt-2 h-[2px] w-8 bg-primary" aria-hidden />
                <p className="pointer-events-none relative z-10 mt-3 flex-1 text-sm text-foreground/70">
                  {sede.direccion}
                </p>
                <Link
                  href={WHATSAPP_URL}
                  target="_blank"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "relative z-10 mt-4 w-fit"
                  )}
                >
                  📲 {PHONE_DISPLAY}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gold/20 bg-secondary/20">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-5 px-5 py-14 text-center">
          <Image
            src="/images/reservas/brand-logo.png"
            alt="Sr. Brocheta"
            width={200}
            height={106}
            className="h-16 w-auto"
          />
          <p className="text-xs tracking-[0.2em] text-foreground/60 uppercase">
            Comida Urbana Premium · Valledupar
          </p>

          <div className="flex items-center gap-4">
            <Link
              href={WHATSAPP_URL}
              target="_blank"
              aria-label="WhatsApp"
              className="flex size-9 items-center justify-center rounded-full border border-gold/30 text-foreground/80 transition-colors hover:border-primary hover:text-primary"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.74.46 3.43 1.33 4.92L2.05 22l5.3-1.39a9.9 9.9 0 0 0 4.69 1.19h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.44 17.51 2 12.04 2Zm5.81 14.02c-.24.68-1.41 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.89-1.25-4.78-4.15-4.92-4.34-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.59-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.15.12.33.02.52-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.12.57.17.29.75 1.24 1.62 2 1.11.99 2.04 1.3 2.34 1.44.29.14.46.12.63-.07.17-.19.73-.85.92-1.14.19-.29.38-.24.64-.14.26.1 1.68.79 1.97.94.29.14.48.21.55.33.07.12.07.68-.17 1.35Z" />
              </svg>
            </Link>
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              aria-label="Instagram"
              className="flex size-9 items-center justify-center rounded-full border border-gold/30 text-foreground/80 transition-colors hover:border-primary hover:text-primary"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-4">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
              </svg>
            </Link>
          </div>

          <span className="h-px w-16 bg-gold/25" aria-hidden />

          <div className="flex flex-col items-center gap-1.5 text-xs text-foreground/60">
            {sedes.map((sede) => (
              <p key={sede.nombre}>
                {sede.nombre} · {sede.direccion}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-foreground/60">
            <Link href={WHATSAPP_URL} target="_blank" className="hover:text-primary">
              {PHONE_DISPLAY}
            </Link>
            <Link href={`mailto:${EMAIL}`} className="hover:text-primary">
              {EMAIL}
            </Link>
            <Link href={MENU_URL} target="_blank" className="hover:text-primary">
              Menú completo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
