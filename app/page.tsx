import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Baby,
  Gift,
  PartyPopper,
  ShieldCheck,
  Snowflake,
} from "lucide-react";
import { FavoritosCarousel } from "@/components/favoritos-carousel";
import {
  FloatingContact,
  InstagramIcon,
  WhatsAppIcon,
} from "@/components/floating-contact";
import { SiteHeader } from "@/components/site-header";
import { SmoothScroll } from "@/components/experiencia/smooth-scroll";
import { Preloader } from "@/components/experiencia/preloader";
import { Hero } from "@/components/experiencia/hero";
import { Interludio } from "@/components/experiencia/interludio";
import { AsiSeArma } from "@/components/experiencia/asi-se-arma";
import {
  GaleriaProfundidad,
  type FotoGaleria,
} from "@/components/experiencia/galeria-profundidad";
import { CapituloIntro } from "@/components/experiencia/capitulo";
import { FichaNumero } from "@/components/experiencia/ficha-numero";
import { VideoFondo } from "@/components/experiencia/video-fondo";
import {
  FotosAmpliables,
  type FotoAmpliable,
} from "@/components/experiencia/fotos-ampliables";
import { SectionHeading } from "@/components/section-heading";
import { RappiLink } from "@/components/rappi-link";
import { RevealObserver } from "@/components/reveal-observer";
import { cn } from "cn";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

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

const fotosEspacios: FotoAmpliable[] = [
  {
    src: "/images/sitio/espacios/zona-1-y-2.jpg",
    alt: "Zonas 1 y 2 de la sede Dangond de Señor Brocheta",
    titulo: "Zonas 1 y 2",
  },
  {
    src: "/images/sitio/espacios/zona-3.jpg",
    alt: "Zona 3 de la sede Dangond de Señor Brocheta",
    titulo: "Zona 3",
  },
  {
    src: "/images/sitio/espacios/zona-4.jpg",
    alt: "Zona 4 climatizada de Señor Brocheta",
    titulo: "Zona 4 · Climatizada",
  },
  {
    src: "/images/sitio/hero-zona-5.jpg",
    alt: "Zona 5 climatizada con mural de Señor Brocheta",
    titulo: "Zona 5 · Climatizada",
  },
];

const galeria: FotoGaleria[] = [
  {
    src: "/images/sitio/nuevas/hamburguesa-doble.jpg",
    alt: "Hamburguesa doble con tocineta y queso de Señor Brocheta",
    pie: "Doble carne, doble antojo",
  },
  {
    src: "/images/sitio/nuevas/salchipapa-cerca.jpg",
    alt: "Salchipapa con queso, maíz y salsas vista de cerca",
    pie: "Cada capa cuenta",
  },
  {
    src: "/images/sitio/nuevas/perro-tocineta.jpg",
    alt: "Perro caliente con tocineta y queso gratinado",
    pie: "Tocineta encima, siempre",
  },
  {
    src: "/images/sitio/nuevas/tres-hamburguesas.jpg",
    alt: "Tres hamburguesas de Señor Brocheta servidas en tablas",
    pie: "Una para cada quien",
  },
  {
    src: "/images/sitio/nuevas/hamburguesa-coca.jpg",
    alt: "Hamburguesa con papas fritas y gaseosa",
    pie: "El combo de siempre",
  },
  {
    src: "/images/sitio/nuevas/perro-papas.jpg",
    alt: "Perro caliente con papas en la mesa",
    pie: "Para compartir (o no)",
  },
  {
    src: "/images/sitio/galeria/amigas.jpg",
    alt: "Amigas disfrutando hamburguesas en Señor Brocheta",
    pie: "Los planes se hacen aquí",
  },
  {
    src: "/images/sitio/nuevas/hamburguesa-queso.jpg",
    alt: "Hamburguesa con queso fundido recién servida",
    pie: "Recién salida de la plancha",
  },
];

