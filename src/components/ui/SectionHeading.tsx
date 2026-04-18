import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  label,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p className={cn("section-label", align === "center" && "justify-center")}>
        {label}
      </p>
      <h2 className="mt-6 text-4xl leading-tight font-semibold text-[color:var(--color-paper)] sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-8 text-white/72 sm:text-lg">{description}</p>
      ) : null}
    </Reveal>
  );
}
