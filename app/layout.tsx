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

const TITLE = "Señor Brocheta | Salchipapas y Hamburguesas en Valledupar";
const DESCRIPTION =
  "Las mejores salchipapas de Valledupar. Hamburguesas, arepas y brochetas en Sede Dangond, Mayales Plaza y Guatapurí. Reserva o pide a domicilio.";

const KEYWORDS = [
  "comida rápida en Valledupar",
  "restaurantes en Valledupar",
  "dónde comer en Valledupar",
  "salchipapas en Valledupar",
  "restaurantes cerca de mí",
  "comida rápida cerca de mí",
  "hamburguesas en Valledupar",
  "domicilios de comida rápida en Valledupar",
  "mejor salchipapa de Valledupar",
  "restaurantes de comida rápida en Valledupar",
  "salchipapas a domicilio Valledupar",
  "dónde comer hamburguesas en Valledupar",
  "perros calientes en Valledupar",
  "restaurantes para cenar en Valledupar",
  "comida para compartir en Valledupar",
  "restaurante cerca de mí",
  "menú de comida rápida Valledupar",
  "brochetas en Valledupar",
  "Señor Brocheta Valledupar",
  "Master Pro Señor Brocheta",
];

export const metadata: Metadata = {
  metadataBase: new URL("https://srbrocheta.com"),
  title: TITLE,
  description: DESCRIPTION,
  keywords: KEYWORDS,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "Señor Brocheta",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Señor Brocheta - Comida urbana premium en Valledupar",
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
