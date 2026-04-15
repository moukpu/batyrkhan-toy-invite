"use client";

import Image from "next/image";
import { MaskReveal } from "@/components/motion";

type CharacterIllustrationProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  tone?: "light" | "dark";
  priority?: boolean;
  delay?: number;
  sizes?: string;
};

export function CharacterIllustration({
  src,
  alt,
  className = "",
  imageClassName = "",
  tone = "light",
  priority = false,
  delay = 0,
  sizes = "(min-width: 1024px) 19rem, (min-width: 640px) 15rem, 62vw",
}: CharacterIllustrationProps) {
  const toneClass =
    tone === "dark"
      ? "character-illustration character-illustration-dark"
      : "character-illustration character-illustration-light";

  return (
    <MaskReveal delay={delay} className={className} rounded="0rem">
      <div className={toneClass}>
        <div className="relative h-full w-full">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            quality={82}
            sizes={sizes}
            className={`object-contain object-center ${imageClassName}`}
          />
        </div>
      </div>
    </MaskReveal>
  );
}