// Publicaciones fijas y elegidas a mano (quiénes somos, dónde estamos y comida
// que provoca). No se cargan del perfil: para cambiarlas se reemplaza la portada
// en public/images/sitio/instagram/ y su enlace aquí.
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
  geo: { lat: number; lng: number };
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
    geo: { lat: 10.4662693, lng: -73.2624291 },
    calle: "Calle 16 #19E-85",
    horas: { abre: "17:00", cierra: "23:00" },
    direccion: "Calle 16 #19E-85, Valledupar",
    horario: "5:00 p. m. a 11:00 p. m.",
    foto: "/images/sitio/sedes/dangond.jpg",
    fotoAlt: "Fachada de la sede Dangond de Señor Brocheta en Valledupar",
    mapsUrl: "https://www.google.com/maps?cid=17035747657175834992",
    pedido: {
      texto: "Pedir por WhatsApp",
      href: WHATSAPP_URL,
      externo: true,
    },
  },
  {
    nombre: "Sede Mayales Plaza",
    geo: { lat: 10.4567717, lng: -73.240782 },
    calle: "Centro Comercial Mayales, Etapa 1, Local 34",
    lugar: "Centro Comercial Mayales · Etapa 1 · Local 34",
    direccion: "Centro Comercial Mayales, Etapa 1, Local 34, Valledupar",
    horario: "12:00 m. a 8:30 p. m.",
    foto: "/images/sitio/sedes/mayales.jpg",
    fotoAlt: "Punto de Señor Brocheta en el Centro Comercial Mayales Plaza",
    mapsUrl: "https://www.google.com/maps?cid=11403637636966703771",
    pedido: { texto: "Pedir por Rappi", href: RAPPI_URL, externo: true },
  },
  {
    nombre: "Sede Guatapurí Plaza",
    geo: { lat: 10.473115, lng: -73.279848 },
    calle: "Centro Comercial Guatapurí, Local 2035",
    lugar: "Centro Comercial Guatapurí · Local 2035",
    direccion: "Centro Comercial Guatapurí, Local 2035, Valledupar",
    horario: "12:00 m. a 8:30 p. m.",
    foto: "/images/sitio/sedes/guatapuri.jpg",
    fotoAlt: "Punto de Señor Brocheta en el Centro Comercial Guatapurí Plaza",
    mapsUrl: "https://www.google.com/maps?cid=825247840065479572",
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
    geo: {
      "@type": "GeoCoordinates",
      latitude: sede.geo.lat,
      longitude: sede.geo.lng,
    },
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
    <div className="experiencia flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(restauranteJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Preloader />
      <SmoothScroll />
      <SiteHeader />
      <RevealObserver />
      <FloatingContact whatsappUrl={WHATSAPP_URL} instagramUrl={INSTAGRAM_URL} />

      <Hero whatsappUrl={WHATSAPP_URL} />

      {/* Capítulo 01: Favoritos */}
      <section id="favoritos" className="fondo-reticula scroll-mt-16">
        <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:py-32">
          <CapituloIntro
            numero="01"
            etiqueta="Para antojarte"
            titulo="Los favoritos de la casa."
            texto="Los que siempre provocan. Los que se recomiendan. Los que tienes que probar."
          />
          <FavoritosCarousel platos={favoritos} />
          <div data-reveal="up" className="mt-8 flex flex-col items-center gap-3 text-center">
            <span className="text-base font-bold text-foreground">
              Mira todo lo que tenemos
            </span>
            <Link
              href={WHATSAPP_URL}
              target="_blank"
              className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/85"
            >
              Pedir por WhatsApp
            </Link>
          </div>
        </div>
      </section>

      <Interludio video="queso" frase="El que prueba, vuelve" etiqueta="Sin miedo al queso" efecto="queso" />

      {/* Capítulo 02: Historia */}
      <section id="historia" className="fondo-reticula scroll-mt-16">
        <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:py-32">
          <CapituloIntro
            numero="02"
            etiqueta="Desde Valledupar"
            titulo="Nacimos de una receta de familia y un chuzo que no tardó en hacerse conocido en la ciudad."
            texto="Hoy somos tres sedes, un equipo que crece a diario y un mismo compromiso: comida urbana premium, servida rápido y sin perder el sabor de casa."
          />

          <div className="mt-14 grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-6">
            <div
              data-reveal="image"
              className="relative aspect-[4/5] overflow-hidden rounded-md ring-1 ring-gold/20"
            >
              <Image
                src="/images/sitio/nuevas/chica-logo.jpg"
                alt="Clienta disfrutando un perro caliente frente al aviso dorado de Señor Brocheta"
                fill
                sizes="(min-width: 768px) 560px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div
                data-reveal="image"
                style={{ "--d": "150ms" } as React.CSSProperties}
                className="relative aspect-square overflow-hidden rounded-md ring-1 ring-gold/20"
              >
                <Image
                  src="/images/sitio/nuevas/mesa-arriba.jpg"
                  alt="Mesa llena de platos de Señor Brocheta vista desde arriba"
                  fill
                  sizes="(min-width: 768px) 480px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FichaNumero valor={3} etiqueta="Sedes" detalle="Dangond, Mayales y Guatapurí" />
                <FichaNumero valor={5} etiqueta="Zonas" detalle="Para reservar en la sede Dangond" delay={0.15} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capítulo 03: Así se arma */}
      <AsiSeArma />

      <Interludio video="salsa" frase="No es solo comida, es un plan" etiqueta="La salsa al final" efecto="salsa" />

      {/* Capítulo 04: Galería */}
      <GaleriaProfundidad fotos={galeria} />

      {/* Espacios */}
      <section id="espacios" className="fondo-reticula scroll-mt-16">
        <div className="mx-auto w-full max-w-6xl px-5 py-20">
          <CapituloIntro
            numero="05"
            etiqueta="Sede Dangond"
            titulo="Un lugar para compartir y celebrar."
            texto="En Señor Brocheta encuentras el espacio ideal para compartir con familia y amigos, celebrar cumpleaños, reuniones y ocasiones especiales. Nuestra sede Dangond cuenta con ambientes cómodos, zonas climatizadas y ventiladas, opciones de reserva con o sin decoración, sillas para bebés y vigilancia privada."
          />

          {/* Es un plan: video de gente disfrutando */}
          <div
            data-reveal="image"
            className="relative mt-12 aspect-[4/5] overflow-hidden rounded-md ring-1 ring-gold/20 sm:aspect-[21/9]"
          >
            <VideoFondo nombre="gente" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" aria-hidden />
            <p className="absolute bottom-6 left-6 font-display text-5xl leading-none text-white sm:bottom-8 sm:left-8 sm:text-7xl">
              es un plan
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {destacadosEspacios.map(({ icon: Icon, titulo, texto }, i) => (
              <div
                key={titulo}
                data-reveal="up"
                style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
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

          <FotosAmpliables fotos={fotosEspacios} />

          <div data-reveal="up" className="mt-10 flex flex-col items-center gap-4 text-center">
            <p className="text-lg font-bold text-foreground">
              Tu próxima celebración comienza aquí. Reserva tu espacio.
            </p>
            <Link href="/reservas/nueva" className={botonRojo}>
              Reservar mesa
            </Link>
          </div>
        </div>
      </section>

      {/* Sedes */}
      <section id="sedes" className="fondo-reticula scroll-mt-16">
        <div className="mx-auto w-full max-w-6xl px-5 py-20">
          <CapituloIntro
            numero="06"
            etiqueta="Visítanos"
            titulo="Tres sedes en Valledupar, y tus favoritos también a domicilio."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {sedes.map((sede, i) => (
              <article
                key={sede.nombre}
                data-reveal="up"
                style={{ "--d": `${i * 140}ms` } as React.CSSProperties}
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

          <p data-reveal="up" className="mt-10 text-center text-lg text-foreground/85">
            <span className="font-bold text-foreground">
              Estamos cada vez más cerca de ti.
            </span>{" "}
            Visítanos en Mayales Plaza o Guatapurí y disfruta de tus favoritos de
            Señor Brocheta.
          </p>
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
          <div data-reveal="up" className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
            {reels.map((reel, i) => (
              <Link
                key={reel.href}
                data-reveal="image"
                style={{ "--d": `${(i % 3) * 120}ms` } as React.CSSProperties}
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
          <div data-reveal="up" className="mt-10 text-center">
            <Link href={INSTAGRAM_URL} target="_blank" className={botonBorde}>
              <InstagramIcon className="mr-2 size-4" />
              Síguenos en Instagram
            </Link>
          </div>
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
