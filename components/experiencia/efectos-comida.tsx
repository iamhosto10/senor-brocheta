/**
 * Efectos de comida para los interludios, dibujados en SVG (no pesan nada).
 * Las posiciones se generan con una semilla fija para que el servidor y el
 * navegador pinten exactamente lo mismo.
 *
 *  - "queso": papas fritas que barren la pantalla al entrar y al salir, y una
 *    lluvia de queso rallado y granos de maíz que cae con el scroll.
 *  - "salsa": una cortina de salsa que chorrea hacia abajo al entrar, gotas
 *    que caen y otra cortina que baja y cubre la pantalla al salir.
 */

function semilla(s: number) {
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/* ───────── Papas fritas ───────── */

/** Papas que cruzan la pantalla: posición vertical, largo, grosor y giro. */
export const PAPAS = [
  { top: 8, largo: 52, grueso: 4.2, giro: -14 },
  { top: 22, largo: 38, grueso: 3.4, giro: 9 },
  { top: 36, largo: 60, grueso: 4.8, giro: -6 },
  { top: 52, largo: 34, grueso: 3.2, giro: 16 },
  { top: 64, largo: 56, grueso: 4.4, giro: -11 },
  { top: 80, largo: 42, grueso: 3.8, giro: 7 },
];

function Papa({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 400 40" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd36b" />
          <stop offset="0.45" stopColor="#f4b23b" />
          <stop offset="1" stopColor="#c97a12" />
        </linearGradient>
      </defs>
      <rect x="1" y="2" width="398" height="36" rx="9" fill={`url(#${id}-g)`} />
      {/* Puntas doradas y marcas de fritura */}
      <rect x="1" y="2" width="22" height="36" rx="9" fill="#b8650c" opacity="0.55" />
      <rect x="377" y="2" width="22" height="36" rx="9" fill="#b8650c" opacity="0.45" />
      <path d="M60 12h70M170 26h90M290 14h60" stroke="#fff3c4" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <path d="M95 30h40M230 10h35" stroke="#a85a0a" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}

export function CapaPapas({ clase, id }: { clase: string; id: string }) {
  return (
    <>
      {PAPAS.map((p, i) => (
        <span
          key={i}
          aria-hidden
          className={`${clase} pointer-events-none absolute left-0 z-20 block drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)]`}
          style={{
            top: `${p.top}%`,
            width: `max(${p.largo}vw, 260px)`,
            height: `max(${p.grueso}vw, 26px)`,
            transform: `translateX(115vw) rotate(${p.giro}deg)`,
          }}
          data-giro={p.giro}
        >
          <Papa id={`${id}-${i}`} />
        </span>
      ))}
    </>
  );
}

/* ───────── Lluvia de queso rallado y maíz ───────── */

function miga(rand: () => number) {
  // Polígono irregular, como una miga de queso rallado
  const lados = 6 + Math.floor(rand() * 3);
  const pts: string[] = [];
  for (let i = 0; i < lados; i++) {
    const a = (i / lados) * Math.PI * 2;
    const rad = 0.62 + rand() * 0.38;
    pts.push(`${r2(50 + Math.cos(a) * 46 * rad)},${r2(50 + Math.sin(a) * 46 * rad)}`);
  }
  return pts.join(" ");
}

const LLUVIA = (() => {
  const rand = semilla(16);
  return Array.from({ length: 34 }, (_, i) => {
    const maiz = i % 5 === 0;
    return {
      maiz,
      left: r2(rand() * 96),
      top: r2(-10 - rand() * 60),
      size: r2(maiz ? 1.8 + rand() * 1.4 : 1.2 + rand() * 3),
      vel: r2(0.8 + rand() * 1.4),
      giro: Math.round(rand() * 540 - 270),
      blur: rand() < 0.25,
      forma: miga(rand),
      tono: rand() < 0.5 ? "#fff6dc" : "#f6e7b3",
    };
  });
})();

export function LluviaQueso() {
  return (
    <div className="ef-lluvia pointer-events-none absolute inset-0 z-[15] overflow-hidden" aria-hidden>
      {LLUVIA.map((m, i) => (
        <span
          key={i}
          className="ef-miga absolute block"
          data-vel={m.vel}
          data-giro={m.giro}
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: `max(${m.size}vw, ${m.maiz ? 14 : 8}px)`,
            height: `max(${m.size}vw, ${m.maiz ? 14 : 8}px)`,
            filter: m.blur ? "blur(2px)" : undefined,
          }}
        >
          <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)]">
            {m.maiz ? (
              <>
                <path d="M50 4C76 4 92 30 88 58 84 86 66 96 50 96S16 86 12 58C8 30 24 4 50 4Z" fill="#f7c531" />
                <path d="M34 22C40 14 56 12 64 18" stroke="#fff1a8" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.7" />
              </>
            ) : (
              <polygon points={m.forma} fill={m.tono} />
            )}
          </svg>
        </span>
      ))}
    </div>
  );
}

