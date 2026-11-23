import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const triumph = localFont({
  variable: "--font-triumph",
  src: "../public/fonts/triumph-wheels-rough.woff2",
  weight: "400",
  display: "swap",
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
      className={`${montserrat.variable} ${triumph.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
