import type { Metadata } from "next";
import { ReservasThemeProvider } from "@/components/reservas-theme-provider";

export const metadata: Metadata = {
  title: "Panel de reservas | Señor Brocheta",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ReservasThemeProvider>{children}</ReservasThemeProvider>;
}
