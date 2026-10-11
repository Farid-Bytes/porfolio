import Image from "next/image";

import portraitCutout from "@/public/images/ghulam-farid-profile-cutout.webp";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const portraitWidth = 960;
const portraitHeight = 960;

type ProfilePortraitProps = {
  className?: string;
  variant?: "framed" | "hero" | "avatar";
  priority?: boolean;
  /** Horizontally flip the cutout (CSS scale-x). */
  mirrored?: boolean;
};

export function ProfilePortrait({
  className,
  variant = "framed",
  priority = false,
  mirrored = false,
}: ProfilePortraitProps) {
  const showCaption = variant === "framed";

  // Compact circular avatar for the mobile hero / about header. The cutout is
  // a centred head-and-shoulders shot, so object-cover clips it cleanly into a
  // circle with the face filling the frame.
  if (variant === "avatar") {
    return (
      <div className={cn("relative mx-auto w-fit", className)}>
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-3 rounded-full bg-[radial-gradient(circle,rgb(20_184_166/0.35),rgb(6_182_212/0.16)_45%,transparent_70%)] blur-xl"
        />
        <div className="relative size-28 overflow-hidden rounded-full border border-line-accent bg-white/80 shadow-glow sm:size-32">
          <Image
            src={portraitCutout}
            alt={`${siteConfig.name} · ${siteConfig.role}`}
            width={portraitWidth}
            height={portraitHeight}
            sizes="128px"
            quality={80}
            priority={priority}
            placeholder="blur"
            className={cn(
              "size-full object-cover drop-shadow-[0_10px_24px_rgb(15_118_110/0.18)]",
              mirrored && "scale-x-[-1]",
            )}
          />
        </div>
      </div>
    );
  }

  return (
    <figure
      className={cn(
        "relative mx-auto",
        variant === "hero"
          ? "w-[min(100%,22rem)] lg:w-[min(100%,28rem)]"
          : "w-[min(100%,20rem)]",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-[12%] left-1/2 -z-10 size-[120%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(20_184_166/0.32),rgb(6_182_212/0.14)_42%,transparent_68%)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[8%] bottom-[4%] -z-10 h-[28%] rounded-[100%] bg-[radial-gradient(ellipse,rgb(15_118_110/0.22),transparent_70%)] blur-xl"
      />

      <Image
        src={portraitCutout}
        alt={`${siteConfig.name} · ${siteConfig.role}`}
        width={portraitWidth}
        height={portraitHeight}
        sizes={
          variant === "hero"
            ? "(max-width: 1024px) 70vw, 448px"
            : "(max-width: 640px) 80vw, 320px"
        }
        quality={80}
        priority={priority}
        placeholder="blur"
        className={cn(
          "relative z-[1] h-auto w-full object-contain drop-shadow-[0_18px_40px_rgb(15_118_110/0.18)]",
          mirrored && "scale-x-[-1]",
        )}
      />

      {showCaption ? (
        <figcaption className="relative z-[1] mt-5 text-center">
          <p className="text-base font-semibold text-ink">{siteConfig.name}</p>
          <p className="mt-1 font-mono text-[0.65rem] tracking-[0.16em] text-accent-500 uppercase">
            {siteConfig.role}
          </p>
        </figcaption>
      ) : null}
    </figure>
  );
}
