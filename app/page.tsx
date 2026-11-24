import Image from "next/image";
import Link from "next/link";
import {
  Baby,
  Gift,
  PartyPopper,
  ShieldCheck,
  Snowflake,
} from "lucide-react";
import {
  FloatingContact,
  InstagramIcon,
  WhatsAppIcon,
} from "@/components/floating-contact";
import { SiteHeader } from "@/components/site-header";
import { SectionHeading } from "@/components/section-heading";
import { RappiLink } from "@/components/rappi-link";
import { cn } from "cn";

const WHATSAPP_URL = "https://wa.me/573171361324";
const INSTAGRAM_URL = "https://www.instagram.com/sr.brocheta/";
const RAPPI_URL =
  "https://www.rappi.com.co/valledupar/restaurantes/delivery/21039-senor-brocheta";
const PHONE_DISPLAY = "+57 317 136 1324";
const EMAIL = "contacto@srbrocheta.com";

const favoritos = [
  {
    nombre: "Salchipapa Master Pro",
    src: "/images/sitio/platos/salchipapa-master-pro.jpg",
    alt: "Salchipapa Master Pro de Señor Brocheta en Valledupar",
  },
  {
    nombre: "Hamburguesa Valpa",
    src: "/images/sitio/platos/hamburguesa-valpa.jpg",
    alt: "Hamburguesa Valpa con papas fritas de Señor Brocheta",
  },
  {
    nombre: "Arepa tipo picada",
    src: "/images/sitio/platos/arepa-tipo-picada.jpg",
    alt: "Arepa tipo picada de Señor Brocheta",
  },
  {
    nombre: "Brocheta mixta",
    src: "/images/sitio/platos/brocheta-mixta.jpg",
    alt: "Brocheta mixta con chorizo y carnes de Señor Brocheta",
  },
  {
    nombre: "Arepa Señor Brocheta",
    src: "/images/sitio/platos/arepa-senor-brocheta.jpg",
    alt: "Arepa rellena Señor Brocheta",
  },
];

const destacadosEspacios = [
  {
    icon: PartyPopper,
    titulo: "Celebraciones y eventos",
    texto:
      "Espacios para cumpleaños, reuniones familiares, celebraciones y eventos de diferentes tamaños.",
  },
  {
    icon: Gift,
    titulo: "Reservas personalizadas",
    texto:
      "Reserva con decoración o sin decoración, según la ocasión y tus preferencias.",
  },
  {
    icon: Snowflake,
    titulo: "Comodidad para todos",
    texto:
      "Zonas climatizadas y espacios con ventilación para disfrutar de una experiencia agradable.",
  },
  {
    icon: ShieldCheck,
    titulo: "Un entorno tranquilo",
    texto:
      "Vigilancia privada y ambientes pensados para disfrutar con tranquilidad.",
  },
  {
    icon: Baby,
    titulo: "Pensado para la familia",
    texto:
      "Disponibilidad de sillas para bebés y espacios para compartir entre generaciones.",
  },
];

const fotosEspacios = [
  {
    src: "/images/sitio/espacios/zona-1-y-2.jpg",
    alt: "Zonas 1 y 2 de la sede Dangond de Señor Brocheta",
  },
  {
    src: "/images/sitio/espacios/zona-3.jpg",
    alt: "Zona 3 de la sede Dangond de Señor Brocheta",
  },
  {
    src: "/images/sitio/espacios/zona-4.jpg",
    alt: "Zona 4 climatizada de Señor Brocheta",
  },
  {
    src: "/images/sitio/hero-zona-5.jpg",
    alt: "Zona 5 climatizada con mural de Señor Brocheta",
  },
];

