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
      <p
        className={cn(
          "font-heading text-[0.72rem] uppercase tracking-[0.32em] text-[var(--invite-sage)]",
          align === "center" && "justify-center",
        )}
      >
        {label}
      </p>
      <h2 className="mt-4 font-script italic font-medium text-5xl leading-none text-[var(--invite-brown)] sm:text-6xl md:text-7xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 font-body text-xl leading-relaxed text-[var(--invite-brown-soft)] sm:text-2xl">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
