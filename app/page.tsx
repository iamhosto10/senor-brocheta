import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    nombre: "Burguer Sr. Broche",
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
    nombre: "Sede Principal",
    direccion: "Calle 16 # 19E-85, Valledupar",
  },
  {
    nombre: "Sede Dangond",
    direccion: "Cra 20 # 16-17, Br Dangond, Valledupar",
  },
];

const galeria = [
  {
    src: "/images/bolsa-marca.jpg",
    alt: "Pedido empacado con el logo de Sr. Brocheta",
  },
  {
    src: "/images/equipo-celebracion.jpg",
    alt: "Equipo de Sr. Brocheta celebrando en el local",
  },
  {
    src: "/images/equipo-cocina.jpg",
    alt: "Equipo de cocina de Sr. Brocheta preparando los pedidos",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/logo.jpg"
              alt="Logo Sr. Brocheta"
              width={36}
              height={36}
              className="rounded-full ring-1 ring-primary/50"
            />
            <span className="font-semibold tracking-wide">SR. BROCHETA</span>
          </div>
          <Link
            href={WHATSAPP_URL}
            target="_blank"
            className={cn(buttonVariants({ variant: "default", size: "sm" }))}
          >
            Pedir ahora
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/equipo-celebracion.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background to-background" />
        </div>
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-5 py-24 text-center">
          <Image
            src="/images/logo.jpg"
            alt="Logo Sr. Brocheta"
            width={88}
            height={88}
            className="rounded-full ring-2 ring-primary/70"
          />
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Comida Urbana <span className="text-primary">Premium</span>
          </h1>
          <p className="max-w-xl text-pretty text-muted-foreground">
            Resolvemos tu antojo al instante. Hamburguesas, salchipapas y
            combos en Valledupar — el sabor que nos une.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={MENU_URL}
              target="_blank"
              className={cn(buttonVariants({ variant: "default", size: "lg" }))}
            >
              Ver menú completo
            </Link>
            <Link
              href={WHATSAPP_URL}
              target="_blank"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Pedir por WhatsApp
            </Link>
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
            >
              Síguenos @sr.brocheta
            </Link>
          </div>
        </div>
      </section>

      {/* Favoritos */}
      <section className="mx-auto w-full max-w-5xl px-5 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Algunos favoritos</h2>
          <p className="mt-2 text-muted-foreground">
            Una probadita de lo que nos hace premium. El menú completo tiene
            mucho más.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {favoritos.map((plato) => (
            <Card key={plato.nombre} className="border-border/80 bg-card">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-lg">{plato.nombre}</CardTitle>
                  <span className="shrink-0 font-semibold text-primary">
                    {plato.precio}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {plato.descripcion}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href={MENU_URL}
            target="_blank"
            className={cn(buttonVariants({ variant: "default", size: "lg" }))}
          >
            Ver menú completo
          </Link>
        </div>
      </section>

      {/* Galería / Nosotros */}
      <section className="border-y border-border/60 bg-secondary/30">
        <div className="mx-auto w-full max-w-5xl px-5 py-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Nosotros</h2>
            <p className="mt-2 text-muted-foreground">
              Un equipo que crece a diario, directo desde nuestras sedes en
              Valledupar.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {galeria.map((img) => (
              <div
                key={img.src}
                className="relative aspect-[3/4] overflow-hidden rounded-xl ring-1 ring-border/80"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Ver más en Instagram
            </Link>
          </div>
        </div>
      </section>

      {/* Ubicación y contacto */}
      <section className="mx-auto w-full max-w-5xl px-5 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ubicación y horarios
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {sedes.map((sede) => (
            <Card key={sede.nombre} className="border-border/80 bg-card">
              <CardHeader>
                <CardTitle className="text-lg">{sede.nombre}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  📍 {sede.direccion}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  🕐 Todos los días, 5:00 pm - 11:00 pm
                </p>
              </CardContent>
              <CardFooter>
                <Link
                  href={WHATSAPP_URL}
                  target="_blank"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" })
                  )}
                >
                  📲 +57 317 136 1324
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="mx-auto grid w-full max-w-5xl gap-8 px-5 py-12 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
            <Image
              src="/images/logo.jpg"
              alt="Logo Sr. Brocheta"
              width={48}
              height={48}
              className="rounded-full ring-1 ring-primary/50"
            />
            <p className="text-xs text-muted-foreground">
              Sr. Brocheta · Grill &amp; Burger · Valledupar
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground sm:items-start sm:text-left">
            <h3 className="mb-1 text-xs font-semibold tracking-wide text-foreground uppercase">
              Ubicación
            </h3>
            {sedes.map((sede) => (
              <p key={sede.nombre}>
                📍 {sede.nombre}: {sede.direccion}
              </p>
            ))}
          </div>

          <div className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground sm:items-start sm:text-left">
            <h3 className="mb-1 text-xs font-semibold tracking-wide text-foreground uppercase">
              Contacto
            </h3>
            <Link href={WHATSAPP_URL} target="_blank" className="hover:text-primary">
              📲 {PHONE_DISPLAY}
            </Link>
            <Link href={`mailto:${EMAIL}`} className="hover:text-primary">
              ✉️ {EMAIL}
            </Link>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <Link href={INSTAGRAM_URL} target="_blank" className="hover:text-primary">
                Instagram
              </Link>
              <Link href={MENU_URL} target="_blank" className="hover:text-primary">
                Menú completo
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
