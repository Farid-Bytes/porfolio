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
 * Contained neural web for the dark footer. Deferred until idle so it does
 * not compete with LCP / first hydration — same gate as DeferredChrome.
 */
export function FooterNeuralField() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const enable = () => {
      if (!cancelled) setReady(true);
    };

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(enable, { timeout: 1800 });
    } else {
      timeoutId = window.setTimeout(enable, 400);
    }

    return () => {
      cancelled = true;
      if (
        idleId !== undefined &&
        typeof window.cancelIdleCallback === "function"
      ) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  if (!ready) return null;

  return (
    <NeuralNetworkBackground
      variant="contained"
      tone="dark"
      className="z-0"
    />
  );
}