const galeria = [
  {
    src: "/images/sitio/galeria/pechuga.jpg",
    alt: "Pechuga Sr Brocheta con papas y salsas",
  },
  {
    src: "/images/sitio/galeria/brochetas.jpg",
    alt: "Brochetas mixtas servidas en soporte vertical",
  },
  {
    src: "/images/sitio/galeria/hamburguesa-papas.jpg",
    alt: "Hamburguesa con papas fritas y gaseosa",
  },
  {
    src: "/images/sitio/galeria/mesa-completa.jpg",
    alt: "Mesa completa con hamburguesas, brochetas y perros calientes",
  },
  {
    src: "/images/sitio/galeria/amigas.jpg",
    alt: "Amigas disfrutando hamburguesas en Señor Brocheta",
  },
  {
    src: "/images/sitio/galeria/pareja-aviso.jpg",
    alt: "Pareja disfrutando sus platos frente al aviso dorado de Señor Brocheta",
  },
  {
    src: "/images/sitio/galeria/pareja-hamburguesa.jpg",
    alt: "Pareja compartiendo una hamburguesa en Señor Brocheta",
  },
  {
    src: "/images/sitio/galeria/aviso-dorado.jpg",
    alt: "Aviso dorado de Señor Brocheta con flores amarillas",
  },
  {
    src: "/images/sitio/galeria/aviso-dorado-mesa.jpg",
    alt: "Mesa y aviso dorado de Señor Brocheta en la sede Dangond",
  },
];

const reels = [
  {
    titulo: "Master Pro",
    src: "/images/sitio/instagram/reel-1.jpg",
    href: "https://www.instagram.com/reel/DRTAPe4kTQS/",
  },
  {
    titulo: "Hey, ¿dónde estás?",
    src: "/images/sitio/instagram/reel-2.jpg",
    href: "https://www.instagram.com/reel/DcmoYZbxdjo/",
  },
  {
    titulo: "Arepa tipo picada",
    src: "/images/sitio/instagram/reel-3.jpg",
    href: "https://www.instagram.com/reel/DNHKq7kIXNM/",
  },
  {
    titulo: "Equipo Señor Brocheta: nunca abandones ese sueño que en tu alma está",
    src: "/images/sitio/instagram/reel-4.jpg",
    href: "https://www.instagram.com/reel/DYVmrX8Ref-/",
  },
  {
    titulo: "Experiencia gastronómica",
    src: "/images/sitio/instagram/reel-5.jpg",
    href: "https://www.instagram.com/reel/DL8fopvRtjk/",
  },
  {
    titulo: "Compartir y disfrutar en Señor Brocheta",
    src: "/images/sitio/instagram/reel-6.jpg",
    href: "https://www.instagram.com/reel/DXM4kZAkYps/",
  },
];

type Sede = {
  nombre: string;
  calle: string;
  horas?: { abre: string; cierra: string };
  lugar?: string;
  direccion: string;
  horario: string;
  foto: string;
  fotoAlt: string;
  mapsUrl: string;
  pedido: { texto: string; href: string; externo: boolean };
};

const sedes: Sede[] = [
  {
    nombre: "Sede Dangond",
    calle: "Calle 16 #19E-85",
    horas: { abre: "17:00", cierra: "23:00" },
    direccion: "Calle 16 #19E-85, Valledupar",
    horario: "5:00 p. m. a 11:00 p. m.",
    foto: "/images/sitio/sedes/dangond.jpg",
    fotoAlt: "Fachada de la sede Dangond de Señor Brocheta en Valledupar",
    mapsUrl: "https://g.page/r/CXChKCU8ImvsEAE",
    pedido: {
      texto: "Pedir por WhatsApp",
      href: WHATSAPP_URL,
      externo: true,
    },
  },
  {
    nombre: "Sede Mayales Plaza",
    calle: "Centro Comercial Mayales, Etapa 1, Local 34",
    lugar: "Centro Comercial Mayales · Etapa 1 · Local 34",
    direccion: "Centro Comercial Mayales, Etapa 1, Local 34, Valledupar",
    horario: "12:00 m. a 8:30 p. m.",
    foto: "/images/sitio/sedes/mayales.jpg",
    fotoAlt: "Punto de Señor Brocheta en el Centro Comercial Mayales Plaza",
    mapsUrl: "https://g.page/r/CZvirAID3EGeEBM",
    pedido: { texto: "Pedir por Rappi", href: RAPPI_URL, externo: true },
  },
  {
    nombre: "Sede Guatapurí Plaza",
    calle: "Centro Comercial Guatapurí, Local 2035",
    lugar: "Centro Comercial Guatapurí · Local 2035",
    direccion: "Centro Comercial Guatapurí, Local 2035, Valledupar",
    horario: "12:00 m. a 8:30 p. m.",
    foto: "/images/sitio/sedes/guatapuri.jpg",
    fotoAlt: "Punto de Señor Brocheta en el Centro Comercial Guatapurí Plaza",
    mapsUrl: "https://g.page/r/CZTjwsaJ3nMLEBM",
    pedido: { texto: "Pedir por Rappi", href: RAPPI_URL, externo: true },
  },
];

