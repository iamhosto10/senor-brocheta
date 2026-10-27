import { ReservasThemeProvider } from "@/components/reservas-theme-provider";

export default function ReservasLayout({ children }: { children: React.ReactNode }) {
  return <ReservasThemeProvider>{children}</ReservasThemeProvider>;
}
