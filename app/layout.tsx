import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono, Kaushan_Script, Rye } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rye = Rye({
  variable: "--font-rye",
  weight: "400",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["500", "600"],
  subsets: ["latin"],
});

const kaushan = Kaushan_Script({
  variable: "--font-kaushan",
  weight: "400",
  subsets: ["latin"],
});

const TITLE = "Sr. Brocheta | Comida Urbana Premium en Valledupar";
const DESCRIPTION =
  "Hamburguesas, salchipapas y combos en Valledupar. El sabor que nos une. Pide a domicilio o visítanos en nuestras sedes.";

export const metadata: Metadata = {
  metadataBase: new URL("https://srbrocheta.com"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Sr. Brocheta",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sr. Brocheta - Comida Urbana Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${rye.variable} ${cormorant.variable} ${kaushan.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
