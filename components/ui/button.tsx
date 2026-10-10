import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "icon";

const base =
  "group/button inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 " +
  "ease-out-soft hover:-translate-y-0.5 active:translate-y-px motion-reduce:transform-none " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent-500 text-white hover:bg-accent-400 shadow-[0_0_24px_-6px_rgb(20_184_166/0.45)] " +
    "hover:shadow-[0_0_32px_-6px_rgb(20_184_166/0.55)]",
  secondary:
    "border border-line-strong bg-white/90 text-ink hover:border-line-accent hover:bg-white",
  ghost: "text-ink-muted hover:text-ink hover:bg-white/60",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.9375rem]",
  icon: "size-11",
};

function buttonClasses(variant: Variant, size: Size, className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type StyleProps = {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & StyleProps) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props} />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & StyleProps) {
  return <a className={buttonClasses(variant, size, className)} {...props} />;
}
