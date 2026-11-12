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
  { nombre: "La Salchipapa de Ana", precio: "$32.000" },
  { nombre: "Burger Sr.Broche", precio: "$29.000" },
  { nombre: "Chuzopan de la Casa", precio: "$30.000" },
  { nombre: "Picada Sr. Brocheta Para Dos", precio: "$50.000" },
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

const instagramPosts = [
  {
    src: "/images/equipo-celebracion.jpg",
    alt: "Equipo de Sr. Brocheta celebrando en el local",
    href: "https://www.instagram.com/sr.brocheta/reel/DYVmrX8Ref-/",
  },
  {
    src: "/images/equipo-cocina.jpg",
    alt: "Equipo de cocina de Sr. Brocheta preparando los pedidos",
    href: "https://www.instagram.com/sr.brocheta/p/DY-3tGLkaiJ/",
  },
];

const button =
  "inline-flex h-12 items-center justify-center bg-primary px-8 text-sm font-bold tracking-[0.12em] text-primary-foreground uppercase transition-colors hover:bg-primary/85";

const title = "text-center text-3xl font-bold tracking-wide text-foreground uppercase sm:text-4xl";

const paragraph = "mx-auto max-w-3xl text-center font-serif text-xl leading-relaxed text-foreground/85";

function PhotoBand({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="px-5 sm:px-6">
      <div className="relative aspect-[16/7] w-full overflow-hidden">
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
      </div>
    </div>
  );
}

function GoldRule() {
  return <span className="mx-auto mt-6 block h-px w-36 bg-gold" aria-hidden />;
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
      <section id="inicio" className="relative h-[88vh] min-h-[480px]">
        <Image
          src="/images/reservas/zona1.jpg"
          alt="Salón principal de Sr. Brocheta"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </section>

      {/* Bienvenida */}
      <section id="nosotros" className="scroll-mt-20 px-6 py-24">
        <h1 className={title}>Bienvenidos a Sr. Brocheta</h1>
        <p className={cn(paragraph, "mt-8")}>
          Nacimos de una receta de familia y un chuzo que no tardó en hacerse
          conocido en la ciudad.
        </p>
        <p className={cn(paragraph, "mt-5")}>
          Hoy somos tres sedes, un equipo que crece a diario y un mismo
          compromiso: comida urbana premium, servida rápido y sin perder el
          sabor de casa.
        </p>
        <div className="mt-10 text-center">
          <Link href="/reservas/nueva" className={button}>
            Reserva tu mesa
          </Link>
        </div>
      </section>

      <PhotoBand src="/images/platos/burger-sr-broche.jpg" alt="Burger Sr.Broche" />

      {/* Menú */}
      <section id="menu" className="scroll-mt-20 px-6 py-24">
        <h2 className={title}>Nuestro Menú</h2>
        <GoldRule />
        <p className={cn(paragraph, "mt-8")}>
          Hamburguesas, salchipapas y combos. Una probadita de lo que nos hace
          premium; el menú completo tiene mucho más.
        </p>
        <ul className="mx-auto mt-8 flex max-w-xl flex-col gap-2 font-serif text-xl">
          {favoritos.map((plato) => (
            <li key={plato.nombre} className="flex items-baseline gap-4">
              <span className="text-foreground">{plato.nombre}</span>
              <span className="min-w-6 flex-1 border-b border-dotted border-foreground/30" aria-hidden />
              <span className="shrink-0 text-gold">{plato.precio}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Link href={MENU_URL} target="_blank" className={button}>
            Explora el menú
          </Link>
        </div>
      </section>

      <PhotoBand src="/images/reservas/zona2.jpg" alt="Zona amplia del restaurante" />

      {/* Sedes y horarios */}
      <section id="ubicacion" className="scroll-mt-20 px-6 py-24">
        <h2 className={title}>Horarios y Ubicación</h2>
        <GoldRule />
        <p className={cn(paragraph, "mt-8")}>
          Abrimos todos los días de 5:00 pm a 11:00 pm.
        </p>
        <p className={cn(paragraph, "mt-3")}>
          Viernes, sábado, domingo y festivos: reservas en línea de 5:00 pm a
          7:00 pm.
        </p>
        <div className="mx-auto mt-12 grid max-w-4xl gap-10 text-center sm:grid-cols-3">
          {sedes.map((sede) => (
            <div key={sede.nombre} className="flex flex-col items-center">
              <h3 className="text-sm font-bold tracking-[0.1em] text-gold uppercase">
                {sede.nombre}
              </h3>
              <p className="mt-3 flex-1 font-serif text-lg leading-snug text-foreground/85">
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
        <p className={cn(paragraph, "mt-12")}>
          Pedidos y domicilios por WhatsApp:{" "}
          <Link href={WHATSAPP_URL} target="_blank" className="underline decoration-gold underline-offset-4 hover:text-gold">
            {PHONE_DISPLAY}
          </Link>
        </p>
        <div className="mt-10 text-center">
          <Link href={WHATSAPP_URL} target="_blank" className={button}>
            Pedir por WhatsApp
          </Link>
        </div>
      </section>

      {/* Instagram */}
      <section id="instagram" className="scroll-mt-20 px-5 pb-20 sm:px-6">
        <div className="grid grid-cols-2 gap-3">
          {instagramPosts.map((post) => (
            <Link
              key={post.href}
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver publicación en Instagram"
              className="group relative aspect-square overflow-hidden"
            >
              <Image
                src={post.src}
                alt={post.alt}
                fill
                sizes="50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="flex justify-center px-6 pb-10">
          <Image
            src="/images/reservas/brand-logo.png"
            alt="Sr. Brocheta"
            width={465}
            height={246}
            className="h-32 w-auto opacity-60 sm:h-36"
          />
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
          <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-bold tracking-[0.1em] text-foreground uppercase">
            <Link href={MENU_URL} target="_blank" className="hover:text-gold">
              Menú
            </Link>
            <Link href="/reservas/nueva" className="hover:text-gold">
              Reservas
            </Link>
            <Link href="#ubicacion" className="hover:text-gold">
              Ubicación
            </Link>
            <Link href={`mailto:${EMAIL}`} className="hover:text-gold">
              Contacto
            </Link>
          </nav>
        </div>
        <div className="bg-black py-3 text-center text-xs tracking-wide text-foreground/60">
          © {new Date().getFullYear()} Sr. Brocheta · Valledupar
        </div>
      </footer>
    </div>
  );
}
