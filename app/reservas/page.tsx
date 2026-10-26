import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ReservaWizard } from "./reserva-wizard";

export const metadata: Metadata = {
  title: "Reserva | Sr. Brocheta",
  description: "Reserva tu mesa en Sr. Brocheta, Valledupar.",
};

export default function ReservasPage() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/images/logo.jpg"
              alt="Logo Sr. Brocheta"
              width={36}
              height={36}
              className="rounded-full ring-1 ring-primary/50"
            />
            <span className="font-semibold tracking-wide">SR. BROCHETA</span>
          </Link>
        </div>
      </header>
      <ReservaWizard />
    </div>
  );
}
