"use client";

import { Fragment, useEffect } from "react";

/**
 * Activa las animaciones de entrada al hacer scroll.
 * Todo elemento con `data-reveal` recibe la clase `is-visible` la primera vez
 * que entra en pantalla; el CSS de globals.css hace el resto.
 */
export function RevealObserver() {
  useEffect(() => {
    const elementos = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      elementos.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
    );
    elementos.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}

/** Parte un texto en palabras que suben desde una máscara, una tras otra. */
export function RevealWords({
  text,
  delay = 0,
  step = 70,
}: {
  text: string;
  delay?: number;
  step?: number;
}) {
  const palabras = text.split(" ");
  return (
    <>
      {palabras.map((palabra, i) => (
        <Fragment key={i}>
          <span className="reveal-word">
            <span style={{ "--d": `${delay + i * step}ms` } as React.CSSProperties}>
              {palabra}
            </span>
          </span>
          {i < palabras.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
