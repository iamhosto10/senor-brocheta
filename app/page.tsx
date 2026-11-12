import Image from "next/image";
import Link from "next/link";
import {
  InstagramIcon,
  MailIcon,
  SiteHeader,
  WhatsAppIcon,
  socialButton,
} from "@/components/site-header";
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
    descripcion: "Hamburguesa de la casa, receta propia.",
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

const horarios = [
  { dias: "Todos los días", horas: "5:00 p.m - 11:00 p.m" },
  {
    dias: "Reservas en línea (viernes a domingo y festivos)",
    horas: "5:00 p.m - 7:00 p.m",
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

const zonas = [
  { src: "/images/reservas/zona2.jpg", alt: "Zona amplia del restaurante" },
  { src: "/images/reservas/zona3.jpg", alt: "Entrada del local Sr. Brocheta" },
  { src: "/images/reservas/zona4.jpg", alt: "Mural y aviso de Sr. Brocheta en el local" },
  { src: "/images/reservas/zona5.jpg", alt: "Aviso dorado de Sr. Brocheta" },
  { src: "/images/reservas/decoraciones/medio-arco.jpg", alt: "Decoración de celebración en Sr. Brocheta" },
  { src: "/images/reservas/decoraciones/buquet.jpg", alt: "Mesa decorada para celebración en Sr. Brocheta" },
];

const platos = [
  { src: "/images/platos/burger-sr-broche.jpg", alt: "Burger Sr.Broche" },
  { src: "/images/platos/chuzopan.jpg", alt: "Chuzopán a la parrilla" },
  { src: "/images/platos/triple-carne.jpeg", alt: "Hamburguesa triple carne" },
  { src: "/images/platos/chicken-criss.jpg", alt: "Burger Chicken Criss" },
  { src: "/images/platos/mazorca-desgranada.jpg", alt: "Mazorca desgranada Sr.Brocheta" },
  { src: "/images/platos/combo-bacon.jpeg", alt: "Combo hamburguesa bacon y bebida" },
];

const buttonBase =
  "inline-flex h-12 items-center justify-center px-8 text-sm font-bold tracking-[0.12em] uppercase transition-colors";
const buttonSolid = cn(buttonBase, "bg-primary text-primary-foreground hover:bg-primary/85");
const buttonOutline = cn(
  buttonBase,
  "border border-foreground/60 text-foreground hover:border-gold hover:text-gold"
);

const script = "font-script text-2xl text-gold";
const title = "font-serif text-4xl font-semibold text-foreground sm:text-5xl";
const body = "leading-relaxed text-foreground/80";

function GoldRule({ className }: { className?: string }) {
  return <span className={cn("mt-5 block h-px w-24 bg-gold", className)} aria-hidden />;
}

function PhotoGrid({ images }: { images: { src: string; alt: string }[] }) {
  return (
    <div className="grid grid-cols-3">
      {images.map((img) => (
        <div key={img.src} className="group relative aspect-square overflow-hidden">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(min-width: 1024px) 340px, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col">
      <SiteHeader
        menuUrl={MENU_URL}
        whatsappUrl={WHATSAPP_URL}
        instagramUrl={INSTAGRAM_URL}
        email={EMAIL}
      />

      {/* Hero */}
      <section id="inicio" className="relative flex h-[92vh] min-h-[540px] items-end justify-center">
        <Image
          src="/images/reservas/zona1.jpg"
          alt="Salón principal de Sr. Brocheta"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background" />
        <div className="relative flex flex-col items-center px-6 pb-20 text-center">
          <p className={cn(script, "text-3xl")}>El sabor que nos une</p>
          <h1 className="mt-2 font-serif text-5xl leading-none font-semibold text-white sm:text-7xl">
            Comida urbana premium
          </h1>
          <p className="mt-5 text-xs font-bold tracking-[0.3em] text-white/80 uppercase">
            Valledupar · Hamburguesas · Salchipapas · Combos
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/reservas/nueva" className={buttonSolid}>
              Reservar mesa
            </Link>
            <Link href={MENU_URL} target="_blank" className={buttonOutline}>
              Ver el menú
            </Link>
          </div>
        </div>
      </section>

      {/* Historia */}
      <section id="nosotros" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className={script}>Nuestra historia</p>
          <h2 className={title}>De una receta de familia a tres sedes</h2>
          <GoldRule />
          <p className={cn(body, "mt-8 font-serif text-2xl")}>
            Todo empezó con una receta de familia y un chuzo que no tardó en
            hacerse conocido en Valledupar. Hoy somos tres sedes y un equipo
            que crece a diario, con el mismo compromiso del primer día: comida
            urbana premium, servida rápido y sin perder el sabor de casa.
          </p>
          <svg viewBox="0 0 48 36" fill="currentColor" aria-hidden className="mt-8 h-7 text-gold">
            <path d="M0 36V22C0 9 6 2 19 0v7c-6 2-9 6-9 11h9v18H0Zm27 0V22C27 9 33 2 46 0v7c-6 2-9 6-9 11h9v18H27Z" />
          </svg>
        </div>
      </section>

      {/* Recomendados */}
      <section id="recomendados" className="scroll-mt-24 bg-card px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div className="relative pr-[12%] pb-[20%]">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src="/images/platos/salchipapa.jpg"
                alt="La Salchipapa de Ana"
                fill
                sizes="(min-width: 1024px) 480px, 80vw"
                className="object-cover"
              />
            </div>
            <div className="absolute right-0 bottom-0 aspect-[5/6] w-[46%] overflow-hidden border-8 border-card">
              <Image
                src="/images/platos/picada-para-dos.jpg"
                alt="Picada Sr. Brocheta Para Dos"
                fill
                sizes="(min-width: 1024px) 260px, 46vw"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <p className={script}>Nuestros</p>
            <h2 className={title}>Recomendados</h2>
            <GoldRule />
            <p className={cn(body, "mt-6")}>
              Los que más piden y los que más repiten. Si es tu primera vez,
              empieza por aquí.
            </p>
            <ul className="mt-8 flex flex-col gap-6">
              {favoritos.map((plato) => (
                <li key={plato.nombre}>
                  <div className="flex items-baseline gap-4 font-serif text-2xl">
                    <span className="text-foreground">{plato.nombre}</span>
                    <span className="min-w-6 flex-1 border-b border-dotted border-foreground/30" aria-hidden />
                    <span className="shrink-0 text-gold">{plato.precio}</span>
                  </div>
                  <p className="mt-1 text-sm text-foreground/60">{plato.descripcion}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={WHATSAPP_URL} target="_blank" className={buttonSolid}>
                Hacer pedido
              </Link>
              <Link href={MENU_URL} target="_blank" className={buttonOutline}>
                Menú completo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Banda de foto */}
      <div className="relative h-[55vh] min-h-[320px]">
        <Image
          src="/images/platos/burger-sr-broche.jpg"
          alt="Burger Sr.Broche"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Celebra */}
      <section id="celebra" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <p className={script}>Tu mesa te espera</p>
            <h2 className={title}>Celebra con nosotros</h2>
            <GoldRule />
            <p className={cn(body, "mt-6")}>
              Cumpleaños, aniversarios o una cena con los tuyos. Elige tu zona,
              reserva en línea y, si quieres, decoramos la mesa para la
              ocasión.
            </p>
          </div>
          <div className="mt-12">
            <PhotoGrid images={zonas} />
          </div>
          <div className="mt-10 text-center">
            <Link href="/reservas/nueva" className={buttonSolid}>
              Reservar mesa
            </Link>
          </div>
        </div>
      </section>

      {/* Horarios y sedes */}
      <section id="ubicacion" className="scroll-mt-24 bg-card px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <p className={script}>Visítanos</p>
            <h2 className={title}>Horarios y sedes</h2>
            <GoldRule />
          </div>
          <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-4">
            {horarios.map((h) => (
              <div key={h.dias} className="flex items-baseline gap-4">
                <span className="text-foreground/70">{h.dias}</span>
                <span className="min-w-6 flex-1 border-b border-dotted border-foreground/30" aria-hidden />
                <span className="shrink-0 font-semibold text-gold">{h.horas}</span>
              </div>
            ))}
          </div>
          <div className="mt-14 grid gap-px bg-gold/25 sm:grid-cols-3">
            {sedes.map((sede) => (
              <div key={sede.nombre} className="flex flex-col items-center bg-card px-6 py-8 text-center">
                <h3 className="text-xs font-bold tracking-[0.16em] text-gold uppercase">
                  {sede.nombre}
                </h3>
                <p className="mt-3 flex-1 font-serif text-xl leading-snug text-foreground/85">
                  {sede.direccion}
                </p>
                <Link
                  href={sede.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-sm font-semibold text-foreground underline decoration-gold underline-offset-4 hover:text-gold"
                >
                  Cómo llegar
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-foreground/80">
            ¿Antojo en casa? Pide por WhatsApp al{" "}
            <Link
              href={WHATSAPP_URL}
              target="_blank"
              className="font-semibold text-foreground underline decoration-gold underline-offset-4 hover:text-gold"
            >
              {PHONE_DISPLAY}
            </Link>
          </p>
        </div>
      </section>

      {/* Galería */}
      <section id="galeria" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center text-center">
            <p className={script}>Para antojarte</p>
            <h2 className={title}>Galería</h2>
            <GoldRule />
          </div>
          <div className="mt-12">
            <PhotoGrid images={platos} />
          </div>
          <div className="mt-10 text-center">
            <Link href={INSTAGRAM_URL} target="_blank" className={buttonOutline}>
              Ver más en Instagram
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="flex flex-col items-center px-6 pb-12">
          <Image
            src="/images/reservas/brand-logo.png"
            alt="Sr. Brocheta"
            width={465}
            height={246}
            className="h-32 w-auto sm:h-36"
          />
          <p className={cn(script, "mt-4")}>Gracias por elegirnos</p>
        </div>
        <div className="bg-secondary px-6 py-10">
          <div className="flex items-center justify-center gap-3">
            <Link href={WHATSAPP_URL} target="_blank" aria-label="WhatsApp" className={socialButton}>
              <WhatsAppIcon />
            </Link>
            <Link href={INSTAGRAM_URL} target="_blank" aria-label="Instagram" className={socialButton}>
              <InstagramIcon />
            </Link>
            <Link href={`mailto:${EMAIL}`} aria-label="Correo" className={socialButton}>
              <MailIcon />
            </Link>
          </div>
          <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-bold tracking-[0.14em] text-foreground uppercase">
            <Link href={MENU_URL} target="_blank" className="hover:text-gold">
              Menú
            </Link>
            <Link href="/reservas/nueva" className="hover:text-gold">
              Reservas
            </Link>
            <Link href="#ubicacion" className="hover:text-gold">
              Sedes
            </Link>
            <Link href={`mailto:${EMAIL}`} className="hover:text-gold">
              {EMAIL}
            </Link>
          </nav>
        </div>
        <div className="bg-black py-3 text-center text-xs tracking-wide text-foreground/60">
          © {new Date().getFullYear()} Sr. Brocheta · Comida Urbana Premium · Valledupar
        </div>
      </footer>
    </div>
  );
}
