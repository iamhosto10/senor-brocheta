import { Rye, Fraunces, Inter } from "next/font/google";
import "@/app/reservas-theme.css";

const rye = Rye({ subsets: ["latin"], weight: "400", variable: "--font-rye" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export function ReservasThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`reservas-theme ${rye.variable} ${fraunces.variable} ${inter.variable}`}
    >
      {children}
    </div>
  );
}
