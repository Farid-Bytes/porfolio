"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const NeuralNetworkBackground = dynamic(
  () =>
    import("@/components/3d/neural-network-background").then(
      (mod) => mod.NeuralNetworkBackground,
    ),
  { ssr: false },
);

/**
 * Mounts non-critical visual chrome after first paint so it does not compete
 * with LCP. Uses a client boundary because Next.js disallows `ssr: false`
 * dynamic imports inside Server Components.
 */
export function DeferredChrome() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const enable = () => {
      if (!cancelled) setReady(true);
    };

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(enable, { timeout: 1200 });
    } else {
      timeoutId = window.setTimeout(enable, 200);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  if (!ready) return null;

  return <NeuralNetworkBackground />;
}
