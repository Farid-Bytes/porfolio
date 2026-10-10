import { cn } from "@/lib/utils";

/**
 * One-pixel rule that fades out towards both ends, so section boundaries read
 * as light rather than as a hard box edge.
 */
export function Hairline({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "h-px w-full bg-gradient-to-r from-transparent via-line-strong to-transparent",
        className,
      )}
    />
  );
}
