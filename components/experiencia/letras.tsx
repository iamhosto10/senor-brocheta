/**
 * Parte un texto en letras animables, cada una dentro de una máscara.
 * Las palabras no se cortan al saltar de línea.
 */
export function Letras({ texto, className }: { texto: string; className?: string }) {
  const palabras = texto.split(" ");
  return (
    <span className={className} aria-hidden>
      {palabras.map((palabra, i) => (
        <span key={i} className="inline-block whitespace-nowrap">
          {Array.from(palabra).map((letra, j) => (
            <span key={j} className="mascara-letra">
              <span className="letra">{letra}</span>
            </span>
          ))}
          {i < palabras.length - 1 && <span className="inline-block w-[0.28em]" />}
        </span>
      ))}
    </span>
  );
}
