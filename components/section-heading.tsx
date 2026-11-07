import { cn } from "cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="text-xs font-semibold tracking-[0.25em] text-gold uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-2 font-sans text-3xl font-bold tracking-wide text-foreground uppercase sm:text-4xl">
        {title}
      </h2>
      <span className="mt-3 h-[3px] w-14 rounded-full bg-primary" aria-hidden />
      {description && (
        <p className="mt-4 max-w-xl text-pretty text-foreground/75">
          {description}
        </p>
      )}
    </div>
  );
}
