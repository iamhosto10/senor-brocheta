import "@/app/reservas-theme.css";

export function ReservasThemeProvider({ children }: { children: React.ReactNode }) {
  return <div className="reservas-theme">{children}</div>;
}
