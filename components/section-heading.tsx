import { cn } from "cn";
import { RevealWords } from "@/components/reveal-observer";

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
      data-reveal="heading"
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="reveal-eyebrow text-xs font-semibold tracking-[0.25em] text-gold uppercase">
          {eyebrow}
        </span>
      )}
      <h2
        aria-label={title}
        className="mt-2 font-display text-4xl leading-tight text-foreground sm:text-5xl"
      >
        <span aria-hidden>
          <RevealWords text={title} delay={120} />
        </span>
      </h2>
      <span className="reveal-line mt-4 h-[3px] w-14 rounded-full bg-gold" aria-hidden />
      {description && (
        <p className="reveal-fade mt-4 max-w-xl text-pretty text-foreground/75">
          {description}
        </p>
      )}
    </div>
  );
}
