import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { cn } from "cn";

const WHATSAPP_URL = "https://wa.me/573171361324";
const MENU_URL = "https://vinny.vinapp.co/?company=srbrocheta";
const INSTAGRAM_URL = "https://www.instagram.com/sr.brocheta/";
const PHONE_DISPLAY = "+57 317 136 1324";
const EMAIL = "contacto@srbrocheta.com";

const favoritos = [
  { nombre: "La Salchipapa de Ana", precio: "$32.000" },
  { nombre: "Burger Sr.Broche", precio: "$29.000" },
  { nombre: "Chuzopan de la Casa", precio: "$30.000" },
  { nombre: "Picada Sr. Brocheta Para Dos", precio: "$50.000" },
];

const horarios = [
  { dias: "Todos los días:", horas: "5:00 p.m - 11:00 p.m" },
  {
    dias: "Viernes, sábado, domingo y festivos:",
    horas: "Reservas en línea de 5:00 p.m a 7:00 p.m",
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

const button =
  "inline-flex h-11 items-center justify-center rounded-[3px] bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85";

const sectionTitle = "text-center font-serif text-3xl font-semibold text-foreground sm:text-4xl";

function PhotoGrid({ images }: { images: { src: string; alt: string }[] }) {
  return (
    <div className="mx-auto grid max-w-3xl grid-cols-3">
      {images.map((img) => (
        <div key={img.src} className="relative aspect-square overflow-hidden">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(min-width: 768px) 256px, 33vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col">
      <SiteHeader menuUrl={MENU_URL} />

      {/* Hero */}
      <section id="inicio" className="relative flex h-[88vh] min-h-[480px] items-center justify-center">
        <Image
          src="/images/reservas/zona1.jpg"
          alt="Salón principal de Sr. Brocheta"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/40" />
        <Link href={MENU_URL} target="_blank" className={cn(button, "relative")}>
          Menú
        </Link>
      </section>

      {/* Filosofía */}
      <section id="nosotros" className="scroll-mt-8 px-6 pt-20 pb-14">
        <h2 className={sectionTitle}>Nuestra Historia</h2>
        <p className="mx-auto mt-10 max-w-3xl text-center leading-relaxed text-foreground/85">
          Nacimos de una receta de familia y un chuzo que no tardó en hacerse
          conocido en la ciudad. Hoy somos tres sedes, un equipo que crece a
          diario y un mismo compromiso: comida urbana premium, servida rápido y
          sin perder el sabor de casa. ¡El sabor que nos une!
        </p>
        <svg viewBox="0 0 48 36" fill="currentColor" aria-hidden className="mx-auto mt-4 h-8 text-gold">
          <path d="M0 36V22C0 9 6 2 19 0v7c-6 2-9 6-9 11h9v18H0Zm27 0V22C27 9 33 2 46 0v7c-6 2-9 6-9 11h9v18H27Z" />
        </svg>
      </section>

      {/* Collage */}
      <section className="px-6 pb-20">
        <div className="relative mx-auto max-w-3xl pr-[10%] pb-[22%]">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src="/images/platos/salchipapa.jpg"
              alt="La Salchipapa de Ana"
              fill
              sizes="(min-width: 768px) 690px, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute right-0 bottom-0 aspect-[5/6] w-[44%] overflow-hidden border-8 border-background">
            <Image
              src="/images/platos/picada-para-dos.jpg"
              alt="Picada Sr. Brocheta Para Dos"
              fill
              sizes="(min-width: 768px) 340px, 44vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Recomendados */}
      <section id="favoritos" className="scroll-mt-8 px-6 pb-20">
        <p className="text-center font-script text-2xl text-gold">Nuestros</p>
        <h2 className={cn(sectionTitle, "uppercase")}>Recomendados</h2>
        <ul className="mx-auto mt-10 flex max-w-3xl flex-col gap-2 font-serif text-xl">
          {favoritos.map((plato) => (
            <li key={plato.nombre} className="flex items-baseline justify-between gap-6">
              <span className="text-foreground">{plato.nombre}</span>
              <span className="shrink-0 text-gold">{plato.precio}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 text-center">
          <Link href={WHATSAPP_URL} target="_blank" className={button}>
            Hacer Pedido
          </Link>
        </div>
      </section>

      {/* Horarios */}
      <section className="px-6 pb-20">
        <h2 className={sectionTitle}>Horarios de Atención:</h2>
        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-4 text-sm sm:text-base">
          {horarios.map((h) => (
            <div key={h.dias} className="flex items-baseline gap-4">
              <span className="text-foreground/65">{h.dias}</span>
              <span className="min-w-6 flex-1 border-b border-dotted border-foreground/30" aria-hidden />
              <span className="text-right font-semibold text-gold">{h.horas}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Celebra con nosotros */}
      <section className="px-6 pb-20">
        <h2 className={cn(sectionTitle, "uppercase")}>Celebra con nosotros</h2>
        <div className="mt-10">
          <PhotoGrid images={zonas} />
        </div>
        <div className="mt-8 text-center">
          <Link href="/reservas/nueva" className={button}>
            Reservas
          </Link>
        </div>
      </section>

      {/* Galería */}
      <section id="galeria" className="scroll-mt-8 px-6 pb-20">
        <h2 className={sectionTitle}>Galería</h2>
        <div className="mt-10">
          <PhotoGrid images={platos} />
        </div>
        <div className="mt-8 text-center">
          <Link href={INSTAGRAM_URL} target="_blank" className={button}>
            Ver Más
          </Link>
        </div>
      </section>

      {/* Sedes y contacto */}
      <section id="contacto" className="scroll-mt-8 px-6 pb-20">
        <h2 className={sectionTitle}>Nuestras Sedes</h2>
        <div className="mx-auto mt-10 grid max-w-4xl gap-10 text-center sm:grid-cols-3">
          {sedes.map((sede) => (
            <div key={sede.nombre} className="flex flex-col items-center">
              <h3 className="font-serif text-xl font-semibold text-gold">{sede.nombre}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/75">
                {sede.direccion}
              </p>
              <Link
                href={sede.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-sm font-semibold text-foreground underline decoration-gold underline-offset-4 hover:text-gold"
              >
                Cómo llegar
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-foreground/85">
          <Link href={WHATSAPP_URL} target="_blank" className="hover:text-gold">
            WhatsApp: <span className="font-semibold">{PHONE_DISPLAY}</span>
          </Link>
          <Link href={`mailto:${EMAIL}`} className="hover:text-gold">
            {EMAIL}
          </Link>
          <Link href={INSTAGRAM_URL} target="_blank" className="hover:text-gold">
            @sr.brocheta
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col items-center px-6 pt-6 pb-16">
        <Image
          src="/images/reservas/brand-logo.png"
          alt="Sr. Brocheta"
          width={465}
          height={246}
          className="h-32 w-auto sm:h-40"
        />
        <p className="mt-4 text-sm tracking-wide text-foreground/70">Gracias por elegirnos</p>
      </footer>
    </div>
  );
}