const SITE_URL = "https://srbrocheta.com";
const DIAS_SEMANA = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const restauranteJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": `${SITE_URL}/#restaurante`,
  name: "Señor Brocheta",
  description:
    "Las mejores salchipapas de Valledupar. Hamburguesas, arepas y brochetas con calidad, sabor y buenos precios.",
  url: SITE_URL,
  image: [`${SITE_URL}/images/og-image.jpg`, `${SITE_URL}/images/sitio/hero-zona-5.jpg`],
  logo: `${SITE_URL}/images/reservas/brand-logo.png`,
  telephone: "+57 317 136 1324",
  servesCuisine: ["Comida rápida", "Salchipapas", "Hamburguesas", "Brochetas"],
  acceptsReservations: `${SITE_URL}/reservas/nueva`,
  sameAs: [INSTAGRAM_URL],
  areaServed: { "@type": "City", name: "Valledupar" },
  department: sedes.map((sede) => ({
    "@type": "Restaurant",
    name: `Señor Brocheta - ${sede.nombre}`,
    url: SITE_URL,
    image: `${SITE_URL}${sede.foto}`,
    hasMap: sede.mapsUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: sede.calle,
      addressLocality: "Valledupar",
      addressRegion: "Cesar",
      addressCountry: "CO",
    },
    ...(sede.horas && {
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: DIAS_SEMANA,
        opens: sede.horas.abre,
        closes: sede.horas.cierra,
      },
    }),
  })),
};

const heroButton =
  "inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-bold tracking-wide transition-colors";
const botonRojo = cn(heroButton, "bg-primary text-primary-foreground hover:bg-primary/85");
const botonBorde = cn(heroButton, "border-2 border-gold text-foreground hover:bg-gold/10");

