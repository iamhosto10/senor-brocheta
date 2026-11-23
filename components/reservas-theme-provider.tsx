import "@/app/reservas-theme.css";

export function ReservasThemeProvider({
  children,
  plain = false,
}: {
  children: React.ReactNode;
  plain?: boolean;
}) {
  return (
    <div className={plain ? "reservas-theme rt-plain" : "reservas-theme"}>
      {children}
    </div>
  );
}
