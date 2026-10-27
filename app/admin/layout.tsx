import { ReservasThemeProvider } from "@/components/reservas-theme-provider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ReservasThemeProvider>{children}</ReservasThemeProvider>;
}
