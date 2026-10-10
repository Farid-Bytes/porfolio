"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which of the given section ids is currently the "reading position" of
 * the page, for navbar highlighting.
 *
 * The observer band sits just below the navbar and covers the upper third of
 * the viewport, so a section becomes active as it settles under the header
 * rather than the moment its first pixel appears. Ids that are not on the page
 * yet are simply ignored, which keeps the navbar honest while later phases add
 * the remaining sections.
 */
export function useActiveSection(ids: readonly string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    const sections = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    let pendingId: string | null = null;
    let rafId = 0;
    let currentId: string | null = null;

    const flush = () => {
      rafId = 0;
      if (pendingId == null || pendingId === currentId) return;
      currentId = pendingId;
      setActiveId(pendingId);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const topMost = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];

        if (!topMost) return;
        pendingId = topMost.target.id;
        if (pendingId === currentId) return;
        if (rafId) return;
        rafId = requestAnimationFrame(flush);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [key]);

  return activeId;
}
