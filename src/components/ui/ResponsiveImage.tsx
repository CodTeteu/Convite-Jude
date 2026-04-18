import type { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface ResponsiveImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  asset: string;
  alt: string;
  eager?: boolean;
  sizes?: string;
}

export function ResponsiveImage({
  asset,
  alt,
  className,
  eager = false,
  sizes = "100vw",
  ...props
}: ResponsiveImageProps) {
  const basePath = `/images/generated/${asset}`;

  return (
    <picture>
      <source srcSet={`${basePath}.avif`} type="image/avif" sizes={sizes} />
      <source srcSet={`${basePath}.webp`} type="image/webp" sizes={sizes} />
      <img
        {...props}
        src={`${basePath}.jpg`}
        alt={alt}
        className={cn("h-full w-full object-cover", className)}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}
