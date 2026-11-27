import { cn } from "cn";

/**
 * Encabezado editorial de capítulo: a la izquierda el número y la etiqueta,
 * a la derecha la frase grande. Entra con las animaciones de data-reveal.
 */
export function CapituloIntro({
  numero,
  etiqueta,
  titulo,
  texto,
  className,
}: {
  numero: string;
  etiqueta: string;
  titulo: string;
  texto?: string;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-6 border-t border-gold/25 pt-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10", className)}>
      <p data-reveal="up" className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.3em] text-gold uppercase">
        <span className="size-1.5 rounded-full bg-gold" aria-hidden />
        Capítulo {numero} · {etiqueta}
      </p>
      <div>
        <h2
          data-reveal="up"
          className="text-pretty text-3xl leading-tight font-semibold text-white sm:text-4xl lg:text-5xl"
        >
          {titulo}
        </h2>
        {texto && (
          <p
            data-reveal="up"
            style={{ "--d": "120ms" } as React.CSSProperties}
            className="mt-5 max-w-2xl text-pretty text-base text-white/70 sm:text-lg"
          >
            {texto}
          </p>
        )}
      </div>
    </div>
  );
}