/* ───────── Cortina de salsa ───────── */

/** Borde inferior con chorreados: una curva por cada gota que cuelga. */
function caminoChorreado(seed: number, base: number, largoMax: number) {
  const rand = semilla(seed);
  let x = 1000;
  let d = `M0,0 H1000 V${base}`;
  while (x > 0) {
    const ancho = 22 + rand() * 46;
    const hueco = 10 + rand() * 60;
    const largo = 20 + rand() * largoMax;
    const c = x - hueco - ancho / 2;
    if (c - ancho / 2 < 0) break;
    const b = base + (rand() * 14 - 7);
    d += ` L${r2(c + ancho / 2)},${r2(b)}`;
    d += ` C${r2(c + ancho / 2)},${r2(b + largo * 1.25)} ${r2(c - ancho / 2)},${r2(b + largo * 1.25)} ${r2(c - ancho / 2)},${r2(b)}`;
    x = c - ancho / 2;
  }
  d += ` L0,${base} Z`;
  return d;
}

const SALSA_ROJA = caminoChorreado(7, 640, 230);
const SALSA_CREMA = caminoChorreado(21, 430, 170);

export function CortinaSalsa({ clase }: { clase: string }) {
  return (
    <div
      aria-hidden
      className={`${clase} pointer-events-none absolute inset-x-0 top-0 z-20 h-full`}
      style={clase.includes("salida") ? { visibility: "hidden" } : undefined}
    >
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d={SALSA_ROJA} fill="#a3171b" />
      </svg>
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        className="ef-salsa-crema absolute inset-0 h-full w-full drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]"
      >
        <path d={SALSA_CREMA} fill="#f3dfb4" />
        <path d={SALSA_CREMA} fill="none" stroke="#fff8e6" strokeWidth="4" opacity="0.6" transform="translate(0,-6)" />
      </svg>
    </div>
  );
}

const GOTAS = (() => {
  const rand = semilla(33);
  return Array.from({ length: 14 }, (_, i) => ({
    left: r2(4 + rand() * 92),
    top: r2(-15 - rand() * 50),
    size: r2(1.2 + rand() * 2.2),
    vel: r2(0.9 + rand() * 1.2),
    crema: i % 3 === 0,
  }));
})();

export function GotasSalsa() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[15] overflow-hidden" aria-hidden>
      {GOTAS.map((g, i) => (
        <span
          key={i}
          className="ef-miga absolute block"
          data-vel={g.vel}
          data-giro="0"
          style={{
            left: `${g.left}%`,
            top: `${g.top}%`,
            width: `max(${g.size}vw, 12px)`,
            height: `max(${g.size * 1.45}vw, 18px)`,
          }}
        >
          <svg viewBox="0 0 60 88" className="h-full w-full drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)]">
            <path d="M30 2C30 2 4 40 4 58a26 26 0 0 0 52 0C56 40 30 2 30 2Z" fill={g.crema ? "#f3dfb4" : "#b71c1c"} />
            <ellipse cx="20" cy="56" rx="5" ry="9" fill="#fff" opacity="0.35" />
          </svg>
        </span>
      ))}
    </div>
  );
}