export default function Home() {
  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(restauranteJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />
      <FloatingContact whatsappUrl={WHATSAPP_URL} instagramUrl={INSTAGRAM_URL} />

      {/* Hero */}
      <section
        id="inicio"
        className="relative flex min-h-[92vh] scroll-mt-16 items-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/sitio/hero-zona-5.jpg"
            alt="Zona 5 de Señor Brocheta con mural y aviso dorado"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black" />
        </div>
        <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-5 px-5 py-28 text-center">
          <Image
            src="/images/reservas/brand-logo.png"
            alt="Señor Brocheta"
            width={320}
            height={170}
            priority
            className="h-24 w-auto sm:h-32"
          />
          <h1 className="font-display text-5xl leading-tight text-foreground sm:text-7xl">
            El mejor sabor se comparte.
          </h1>
          <span className="h-[3px] w-16 rounded-full bg-gold" aria-hidden />
          <p className="max-w-xl text-pretty text-lg text-foreground/85">
            Las mejores salchipapas de Valledupar, calidad, buenos precios y una
            atención que se disfruta. Ven con tu familia y amigos, nosotros
            ponemos el sabor.
          </p>
          <p className="text-base font-bold text-gold">
            ¡Haz de tu antojo tu próximo plan!
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Link href="/reservas/nueva" className={botonRojo}>
              Reservar mesa
            </Link>
            <Link href={WHATSAPP_URL} target="_blank" className={botonBorde}>
              Pedir por WhatsApp
            </Link>
          </div>
        </div>
      </section>

      {/* Favoritos */}
      <section id="favoritos" className="scroll-mt-16">
        <div className="mx-auto w-full max-w-5xl px-5 py-20">
          <SectionHeading
            eyebrow="Para antojarte"
            title="Los favoritos de la casa"
            description="Los que siempre provocan. Los que se recomiendan. Los que tienes que probar."
          />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {favoritos.map((plato) => (
              <div key={plato.nombre} className="flex flex-col gap-3">
                <div className="relative aspect-square overflow-hidden rounded-md ring-1 ring-gold/20">
                  <Image
                    src={plato.src}
                    alt={plato.alt}
                    fill
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 30vw, 46vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="text-center text-base font-bold text-foreground">
                  {plato.nombre}
                </h3>
              </div>
            ))}
            <Link
              href={WHATSAPP_URL}
              target="_blank"
              className="group flex aspect-square flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-gold/50 p-4 text-center transition-colors hover:border-gold hover:bg-gold/5"
            >
              <span className="text-base font-bold text-foreground">
                Mira todo lo que tenemos
              </span>
              <span className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground">
                Pedir por WhatsApp
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Domicilios */}
      <section
        id="domicilios"
        className="scroll-mt-16 border-y border-gold/15 bg-secondary/40"
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 py-16 text-center">
          <SectionHeading
            eyebrow="Domicilios"
            title="Pide sin salir de casa"
            description="Los buenos momentos también llegan a tu puerta. Disfruta de tus favoritos sin salir de casa."
          />
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <RappiLink href={RAPPI_URL} className={botonRojo}>
              Pedir por Rappi
            </RappiLink>
            <Link href={WHATSAPP_URL} target="_blank" className={botonBorde}>
              <WhatsAppIcon className="mr-2 size-4" />
              Pedir por WhatsApp
            </Link>
          </div>
        </div>
      </section>

      {/* Espacios */}
      <section id="espacios" className="scroll-mt-16">
        <div className="mx-auto w-full max-w-6xl px-5 py-20">
          <SectionHeading
            eyebrow="Sede Dangond"
            title="Un lugar para compartir y celebrar"
            description="En Señor Brocheta encuentras el espacio ideal para compartir con familia y amigos, celebrar cumpleaños, reuniones y ocasiones especiales. Nuestra sede Dangond cuenta con ambientes cómodos, zonas climatizadas y ventiladas, opciones de reserva con o sin decoración, sillas para bebés y vigilancia privada. Visítanos y haz de cada encuentro un momento especial."
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {destacadosEspacios.map(({ icon: Icon, titulo, texto }) => (
              <div
                key={titulo}
                className="flex flex-col items-center rounded-md border border-gold/20 p-5 text-center"
              >
                <Icon className="size-7 text-gold" aria-hidden />
                <h3 className="mt-3 text-sm font-bold text-foreground">
                  {titulo}
                </h3>
                <p className="mt-2 text-sm text-foreground/70">{texto}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {fotosEspacios.map((foto) => (
              <div
                key={foto.src}
                className="relative aspect-[4/5] overflow-hidden rounded-md ring-1 ring-gold/20"
              >
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  sizes="(min-width: 1024px) 280px, 46vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <p className="text-lg font-bold text-foreground">
              Tu próxima celebración comienza aquí. Reserva tu espacio.
            </p>
            <Link href="/reservas/nueva" className={botonRojo}>
              Reservar mesa
            </Link>
          </div>
        </div>
      </section>

      {/* Galería */}
      <section
        id="galeria"
        className="scroll-mt-16 border-y border-gold/15 bg-secondary/40"
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-20">
          <SectionHeading eyebrow="Así se vive" title="Galería" />
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {galeria.map((foto) => (
              <div
                key={foto.src}
                className="relative aspect-square overflow-hidden rounded-md ring-1 ring-gold/20"
              >
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 30vw, 46vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historia */}
      <section id="historia" className="scroll-mt-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-20 text-center">
          <SectionHeading eyebrow="Desde Valledupar" title="Conoce nuestra historia" />
          {/* Texto provisional: el cliente enviará la historia definitiva */}
          <p className="mt-6 text-pretty text-foreground/80">
            Nacimos de una receta de familia y un chuzo que no tardó en hacerse
            conocido en la ciudad. Hoy somos tres sedes, un equipo que crece a
            diario y un mismo compromiso: comida urbana premium, servida rápido
            y sin perder el sabor de casa.
          </p>
        </div>
      </section>

      {/* Instagram */}
      <section
        id="instagram"
        className="scroll-mt-16 border-y border-gold/15 bg-secondary/40"
      >
        <div className="mx-auto w-full max-w-5xl px-5 py-20">
          <SectionHeading
            eyebrow="@sr.brocheta"
            title="Síguenos en Instagram"
            description="Toca cualquier video para verlo en nuestro perfil."
          />
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {reels.map((reel) => (
              <Link
                key={reel.href}
                href={reel.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver en Instagram: ${reel.titulo}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-md ring-1 ring-gold/20"
              >
                <Image
                  src={reel.src}
                  alt={`Portada del video de Instagram: ${reel.titulo}`}
                  fill
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 30vw, 46vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/50 group-hover:opacity-100">
                  <InstagramIcon className="size-8 text-white" />
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href={INSTAGRAM_URL} target="_blank" className={botonBorde}>
              <InstagramIcon className="mr-2 size-4" />
              Síguenos en Instagram
            </Link>
          </div>
        </div>
      </section>

      {/* Sedes */}
      <section id="sedes" className="scroll-mt-16">
        <div className="mx-auto w-full max-w-6xl px-5 py-20">
          <SectionHeading eyebrow="Visítanos" title="Nuestras sedes" />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {sedes.map((sede) => (
              <article
                key={sede.nombre}
                className="flex h-full flex-col overflow-hidden rounded-md border border-gold/20"
              >
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={sede.foto}
                    alt={sede.fotoAlt}
                    fill
                    sizes="(min-width: 768px) 380px, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-bold text-foreground">
                    {sede.nombre}
                  </h3>
                  <span className="mt-2 h-[2px] w-8 bg-gold" aria-hidden />
                  {sede.lugar && (
                    <p className="mt-3 text-sm font-semibold text-gold">
                      {sede.lugar}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-foreground/75">
                    {sede.direccion}
                  </p>
                  <p className="mt-2 text-sm text-foreground/75">
                    <span className="font-semibold text-foreground">Horario:</span>{" "}
                    {sede.horario}
                  </p>
                  <div className="mt-5 flex flex-1 flex-col justify-end gap-3">
                    {sede.pedido.href === RAPPI_URL ? (
                      <RappiLink href={RAPPI_URL} className={cn(botonRojo, "h-11 px-5")}>
                        {sede.pedido.texto}
                      </RappiLink>
                    ) : (
                      <Link
                        href={sede.pedido.href}
                        target={sede.pedido.externo ? "_blank" : undefined}
                        className={cn(botonRojo, "h-11 px-5")}
                      >
                        {sede.pedido.texto}
                      </Link>
                    )}
                    <Link
                      href={sede.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(botonBorde, "h-11 px-5")}
                    >
                      Ver en Google Maps
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-10 text-center text-lg text-foreground/85">
            <span className="font-bold text-foreground">
              Estamos cada vez más cerca de ti.
            </span>{" "}
            Visítanos en Mayales Plaza o Guatapurí y disfruta de tus favoritos de
            Señor Brocheta.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gold/20 bg-secondary/40">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-5 px-5 pt-14 pb-40 text-center">
          <Image
            src="/images/reservas/brand-logo.png"
            alt="Señor Brocheta"
            width={200}
            height={106}
            className="h-16 w-auto"
          />
          <p className="text-xs tracking-[0.2em] text-foreground/60 uppercase">
            Comida Urbana Premium · Hamburguesas, Salchipapas y Combos
          </p>

          <div className="flex items-center gap-4">
            <Link
              href={WHATSAPP_URL}
              target="_blank"
              aria-label="WhatsApp"
              className="flex size-9 items-center justify-center rounded-full border border-gold/30 text-foreground/80 transition-colors hover:border-gold hover:text-gold"
            >
              <WhatsAppIcon className="size-4" />
            </Link>
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              aria-label="Instagram"
              className="flex size-9 items-center justify-center rounded-full border border-gold/30 text-foreground/80 transition-colors hover:border-gold hover:text-gold"
            >
              <InstagramIcon className="size-4" />
            </Link>
          </div>

          <span className="h-px w-16 bg-gold/25" aria-hidden />

          <div className="flex flex-col items-center gap-1.5 text-xs text-foreground/60">
            {sedes.map((sede) => (
              <p key={sede.nombre}>
                <span className="font-semibold text-foreground/80">
                  {sede.nombre}
                </span>{" "}
                · {sede.direccion} · {sede.horario}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-foreground/60">
            <Link href="/reservas/nueva" className="hover:text-gold">
              Reservas
            </Link>
            <Link href={WHATSAPP_URL} target="_blank" className="hover:text-gold">
              Pedir por WhatsApp
            </Link>
            <Link href={WHATSAPP_URL} target="_blank" className="hover:text-gold">
              WhatsApp {PHONE_DISPLAY}
            </Link>
            <Link href={`mailto:${EMAIL}`} className="hover:text-gold">
              {EMAIL}
            </Link>
          </div>

          <p className="text-xs text-foreground/40">
            © {new Date().getFullYear()} Señor Brocheta S.A.S. · Valledupar
          </p>
        </div>
      </footer>
    </div>
  );
}
