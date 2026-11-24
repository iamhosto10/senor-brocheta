"use client";

import { type ReactNode } from "react";

const RAPPI_APP = "rappi://";

export function RappiLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  function abrirEnApp(e: React.MouseEvent<HTMLAnchorElement>) {
    const esMovil = /Android|iPhone|iPad/i.test(navigator.userAgent);
    if (!esMovil) return;
    e.preventDefault();
    const inicio = Date.now();
    window.location.href = RAPPI_APP;
    setTimeout(() => {
      if (!document.hidden && Date.now() - inicio < 2000) {
        window.location.href = href;
      }
    }, 1500);
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={abrirEnApp} className={className}>
      {children}
    </a>
  );
}
