"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type LazyMountProps = {
  children: ReactNode;
  /**
   * Expand the intersection root so sections hydrate slightly before they
   * enter the viewport.
   */
  rootMargin?: string;
  /**
   * When true, also schedule an idle fallback so the first below-fold block
   * can hydrate without waiting for scroll.
   */
  idleFallback?: boolean;
  /** Minimum height placeholder while waiting to mount. */
  minHeight?: string;
  className?: string;
};

/**
 * Defers mounting heavy client islands until near the viewport (or idle),
 * cutting first-load hydration cost while preserving layout space.
 */
export function LazyMount({
  children,
  rootMargin = "200px 0px",
  idleFallback = false,
  minHeight = "24rem",
  className,
}: LazyMountProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;

    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const enable = () => {
      if (!cancelled) setMounted(true);
    };

    const node = rootRef.current;
    let observer: IntersectionObserver | undefined;

    if (node && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            enable();
            observer?.disconnect();
          }
        },
        { rootMargin },
      );
      observer.observe(node);
    } else {
      enable();
    }

    if (idleFallback) {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(enable, { timeout: 2200 });
      } else {
        timeoutId = window.setTimeout(enable, 800);
      }
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (
        idleId !== undefined &&
        typeof window.cancelIdleCallback === "function"
      ) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [idleFallback, mounted, rootMargin]);

  return (
    <div
      ref={rootRef}
      className={className}
      style={mounted ? undefined : { minHeight }}
    >
      {mounted ? children : null}
    </div>
  );
}
